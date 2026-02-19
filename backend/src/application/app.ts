import express, { Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import createHttpError from "http-errors";
import { responseJsonWrapper } from "@/middlewares/responseJson";
import Helmet from "helmet";
import { errorHandler } from "@/middlewares/errorHandler";
import { ResponseTitleEnum as r, ResponseStatusCodeEnum as s } from "@/enum/response.enum";
import v1 from "@/routes/v1";
import { initSequelize } from "@/db/sequelize";

export async function createApp(): Promise<express.Express> {
    const app = express();
    await initSequelize();
    app.use(Helmet());
    app.use(compression());
    app.use(cors({ origin: "*" }));
    app.set("view engine", "jade");
    app.set("trust proxy", false);
    app.use(express.urlencoded({ limit: "100mb", extended: true }));
    app.use(express.json({ limit: "100mb" }));

    app.use(responseJsonWrapper);
    app.use("/v1", v1);

    app.get("/", (req: Request, res: Response) => {
        res.send("Hello, TypeScript Express!");
    });

    app.get("/test", (req: Request, res: Response) => {
        res.responseJson(s.SUCCESS, r.SUCCESS, "Success", null, null);
    });

    const errorForward: express.RequestHandler = (req, res, next) => {
        next(createHttpError(s.NOT_FOUND));
    };

    app.use(errorForward);
    app.use(errorHandler);

    return app;
}
