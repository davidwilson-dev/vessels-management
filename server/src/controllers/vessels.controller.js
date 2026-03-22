import { StatusCodes } from "http-status-codes";

import { vesselsService } from "#/services/vessels.service.js";

const getVessels = async (req, res) => {
  const response = await vesselsService.getVessels(req.query);
  return res.status(StatusCodes.OK).json(response);
};

const createVessel = async (req, res) => {
  const response = await vesselsService.createVessel(req.body);
  return res.status(StatusCodes.CREATED).json(response);
};

const getVesselDetail = async (req, res) => {
  const response = await vesselsService.getVesselDetail(req.params.id);
  return res.status(StatusCodes.OK).json(response);
};

const updateVessel = async (req, res) => {
  const response = await vesselsService.updateVessel(req.params.id, req.body);
  return res.status(StatusCodes.OK).json(response);
};

const deleteVessel = async (req, res) => {
  const response = await vesselsService.deleteVessel(req.params.id);
  return res.status(StatusCodes.OK).json(response);
};

export const vesselsController = {
  getVessels,
  createVessel,
  getVesselDetail,
  updateVessel,
  deleteVessel
};
