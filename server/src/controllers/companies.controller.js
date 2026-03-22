import { StatusCodes } from "http-status-codes";

import { companiesService } from "#/services/companies.service.js";

const getCompanies = async (req, res) => {
  const response = await companiesService.getCompanies(req.query);
  return res.status(StatusCodes.OK).json(response);
};

const createCompany = async (req, res) => {
  const response = await companiesService.createCompany(req.body);
  return res.status(StatusCodes.CREATED).json(response);
};

const getCompanyDetail = async (req, res) => {
  const response = await companiesService.getCompanyDetail(req.params.id);
  return res.status(StatusCodes.OK).json(response);
};

const updateCompany = async (req, res) => {
  const response = await companiesService.updateCompany(req.params.id, req.body);
  return res.status(StatusCodes.OK).json(response);
};

const deleteCompany = async (req, res) => {
  const response = await companiesService.deleteCompany(req.params.id);
  return res.status(StatusCodes.OK).json(response);
};

export const companiesController = {
  getCompanies,
  createCompany,
  getCompanyDetail,
  updateCompany,
  deleteCompany
};
