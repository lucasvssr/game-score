import 'dotenv/config';
import { createHelloData } from "./hello/hello.fixtures";
import { helloRepository } from "./hello/hello.repository";
import { createPlayerData } from "./player/player.fixtures";
import { playerRepository } from "./player/player.repository";
import { gameRepository } from './game/game.repository';
import { createGameData } from './game/game.fixtures';

async function populateRepositories() {
    await helloRepository.populate(20, createHelloData);
    await playerRepository.populate(20, createPlayerData);
    await gameRepository.populate(20, createGameData);
}

populateRepositories().then(() => {process.exit()});