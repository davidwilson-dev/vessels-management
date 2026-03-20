import ms from 'ms';
import { StatusCodes } from "http-status-codes";

import { authService } from "#/services/auth.service.js";
import env from '#/config/environment.config.js';

import { checkDevice } from "#/utils/checkDevice.utils.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.BUILD_MODE === 'production',
  sameSite: env.BUILD_MODE === 'production' ? 'strict' : 'lax',
  maxAge: ms(env.REFRESH_TOKEN_EXPIRE)
};

const register = async (req, res) => {
  const response = await authService.register({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  });
  return res.status(StatusCodes.CREATED).json(response);
};

const verifyEmail = async (req, res) => {
  const { userId, verifyToken } = req.query;

  if (!userId || !verifyToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid verify link");
  }

  await authService.verify({ userId, verifyToken });

  const acceptsHtml = req.headers.accept?.includes("text/html") ?? false;

  if (acceptsHtml && env.CLIENT_URL) {
    const baseUrl = env.CLIENT_URL.replace(/\/$/, "");

    const params = new URLSearchParams({
      userId,
      verifyToken
    });

    return res.redirect(302, `${baseUrl}/verify-email?${params}`);
  }

  return res.status(StatusCodes.OK).json({ message: "Verify successfully!" });
};

const login = async (req, res) => {
  // Get device info and ip
  const deviceInfo = checkDevice.getDeviceInfo(req);
  const ip = checkDevice.getClientIp(req);
  
  // Get response
  const response = await authService.login({
    email: req.body.email,
    password: req.body.password,
    deviceInfo,
    ip
  });

  //Set cookie
  const accessToken = response.accessToken;
  res.cookie('refreshToken', response.refreshToken, cookieOptions);

  // Return response
  const safeUser = response.safeUser;
  return res.status(StatusCodes.OK).json({
    safeUser,
    accessToken
  });
};

const logout = async (req, res) => {
  // Get device info
  const userAgent = req.headers["user-agent"] || "unknown";

  // Get real IP
  const ip = checkDevice.getClientIp(req);

  // Handle refreshToken
  const refreshToken = req.cookies.refreshToken;
  await authService.logout({
    refreshToken,
    ip,
    userAgent,
  });

  // Return response;
  res.clearCookie('refreshToken', cookieOptions);
  res.status(StatusCodes.OK).json({ loggedOut: true });
}

const refreshToken = async (req, res) => {
  const refreshTokenValue = req.cookies.refreshToken;

  // Get device info and ip
  const deviceInfo = checkDevice.getDeviceInfo(req);
  const ip = checkDevice.getClientIp(req);

  // Get response
  const response = await authService.refreshToken({ 
    refreshToken: refreshTokenValue,
    deviceInfo,
    ip
  });

  // Return response
  res.cookie('refreshToken', response.refreshToken, cookieOptions);
  res.status(StatusCodes.OK).json({ 
    accessToken: response.accessToken,
    user: response.safeUser
   });
}

export const authController = {
  register,
  verifyEmail,
  login,
  logout,
  refreshToken
}
