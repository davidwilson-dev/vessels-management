import { StatusCodes } from "http-status-codes";
import env from "#/config/environment.config.js";
import ApiError from "#/errors/ApiError.js";

const allowedOrigins = env.CORS_ORIGINS;

const corsOptions = {
  origin(origin, callback) {
    // // Allow requests without origin (Postman, mobile apps, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Development: allow all origins
    if (env.IS_DEVELOPMENT) {
      return callback(null, true);
    }

    // Production: only allow whitelisted origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new ApiError(StatusCodes.FORBIDDEN, "Not allowed by CORS")
    );
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

export default corsOptions;