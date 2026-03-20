import ApiError from "#/errors/ApiError.js";
import { StatusCodes } from "http-status-codes";

const normalizeRoles = (roles) => {
  if (!roles) return null;
  return Array.isArray(roles) ? roles : [roles];
};

const authorizeMiddleware = (allowedRoles = null) => {
  const normalizedRoles = normalizeRoles(allowedRoles);

  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return next(
          new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized")
        );
      }

      if (!user.role) {
        return next(
          new ApiError(StatusCodes.FORBIDDEN, "Forbidden")
        );
      }

      if (normalizedRoles && normalizedRoles.length > 0) {
        if (!normalizedRoles.includes(user.role)) {
          return next(
            new ApiError(StatusCodes.FORBIDDEN, "Forbidden")
          );
        }
      } else if (user.role === "guest") {
        return next(
          new ApiError(StatusCodes.FORBIDDEN, "Forbidden")
        );
      }

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error"));
    }
  };
}

export default authorizeMiddleware;
