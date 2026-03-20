import { VerifyToken } from "#/models/verifyToken.model.js"

const create = (data) => {
  return VerifyToken.create(data)
};

const findByUser = (userId,type) => {
  return VerifyToken.findOne({userId,type})
};

const deleteToken = (id) => {
  return VerifyToken.deleteOne({_id:id})
};

export const verifyTokenRepo={
  create,
  findByUser,
  deleteToken
}