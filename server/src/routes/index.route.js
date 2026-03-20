import express from 'express';
import { authRoute } from "./auth.route.js";
import { clientRoute } from "./client.route.js";
import { adminRoute } from "./admin.route.js";

const Router = express.Router();

Router.use("/auth", authRoute);

Router.use("/", clientRoute);

Router.use("/admin", adminRoute);

export const routes =  Router;
