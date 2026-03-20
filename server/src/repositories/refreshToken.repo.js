import { RefreshToken } from "#/models/refreshToken.model.js"

const create = (data) => {
  return RefreshToken.create(data)
};

const findByToken = (tokenHash) => {
  return RefreshToken.findOne({
    tokenHash,
    revoked: false,
    expiresAt: { $gt: new Date() }
  }).lean();
};

const deleteToken = (tokenHash) => {
  return RefreshToken.deleteOne({ tokenHash });
};

const revoke = (tokenHash) => {
  return RefreshToken.updateOne(
    { tokenHash },
    {
      revoked: true,
      revokedAt: new Date()
    }
  )
};

const revokeAll = (userId) => {
  return RefreshToken.updateMany( 
    { userId }, 
    { revoked: true } 
  )
}

export const refreshTokenRepo = {
  create,
  findByToken,
  deleteToken,
  revoke,
  revokeAll
}
