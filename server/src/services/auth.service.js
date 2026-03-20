import { StatusCodes } from "http-status-codes";
import ms from "ms";

import { usersRepo } from "#/repositories/users.repo.js";
import { userProfilesRepo } from "#/repositories/userProfiles.repo.js";
import { verifyTokenRepo } from "#/repositories/verifyToken.repo.js";
import { refreshTokenRepo } from "#/repositories/refreshToken.repo.js";
import { auditLogRepo } from "#/repositories/auditLog.repo.js";

import { bcryptProvider } from "#/providers/bcrypt.provider.js";
import { jwtProvider } from "#/providers/jwt.provider.js";
import { cryptoProvider } from "#/providers/crypto.provider.js";
import { nodemailerProvider } from "#/providers/nodemailer.provider.js";

import ApiError from "#/errors/ApiError.js";
import env from "#/config/environment.config.js";

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const register = async (data) => {
  const { email, password, name } = data;
  const normalizedEmail = email.trim().toLowerCase();

  // Check exsited User
  const existedUser = await usersRepo.findByEmail(normalizedEmail);
  if (existedUser) throw new ApiError(StatusCodes.CONFLICT, "Email already exists");

  // Hash data
  const hashedPassword = await bcryptProvider.hashPassword(password);

  // Create new User
  const user = await usersRepo.create({
    email: normalizedEmail,
    password: hashedPassword,
  })

  // Create user profile
  const userProfile = await userProfilesRepo.createUserProfile({
    userId: user._id,
    name: name || "New User",
    dateOfBirth: new Date(),
  })

  // Handle verify token 
  const verifyToken = cryptoProvider.generateRandomToken();
  const verifyTokenHash = await bcryptProvider.hashToken(verifyToken);
  const verifyTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

  await verifyTokenRepo.create({
    userId: user._id,
    verifyTokenHash,
    type: "verify_email",
    expiresAt: verifyTokenExpires
  })
  
  // Send email
  await nodemailerProvider.sendEmail({
    email: user.email,
    displayName: user.displayName,
    verifyToken,
    userId: user._id
  });

  // Return response
  const safeUser = toSafeUser(user);
  safeUser.name = userProfile.name;
  return { safeUser, verifyTokenHash };
};

const verify = async (data) => {
  const { userId, verifyToken } = data;
  const user = await usersRepo.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  if (user.emailVerified && user.isActive) {
    return;
  }
  // Check verify token hash
  const recordVerifyToken = await verifyTokenRepo.findByUser(userId,"verify_email");

  if(!recordVerifyToken) throw new ApiError(StatusCodes.NOT_FOUND, "Token not found");

  const matchVerifyToken = await bcryptProvider.compareToken(verifyToken, recordVerifyToken.verifyTokenHash);

  if(!matchVerifyToken) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Invalid token");

  if(recordVerifyToken.expiresAt < new Date()) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token expired");

  // Update user verify
  const payload = {
    emailVerified: true,
    isActive: true
  }
  await usersRepo.verifyEmail(data.userId, payload);

  // Delete verify token
  await verifyTokenRepo.deleteToken(recordVerifyToken._id);
}

const login = async (data) => {
  // Get data and normalize
  const { email, password, deviceInfo, ip } = data;
  const normalizedEmail = email.trim().toLowerCase();

  // Check input login
  const user = await usersRepo.findByEmail(normalizedEmail);
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const match = await bcryptProvider.comparePassword(password, user.password);
  if (!match) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  // Check User active
  if (!user.emailVerified || !user.isActive) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Please verify your email to activate your account"
    );
  }

  // Handle Token
  const userInfo = {_id: user._id, email: user.email, role: user.role };
  const accessToken = jwtProvider.generateAccessToken(userInfo);
  const refreshToken = jwtProvider.generateRefreshToken(userInfo);
  const refreshTokenHash = await cryptoProvider.hashToken(refreshToken);

  await refreshTokenRepo.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    browser: deviceInfo.browser || "unknown",
    browserVersion: deviceInfo.browserVersion || "unknown",
    os: deviceInfo.os || "unknown",
    osVersion: deviceInfo.osVersion || "unknown",
    deviceType: deviceInfo.deviceType || "unknown",
    userAgent: deviceInfo.userAgent || "unknown",
    ip: ip || "unknown",
    expiresAt: new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRE)),
  });

  // Audit log
  await auditLogRepo.create({
    userId: user._id,
    action: "login",
    ip: ip,
    userAgent: deviceInfo.userAgent || "unknown"
  });

  // Return response
  const safeUser = toSafeUser(user);
  return { safeUser, accessToken, refreshToken };
};

