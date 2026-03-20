import express from "express";

import auththenticateMiddleware from "#/middlewares/authenticate.middleware.js";

const router = express.Router();

router.get("/user-profile", auththenticateMiddleware, (req, res) => {
  res.json({message: "User profile page"});
});

export const clientRoute = router;
