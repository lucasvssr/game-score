import { NextFunction, Request, Response } from "express";

export async function validateSquare(req: Request, res: Response, next: NextFunction) {
    const number = parseInt(req.params.id);
    if (isNaN(number)) {
        res.status(404).json({ error: 'Invalid input' });
    } else {
        next();
    }
}