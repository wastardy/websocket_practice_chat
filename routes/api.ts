import { NextFunction, Request, Response, Router } from "express";
import users from "./user";

export default function api() {
  const router = Router();

  router
    .use((req: Request, res: Response, next: NextFunction) => {
      if (!req.body) {
        next(new Error("Bad Request"));
      }

      next();
    })
    .use("/v1", apiV1())
    .use((req, res, next) => {
      res.json({
        error: "Invalid route",
      });
    });

  return router;
}

function apiV1() {
  const router = Router();

  router
    .use((req: Request, res: Response, next: NextFunction) => {
      console.log("API V1");
      next();
    })
    .use("/users", users());

  return router;
}
