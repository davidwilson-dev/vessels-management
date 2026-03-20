import "dotenv/config";
import { parseUtils } from "#/utils/parse.utils.js";

const requiredEnvVars = [
  "BUILD_MODE",
  "MONGO_URI",
  "MONGO_DB_NAME",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "ACCESS_TOKEN_EXPIRE",
  "REFRESH_TOKEN_EXPIRE"
];

const getEnv = (key, defaultValue = "") => {
  return process.env[key] ?? defaultValue;
};

const env = {
  PORT: Number(getEnv("PORT", 8080)),
  LOCAL_DEV_PORT: Number(getEnv("LOCAL_DEV_PORT", 5000)),
  LOCAL_DEV_HOST: getEnv("LOCAL_DEV_HOST"),

  BUILD_MODE: getEnv("BUILD_MODE", "development"),

  CORS_ORIGINS: parseUtils.parseOrigins(getEnv("CORS_ORIGINS", "")),

  AUTHOR: getEnv("AUTHOR"),

  MONGO_URI: getEnv("MONGO_URI"),
  MONGO_DB_NAME: getEnv("MONGO_DB_NAME"),

  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),

  ACCESS_TOKEN_EXPIRE: getEnv("ACCESS_TOKEN_EXPIRE"),
  REFRESH_TOKEN_EXPIRE: getEnv("REFRESH_TOKEN_EXPIRE"),

  EMAIL_HOST: getEnv("EMAIL_HOST"),
  EMAIL_PORT: Number(getEnv("EMAIL_PORT", 587)),
  EMAIL_USER: getEnv("EMAIL_USER"),
  EMAIL_PASS: getEnv("EMAIL_PASS"),

  SERVER_URL: getEnv("SERVER_URL"),
  CLIENT_URL: getEnv("CLIENT_URL"),
  ADMIN_URL: getEnv("ADMIN_URL")
};

env.IS_DEVELOPMENT = env.BUILD_MODE === "development";
env.IS_PRODUCTION = env.BUILD_MODE === "production";

const missingEnvVars = requiredEnvVars.filter((key) => {
  const value = env[key];
  return value === undefined || value === null || value === "";
});

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

if (![ "development", "production" ].includes(env.BUILD_MODE)) {
  throw new Error(
    `Invalid BUILD_MODE: "${env.BUILD_MODE}". Allowed values: development, production`
  );
}

export default Object.freeze(env);