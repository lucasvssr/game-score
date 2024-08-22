import { NextFunction, Request, Response } from "express";
import { gameRepository  } from "./game.repository";
import { GameData } from "./game";
import { body, validationResult } from "express-validator";
import { ObjectId } from "mongodb";

export class GameController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        const tour = req.query.tour as string;
        const name = req.query.nom as string;

        let filter = {};

        if (tour) {
            filter = { ...filter, 'config.tour': tour };
        }
        if (name) {
            filter = { ...filter, $or: [{ 'players.player1.lastName': name },{ 'players.player2.lastName': name } ] };
        }

        const data = await gameRepository.filter(filter);
        res.json(data);
    }
    static async create(req: Request, res: Response, next: NextFunction) {
        const data: GameData = req.body;
        const dataValidation = [
            body('players.player1').exists().isString(),
            body('players.player2').exists().isString(),
            body('config.tour').exists().isString(),
            body('config.sets').exists().isInt()
        ];

        await Promise.all(dataValidation.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ "status": "error", "message": "Données invalides."});
        }

        data.state = {
            currentSet: 0,
            tieBreak: false,
            scores: [{sets: 0, games: [], points: 0}, {sets: 0, games: [], points: 0}],
            winner: undefined
        };

        await gameRepository.insert(data);
        res.status(201).json(data);
    }
    static async getOne(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const data = await gameRepository.findOne({ _id: new ObjectId(id) });
        if (!data) {
            return res.status(404).json({ "status": "error", "message": "Game non trouvée." });
        }
        res.json(data);
    }
    static async updateOne(req: Request, res: Response, next: NextFunction) {
        const gameId = req.params.id;
        const player = parseInt(req.params.player);

        const gameData = await gameRepository.findOne({ _id: new ObjectId(gameId) });

        if (!gameData || (player !== 0 && player !== 1)){
            return res.status(404).json({ "status": "error", "message": "Paramètres invalides." });
        }

        if(gameData.state.tieBreak === true) {
            if(gameData.state.scores[player].points <= 5){
                gameData.state.scores[player].points += 1;
            }
            else if(gameData.state.scores[player].points >= 6 && gameData.state.scores[player === 0 ? 1 : 0].points < gameData.state.scores[player].points){
                gameData.state.scores[player].sets += 1;
                gameData.state.scores[player].points = 0;
                gameData.state.scores[player].games.push(gameData.state.currentSet);
                gameData.state.scores[player === 0 ? 1 : 0].points = 0;
                gameData.state.tieBreak = false;
                gameData.state.currentSet += 1;
                gameData.state.winner = player
            }
        }

        await gameRepository.updateOne({ _id: new ObjectId(gameId) }, { $set: gameData });
        res.status(200).json(gameData);
    }
}