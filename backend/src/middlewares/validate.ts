import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: result.error.flatten() });
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: result.error.flatten() });
    }
    if (result.success) {
      // Instead of assigning req.query = result.data, mutate the object
      Object.assign(req.query, result.data);
      return next();
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: result.error.flatten() });
    }
    req.params = result.data as any;
    next();
  };
}
