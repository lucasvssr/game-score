import e, { NextFunction, Request, Response } from "express";
import { helloCollection, helloRepository } from './hello.repository';
import { HelloData } from "./hello";
import { body, query, validationResult } from "express-validator";
import { ObjectId } from "mongodb";


export class HelloController {
    static hello(req: Request, res: Response, next: NextFunction) {
        res.json({ message: 'hello' });
    }
    static square(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        res.json({ result: id * id });
    }
    static async getAll(req: Request, res: Response, next: NextFunction) {
        const data = await helloCollection.find().toArray();
        res.json(data);
    }
    static async create(req: Request, res: Response, next: NextFunction) {
        const data: HelloData[] = req.body;
        const dataValidation = body('*.message').exists();
        await dataValidation.run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ "status": "error", "message": "Données invalides."});
        }
        await helloRepository.insert(...data);
        res.status(201).json(data);
    }
    static async getOne(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const data = await helloCollection.findOne({ _id: new ObjectId(id) });
        if (!data) {
            return res.status(404).json({ "status": "error", "message": "Message non trouvé." });
        }
        res.json(data);
    }
    static async deleteOne(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const data = await helloCollection.deleteOne({ _id: new ObjectId(id) });
        if (data.deletedCount === 0) {
            return res.status(404).json({ "status": "error", "message": "Message non trouvé." });
        }
        res.json({ "status": "success", "message": "Message supprimé."});
    }
}