import "module-alias/register";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import corsOptions from "#/config/cors.config.js";
import { routes } from "#/routes/index.route.js";
import notFoundHandler from "#/middlewares/notFound.middleware.js";
import errorHandler from "#/middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;