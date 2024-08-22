import { NextFunction, Request, Response } from "express";
import { playerCollection, playerRepository } from "./player.repository";
import { PlayerData } from "./player";
import { body, validationResult } from "express-validator";
import { ObjectId } from "mongodb";

export class PlayerController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        const firstName = req.query.firstName as string;
        const lastName = req.query.lastName as string;
        const tour = req.query.tour as string;
        const country = req.query.country as string;

        var filter = {};

        if (firstName) {
            filter = { ...filter, firstName: firstName };
        }
        if (lastName) {
            filter = { ...filter, lastName: lastName };
        }
        if (tour) {
            filter = { ...filter, tour: tour };
        }
        if (country) {
            filter = { ...filter, country: country };
        }

        const data = await playerCollection.find(filter).toArray();

        res.json(data);
    }
    static async create(req: Request, res: Response, next: NextFunction) {
        const data: PlayerData[] = req.body;
        const dataValidation = [
            body('*.firstName').exists().isString(),
            body('*.lastName').exists().isString(),
            body('*.country').exists().isString(),
            body('*.tour').exists().isString()
        ];
        
        await Promise.all(dataValidation.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ "status": "error", "message": "Données invalides."});
        }

        await playerRepository.insert(...data);
        res.status(201).json(data);
    }
    static async getOne(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const data = await playerCollection.findOne({ _id: new ObjectId(id) });
        if (!data) {
            return res.status(404).json({ "status": "error", "message": "Joueur(se) non trouvé(e)." });
        }
        res.json(data);
    }
    static async deleteOne(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const data = await playerCollection.deleteOne({ _id: new ObjectId(id) });
        if (data.deletedCount === 0) {
            return res.status(404).json({ "status": "error", "message": "Joueur(se) non trouvé(e)." });
        }
        res.json({ "status": "success", "message": "Joueur(se) supprimé(e)." });
    }
}