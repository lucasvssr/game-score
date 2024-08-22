import { Collection } from "mongodb";
import { mongodb } from "../services/mongodb";
import { PlayerData } from "./player";
        
export const playerCollection = mongodb.collection<PlayerData>('player');

class PlayerRepository {
    async clear() {
        await playerCollection.deleteMany({});
    }
    async populate(count: number, fixturesGenerator: (partialEntity?: Partial<PlayerData>) => PlayerData) : Promise<void> {
        this.clear();
        const fixtures = Array.from({ length: count }, () => fixturesGenerator());
        await playerCollection.insertMany(fixtures);
    }
    async insert(...entities: PlayerData[]): Promise<void> {
        await playerCollection.insertMany(entities);
    }
    async filter(filter: any, options?: { projection?: any, sort?: any }){
        return await playerCollection.find(filter, options).toArray()
    }        
    async findOne(filter: any, options?: { projection?: any, sort?: any }){
        return await playerCollection.findOne(filter, options);
    }
}

export const playerRepository = new PlayerRepository();
