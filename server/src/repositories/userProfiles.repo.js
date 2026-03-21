import { UserProfile } from "#/models/user-auth/userProfile.model.js"

const getUserProfiles = async (limit, skip) => {
  const users = await UserProfile.find()
    .populate({
      path: "userId",
      select: "-password" 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return users;
};

const findByUserId = (userId) => {
  return UserProfile.findOne({ userId }).lean();
};

const createUserProfile = async (userProfileData) => {
  const userProfile = await UserProfile.create(userProfileData);

  return userProfile;
};

const updateByUserId = (userId, payload) => {
  return UserProfile.findOneAndUpdate(
    { userId },
    { $set: payload },
    {
      returnDocument: "after",
      runValidators: true,
      lean: true
    }
  );
};

const deleteByUserId = (userId) => {
  return UserProfile.deleteOne({ userId });
};

export const userProfilesRepo = {
  getUserProfiles,
  findByUserId,
  createUserProfile,
  updateByUserId,
  deleteByUserId
}
