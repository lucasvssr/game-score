import express from 'express';
import { HelloController } from './hello.controller';
import { validateSquare } from './hello.middlewares';

const helloRouter = express.Router();

helloRouter.get('/world', HelloController.hello);
helloRouter.get('/square/:id', validateSquare, HelloController.square);
helloRouter.get('/', HelloController.getAll);
helloRouter.get('/:id', HelloController.getOne);
helloRouter.post('/', HelloController.create);
helloRouter.delete('/:id', HelloController.deleteOne);


export default helloRouter;