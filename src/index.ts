import express, { Request, Response } from "express";
import type { Express } from "express";
import path from "path";

const app: Express = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("ok");
});

export default app;