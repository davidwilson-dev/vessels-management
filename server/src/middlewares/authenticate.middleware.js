import ApiError from "#/errors/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { jwtProvider } from "#/providers/jwt.provider.js";

const authenticateMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized")
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtProvider.verifyAccessToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized")
    );
  }

}

export default authenticateMiddleware;
