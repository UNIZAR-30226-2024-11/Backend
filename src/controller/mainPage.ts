import { Request, Response } from "express";

export const mainPageController = (req: Request, res: Response) => {
  res.send("Hello World");
};
