import { User } from "#/models/user.model.js"

const findByEmail= (email) => {
  return User.findOne({ email })
};

const findById = (id) => {
  return User.findById(id)
};

const create = (data) => {
  return User.create(data)
}

const updateById = (id, payload) => {
  return User.findByIdAndUpdate(
    { _id: id },
    { $set: payload },
    {
      returnDocument: "after",
      runValidators: true,
      lean: true
    }
  )
}

const deleteById = (id) => {
  return User.deleteOne({ _id: id });
}

const verifyEmail = (userId, payload) => {
  return User.findByIdAndUpdate(
    {
      _id: userId,
      emailVerified: false,
      isActive: false
    },
    { $set: payload },
    { 
      returnDocument: 'after', 
      runValidators: true,
      lean: true
    }
  )
}

const getUsers = async (limit, skip) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "userprofiles",
        localField: "_id",
        foreignField: "userId",
        as: "profile" // The join result will be in the "profile" array.
      }
    },
    {
      $unwind: {
        path: "$profile",
        preserveNullAndEmptyArrays: true // If the user has no profile, keep that user; the profile will be null.
      }
    },
    { // Hide fields that don't want to return.
      $project: {
        password: 0,
        __v: 0,
        "profile.__v": 0
      }
    },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: Number(skip) },
          { $limit: Number(limit) }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    }
    // {
    //   $sort: {
    //     createdAt: -1 // 1: Ascending, -1: Descending
    //   }
    // },
    // {
    //   $skip: Number(skip)
    // },
    // {
    //   $limit: Number(limit)
    // }
  ]);

  return users;
}

export const usersRepo = {
  findByEmail,
  findById,
  create,
  updateById,
  deleteById,
  verifyEmail,
  getUsers
}
