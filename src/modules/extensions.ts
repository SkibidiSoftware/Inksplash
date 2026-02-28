import express from "express";
import { ApiError } from "modules/errors";
import { ServiceType } from "modules/service";

declare global {
    namespace Express {
        interface Request {
            service: ServiceType;
        }

        interface Response {
            error(err: ApiError, object: any, ...vars: string[]): void;
        }
    }
}

express.response.error = function(err: ApiError, object: any, ...vars: string[]) {
    if (this.statusCode === 200)
        this.status(err._statusCode);

    this.json(err.package(object, ...vars));
}