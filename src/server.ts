import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { default as UserRouter } from "./routes/users";
import { default as CharityRouter } from "./routes/charities";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const logger = (req: Request, res:Response, next: NextFunction) => {
  console.log("Middleware");
  next();
}

app.use(logger);
app.use("/", UserRouter);
app.use("/charities", CharityRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("<h3>Home route</h3>");
});

app.get("/about", (req: Request, res: Response) => {
  res.send("About route");
});


app.listen(port, () => {
  console.log("[charityhub. server]: Server is running at port", port);
});

