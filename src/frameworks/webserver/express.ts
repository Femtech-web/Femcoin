import Express, { Request, Response } from "express";
import bodyParser from "body-parser";

export default function expressConfig(app: Express.Application) {
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    }),
  );

  // health check
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "Everything is good!",
    });
  });
}
