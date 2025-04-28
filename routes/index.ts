import express, { Application, Request, Response, NextFunction } from "express";
import { json } from "body-parser";
import { resolve } from "path";
import api from "./api";
import { HttpError } from "./error.type";

export default function configure(app: Application) {
  app
    .get("/", (req: Request, res: Response, next: NextFunction) => {
      res.sendFile(resolve(__dirname, "../index.html"));
    })
    .use(express.static("public"))
    .use(json())
    .use("/api", api())
    .use("/error", (req: Request, res: Response, next: NextFunction) => {
      next(new Error("Something went wrong"));
    })

    // process not found error
    .use((req: Request, res: Response, next: NextFunction) => {
      const error = new Error("Not Found");
      (error as HttpError).status = 404;
      next(error);
    })

    // process all errors
    .use(
      (error: HttpError, req: Request, res: Response, next: NextFunction) => {
        const status = error.status || 500;
        const message = status === 404 ? "Not Found" : "Internal Server Error";
        const filePath =
          status === 404
            ? resolve(__dirname, "../notfound.html")
            : resolve(__dirname, "../error.html");

        res.status(status).sendFile(filePath);
      }
    );
}
