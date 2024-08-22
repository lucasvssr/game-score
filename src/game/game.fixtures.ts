import { GameData } from "./game";
import { playerRepository } from "../player/player.repository";
import { gameRepository } from "./game.repository";
import { faker } from "@faker-js/faker";
            
export async function createGameData(partialData?: Partial<GameData>): Promise<GameData> {
    const playerIdsInGame = await gameRepository.filter({}, {projection: {players: {player1: {_id: 1}, player2: {_id: 1}} , _id: 0}});

    const listPlayer = await playerRepository.filter({_id: {$nin: playerIdsInGame}});

    const player1 = listPlayer[faker.number.int({min: 0, max: listPlayer.length - 1})]._id;
    const player2 = listPlayer[faker.number.int({min: 0, max: listPlayer.length - 1})]._id;

    return {
        players: {
            player1,
            player2,
        },
        config: {
            tour: partialData?.config?.tour || 'ATP',
            sets: partialData?.config?.sets || 3,
        },
        state:{
            currentSet: partialData?.state?.currentSet || 0,
            tieBreak: partialData?.state?.tieBreak || false,
            scores: partialData?.state?.scores || [{sets: 0, games: [], points: 0}, {sets: 0, games: [], points: 0}],
            winner: partialData?.state?.winner || undefined,
        }
    };
}
