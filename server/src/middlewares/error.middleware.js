import { StatusCodes } from 'http-status-codes'
import env from '#/config/environment.config.js'

const errorHandler = (error, req, res, next) => {
  const responseError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || StatusCodes[error.statusCode],
    stack: env.BUILD_MODE !== 'development' ? null : error.stack
  }

  res.status(responseError.statusCode).json(responseError)
};

export default errorHandler;