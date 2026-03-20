import { StatusCodes } from "http-status-codes";

import { usersRepo } from "#/repositories/users.repo.js";
import { userProfilesRepo } from "#/repositories/userProfiles.repo.js";

import { bcryptProvider } from "#/providers/bcrypt.provider.js";

import ApiError from "#/errors/ApiError.js";

const toSafeUser = (user, profile) => ({
  id: user._id,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  profile: profile ? {
    id: profile._id,
    name: profile.name,
    dateOfBirth: profile.dateOfBirth,
    address: profile.address,
    idCardNumber: profile.idCardNumber,
    phoneNumber: profile.phoneNumber,
    gender: profile.gender,
    position: profile.position,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt
  } : undefined
});

const getUsers = async (data) => {
  const page = Math.max(Number(data.page) || 1, 1);
  const limit = Math.min(Math.max(Number(data.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const result = await usersRepo.getUsers(limit, skip);

  const users = result[0]?.data || [];
  const totalUsers = result[0]?.totalCount?.[0]?.count || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    pagination: {
      page,
      limit,
      skip,
      totalUsers,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages
    }
  };
};

const createUser = async (data) => {
  const {
    email,
    password,
    name,
    dateOfBirth,
    address,
    idCardNumber,
    phoneNumber,
    gender,
    position,
    avatarUrl,
    bio
  } = data;

  const normalizedEmail = email.trim().toLowerCase();

  const existedUser = await usersRepo.findByEmail(normalizedEmail);
  if (existedUser) throw new ApiError(StatusCodes.CONFLICT, "Email already exists");

  const hashedPassword = await bcryptProvider.hashPassword(password);

  const user = await usersRepo.create({
    email: normalizedEmail,
    password: hashedPassword,
    role: "staff",
    emailVerified: true,
    isActive: true
  });

  const parsedDateOfBirth = new Date(dateOfBirth);
  if (Number.isNaN(parsedDateOfBirth.getTime())) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid dateOfBirth");
  }

  const userProfilePayload = {
    userId: user._id,
    name,
    dateOfBirth: parsedDateOfBirth,
    address,
    idCardNumber,
    phoneNumber,
    gender,
    position,
    avatarUrl,
    bio
  };

  Object.keys(userProfilePayload).forEach((key) => {
    if (userProfilePayload[key] === undefined) delete userProfilePayload[key];
  });

  const userProfile = await userProfilesRepo.createUserProfile(userProfilePayload);
  const safeUser = toSafeUser(user, userProfile);
  return { user: safeUser };
};

const updateUser = async (userId, data) => {
  const user = await usersRepo.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  const userPayload = {};
  const profilePayload = {};

  if (data.email) {
    const normalizedEmail = data.email.trim().toLowerCase();
    if (normalizedEmail !== user.email) {
      const existedUser = await usersRepo.findByEmail(normalizedEmail);
      if (existedUser && existedUser._id.toString() !== userId) {
        throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
      }
    }
    userPayload.email = normalizedEmail;
  }

  if (data.password) {
    userPayload.password = await bcryptProvider.hashPassword(data.password);
    userPayload.passwordChangedAt = new Date();
  }

  if (typeof data.isActive === "boolean") {
    userPayload.isActive = data.isActive;
  }

  if (typeof data.emailVerified === "boolean") {
    userPayload.emailVerified = data.emailVerified;
  }

  if (data.name !== undefined) profilePayload.name = data.name;
  if (data.dateOfBirth !== undefined) {
    const parsedDateOfBirth = new Date(data.dateOfBirth);
    if (Number.isNaN(parsedDateOfBirth.getTime())) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid dateOfBirth");
    }
    profilePayload.dateOfBirth = parsedDateOfBirth;
  }
  if (data.address !== undefined) profilePayload.address = data.address;
  if (data.idCardNumber !== undefined) profilePayload.idCardNumber = data.idCardNumber;
  if (data.phoneNumber !== undefined) profilePayload.phoneNumber = data.phoneNumber;
  if (data.gender !== undefined) profilePayload.gender = data.gender;
  if (data.position !== undefined) profilePayload.position = data.position;
  if (data.avatarUrl !== undefined) profilePayload.avatarUrl = data.avatarUrl;
  if (data.bio !== undefined) profilePayload.bio = data.bio;

  let updatedUser = user;
  if (Object.keys(userPayload).length > 0) {
    updatedUser = await usersRepo.updateById(userId, userPayload);
  }

  let updatedProfile;
  if (Object.keys(profilePayload).length > 0) {
    updatedProfile = await userProfilesRepo.updateByUserId(userId, profilePayload);
    if (!updatedProfile) throw new ApiError(StatusCodes.NOT_FOUND, "User profile not found");
  } else {
    updatedProfile = await userProfilesRepo.findByUserId(userId);
  }

  const safeUser = toSafeUser(updatedUser, updatedProfile);
  return { user: safeUser };
};

const deleteUser = async (userId) => {
  const user = await usersRepo.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  await Promise.all([
    userProfilesRepo.deleteByUserId(userId),
    usersRepo.deleteById(userId)
  ]);

  return { message: "User deleted" };
};

const lockUser = async (userId) => {
  const user = await usersRepo.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  const updatedUser = await usersRepo.updateById(userId, { isActive: false });
  const userProfile = await userProfilesRepo.findByUserId(userId);
  const safeUser = toSafeUser(updatedUser, userProfile);
  return { user: safeUser };
};

export const usersService = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  lockUser
}
