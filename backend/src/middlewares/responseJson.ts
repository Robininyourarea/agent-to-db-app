import { Response, Request, NextFunction } from "express";
import { ResponseTitleEnum as r } from "@/enum/response.enum";

interface ResponseJson<D, E> {
    statusCode: number;
    title: r;
    message: string;
    data: D;
    error: E;
}

export const responseJsonWrapper = (_: Request, res: Response, next: NextFunction) => {
    res.responseJson = <D, E>(statusCode: number, title: r, message: string, data: D, error: E) => {
        const response: ResponseJson<D, E> = {
            statusCode,
            title,
            message,
            data,
            error,
        };
        return res.status(statusCode).json(response);
    };
    next();
};

declare global {
    namespace Express {
        interface Response {
            responseJson: <D, E>(statusCode: number, title: r, message: string, data?: D, error?: E) => Response;
        }
    }
}
