import j, { ValidationError } from "joi";
import type { NextFunction, Request, Response } from "express";
import { E_ValidationGeneric, E_ValidationSchema } from "modules/errors";

export function validateBody(schema: j.Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.validateAsync(req.body);
            next();
        } catch (err) {
            if (err instanceof ValidationError) {
                res.error(E_ValidationSchema, {}, err.details.map(x => x.message).join(", "))
                return;
            }

            res.error(E_ValidationGeneric, {}, "Failed validation");
        }
    }
}

export function validateQuery(schema: j.Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.query = await schema.validateAsync(req.query);
            next();
        } catch (err) {
            if (err instanceof ValidationError) {
                res.error(E_ValidationSchema, {}, err.details.map(x => x.message).join(", "))
                return;
            }

            res.error(E_ValidationGeneric, {}, "Failed validation");
        }
    }
}

export function validateParams(schema: j.Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.params = await schema.validateAsync(req.params);
            next();
        } catch (err) { // mystery error cuz we dont wanna reveal param names
            res.error(E_ValidationGeneric, {}, "Malformed parameters");
        }
    }
}