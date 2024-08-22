import express from 'express';
import { GameController } from './game.controller';

const gameRouter = express.Router();

gameRouter.get('/', GameController.getAll);
gameRouter.get('/:id', GameController.getOne);
gameRouter.post('/new', GameController.create);
gameRouter.patch('/:id/point/:player', GameController.updateOne);


export default gameRouter;