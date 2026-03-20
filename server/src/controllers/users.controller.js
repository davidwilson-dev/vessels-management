import { StatusCodes } from "http-status-codes";

import { usersService } from "#/services/users.service.js";

const getUsers = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const response = await usersService.getUsers({
    page,
    limit
  });
  
  return res.status(StatusCodes.OK).json(response);
};

const createUser = async (req, res) => {
  const response = await usersService.createUser(req.body);
  return res.status(StatusCodes.CREATED).json(response);
};

const updateUser = async (req, res) => {
  const response = await usersService.updateUser(req.params.id, req.body);
  return res.status(StatusCodes.OK).json(response);
};

const deleteUser = async (req, res) => {
  const response = await usersService.deleteUser(req.params.id);
  return res.status(StatusCodes.OK).json(response);
};

const lockUser = async (req, res) => {
  const response = await usersService.lockUser(req.params.id);
  return res.status(StatusCodes.OK).json(response);
};

export const usersController = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  lockUser
}
