import { NextFunction, Request, Response } from "express";
import { ErrorTypeEnum as e } from "@/enum/errors.enum";
import { ResponseTitleEnum as r, ResponseStatusCodeEnum as s, ResponseMessageEnum as m } from "@/enum/response.enum";

export class DefaultError<T> extends Error {
    errorType: e;
    data?: any;
    error?: T | null;
    statusCode?: number;
    constructor(errorType: e, message: string, data?: any, error?: T | null, statusCode?: number) {
        super(message);
        this.name = this.constructor.name;
        this.errorType = errorType;
        this.data = data ?? null;
        this.error = error ?? null;
        this.statusCode = statusCode ?? s.INTERNAL_SERVER_ERROR;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON = () => {
        return { ...this };
    };
}

export class BaseCustomError<T> extends Error {
    name: e;
    errors: T | null;
    constructor(name: e, message: string, errors?: T | null) {
        super(message);
        this.name = name;
        this.errors = errors ?? null;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON = () => {
        return { ...this };
    };
}

export class ModuleError<T> extends BaseCustomError<T> {
    statusCode?: number;
    constructor(message: string, errors?: T | null, statusCode?: number) {
        super(e.MODULE_ERROR, message, errors);
        this.statusCode = statusCode;
    }
}

export class RepositoryError<T> extends BaseCustomError<T> {
    statusCode?: number;
    constructor(message: string, errors?: T | null, statusCode?: number) {
        super(e.REPOSITORY_ERROR, message, errors);
        this.statusCode = statusCode;
    }
}

export class EntityError<T> extends BaseCustomError<T> {
    statusCode?: number;
    constructor(message: string, errors?: T | null, statusCode?: number) {
        super(e.ENTITY_ERROR, message, errors);
        this.statusCode = statusCode;
    }
}

export class FormatValidationError<T> extends BaseCustomError<T> {
    statusCode?: number;
    constructor(message: string, errors?: T | null, statusCode?: number) {
        super(e.VALIDATION_ERROR, message, errors);
        this.statusCode = statusCode;
    }
}

export class QueryError<T> extends BaseCustomError<T> {
    statusCode?: number;
    constructor(message: string, errors?: T | null, statusCode?: number) {
        super(e.QUERY_ERROR, message, errors);
        this.statusCode = statusCode;
    }
}

export class UtilsFunctionError<T> extends BaseCustomError<T> {
    constructor(message: string, errors?: T | null) {
        super(e.UTILS_FUNCTION_ERROR, message, errors);
    }
}

export class ServiceError<T> extends Error {
    statusCode: number;
    message: string;
    errors: T | null;
    constructor(status: number, message: string, errors?: T | null) {
        super(message);
        this.statusCode = status;
        this.message = message;
        this.errors = errors ?? null;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON = () => {
        return { ...this };
    };
}

export const errorHandler = <T>(err: DefaultError<T>, req: Request, res: Response, next: NextFunction) => {
    let statusCode: number;
    let errorType: e = err.errorType;
    let error: T | null = err.error ?? null;
    let responseTitle: r;
    let message = err.message;
    let data = err.data ?? null;
    if (err.name === e.NOT_FOUND_ERROR) errorType = e.NOT_FOUND_ERROR;
    switch (errorType) {
        case e.UNAUTHENTICATED_ERROR:
            statusCode = s.UNAUTHENTICATED;
            responseTitle = r.UNAUTHENTICATED_ERROR;
            break;
        case e.FORBIDDEN_ERROR:
            statusCode = s.FORBIDDEN;
            responseTitle = r.FORBIDDEN_ERROR;
            break;
        case e.VALIDATION_ERROR:
            statusCode = s.BAD_REQUEST;
            responseTitle = r.VALIDATION_ERROR;
            break;
        case e.NOT_FOUND_ERROR:
            statusCode = s.NOT_FOUND;
            responseTitle = r.NOT_FOUND_ERROR;
            break;
        case e.RATE_LIMIT_ERROR:
            statusCode = s.TOO_MANY_REQUESTS;
            responseTitle = r.RATE_LIMIT_ERROR;
            break;
        case e.INTERNAL_SERVER_ERROR:
            statusCode = s.INTERNAL_SERVER_ERROR;
            responseTitle = r.INTERNAL_SERVER_ERROR;
            break;
        case e.MODULE_ERROR:
            statusCode = err.statusCode ?? s.INTERNAL_SERVER_ERROR;
            responseTitle = r.MODULE_ERROR;
            break;
        case e.REPOSITORY_ERROR:
            statusCode = err.statusCode ?? s.INTERNAL_SERVER_ERROR;
            responseTitle = r.REPOSITORY_ERROR;
            break;
        case e.ENTITY_ERROR:
            statusCode = err.statusCode ?? s.INTERNAL_SERVER_ERROR;
            responseTitle = r.ENTITY_ERROR;
            break;
        case e.DATABASE_ERROR:
            statusCode = err.statusCode ?? s.BAD_GATEWAY;
            responseTitle = r.DATABASE_ERROR;
            break;
        case e.SERVICE_ERROR:
            statusCode = err.statusCode ?? s.SERVICE_UNAVAILABLE;
            responseTitle = r.SERVICE_ERROR;
            break;
        default:
            statusCode = s.INTERNAL_SERVER_ERROR;
            message = m.INTERNAL_SERVER_ERROR;
            responseTitle = r.INTERNAL_SERVER_ERROR;
            break;
    }

    return res.responseJson(statusCode, responseTitle, message, data, error);
};
