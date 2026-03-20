import bcrypt from "bcrypt"

const hashPassword = (password) => {
  return bcrypt.hash(password, 12) //bcrypt.hash is async function
}

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash)
}

const hashToken = (token) => {
  return bcrypt.hash(token, 12)
}

const compareToken = (token, hash) => {
  return bcrypt.compare(token, hash)
}

export const bcryptProvider = {
  hashPassword,
  comparePassword,
  hashToken,
  compareToken
}