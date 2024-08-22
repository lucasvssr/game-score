import express from 'express';
import { PlayerController } from './player.controller';

const playerRouter = express.Router();

playerRouter.get('/', PlayerController.getAll);
playerRouter.get('/:id', PlayerController.getOne);
playerRouter.post('/', PlayerController.create);
playerRouter.delete('/:id', PlayerController.deleteOne);

export default playerRouter;