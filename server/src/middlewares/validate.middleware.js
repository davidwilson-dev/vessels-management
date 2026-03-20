import { StatusCodes } from 'http-status-codes'
import ApiError from '#/errors/ApiError.js';

const validate = (schema) => async (req, res, next) => {
  try {
    if (schema.body) {
      const value = await schema.body.validateAsync(req.body, {abortEarly: false});
      Object.assign(req.body, value);
    }

    if (schema.query) {
      const value = await schema.query.validateAsync(req.query, {abortEarly: false});
      Object.assign(req.query, value);
    }

    if (schema.params) {
      const value = await schema.params.validateAsync(req.params, {abortEarly: false});
      Object.assign(req.params, value);
    }

    next();
  } catch (err) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, err.message)) ;
  }
};

export default validate;