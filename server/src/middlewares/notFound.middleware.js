import { StatusCodes } from 'http-status-codes'

const notFoundHandler = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "Route not found"
  });
};

export default notFoundHandler;