const logout = async (data) => {
  const { refreshToken, ip, userAgent } = data;

  if (!refreshToken) throw new ApiError(StatusCodes.BAD_REQUEST, "Bad request");

  // Get userID before revoking
  const refreshTokenHash = await cryptoProvider.hashToken(refreshToken); 
  const recordToken = await refreshTokenRepo.findByToken(refreshTokenHash);
  if (!recordToken) throw new ApiError(StatusCodes.UNAUTHORIZED, "Bad request");

  // Revoke refresh token
  await refreshTokenRepo.revoke(recordToken.tokenHash);

  // Audit log
  // await auditLogRepo.create({
  //   userId: recordToken.userId,
  //   action: "logout",
  //   ip,
  //   userAgent
  // });

  return;
};

const refreshToken = async (data) => {
  const { refreshToken, deviceInfo, ip } = data;

  if (!refreshToken) throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token not provided");

  // Check token record
  const refreshTokenHash = await cryptoProvider.hashToken(refreshToken);
  const recordToken = await refreshTokenRepo.findByToken(refreshTokenHash);
  if (!recordToken) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");

  // Check device info
  const tokenDeviceInfo = {
    browser: recordToken.browser || "unknown",
    browserVersion: recordToken.browserVersion || "unknown",
    os: recordToken.os || "unknown",
    osVersion: recordToken.osVersion || "unknown",
    deviceType: recordToken.deviceType || "unknown",
    userAgent: recordToken.userAgent || "unknown"
  };

  const isSameDevice = Object.entries(tokenDeviceInfo).every(
    ([key, value]) => value === (deviceInfo[key] ?? "unknown")
  );
  // Revoke the token and require re-login
  if (!isSameDevice || recordToken.ip !== ip) {
    await refreshTokenRepo.revoke(recordToken.tokenHash);
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token used from different device");
  }

  // Get user
  const user = await usersRepo.findById(recordToken.userId);
  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");

  // Generate new tokens
  const userInfo = {_id: user._id, email: user.email, role: user.role };
  const newAccessToken = jwtProvider.generateAccessToken(userInfo);
  const newRefreshToken = jwtProvider.generateRefreshToken(userInfo);
  const newRefreshTokenHash = await cryptoProvider.hashToken(newRefreshToken);

  // Revoke old refresh token and save new refresh token
  await refreshTokenRepo.revoke(recordToken.tokenHash);
  await refreshTokenRepo.create({
    userId: user._id,
    tokenHash: newRefreshTokenHash,
    browser: deviceInfo.browser || "unknown",
    browserVersion: deviceInfo.browserVersion || "unknown",
    os: deviceInfo.os || "unknown",
    osVersion: deviceInfo.osVersion || "unknown",
    deviceType: deviceInfo.deviceType || "unknown",
    userAgent: deviceInfo.userAgent || "unknown",
    ip: ip || "unknown",
    expiresAt: new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRE)),
  });

  // Audit log
  await auditLogRepo.create({
    userId: user._id,
    action: "refresh_token",
    ip,
    userAgent: deviceInfo.userAgent || "unknown"
  });

  // Return response
  const safeUser = toSafeUser(user);
  return { safeUser, accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const authService = {
  register,
  verify,
  login,
  logout,
  refreshToken
}
