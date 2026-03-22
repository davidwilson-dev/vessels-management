import { StatusCodes } from "http-status-codes";

import { crewMembersService } from "#/services/crewMembers.service.js";

const getCrewMembers = async (req, res) => {
  const response = await crewMembersService.getCrewMembers(req.query);
  return res.status(StatusCodes.OK).json(response);
};

const createCrewMember = async (req, res) => {
  const response = await crewMembersService.createCrewMember(req.body);
  return res.status(StatusCodes.CREATED).json(response);
};

const getCrewMemberDetail = async (req, res) => {
  const response = await crewMembersService.getCrewMemberDetail(req.params.id);
  return res.status(StatusCodes.OK).json(response);
};

const updateCrewMember = async (req, res) => {
  const response = await crewMembersService.updateCrewMember(req.params.id, req.body);
  return res.status(StatusCodes.OK).json(response);
};

const deleteCrewMember = async (req, res) => {
  const response = await crewMembersService.deleteCrewMember(req.params.id);
  return res.status(StatusCodes.OK).json(response);
};

export const crewMembersController = {
  getCrewMembers,
  createCrewMember,
  getCrewMemberDetail,
  updateCrewMember,
  deleteCrewMember
};
