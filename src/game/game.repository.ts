import { Filter } from "mongodb";
import { mongodb } from "../services/mongodb";
import { GameData } from "./game";
        
export const gameCollection = mongodb.collection<GameData>('game');

class GameRepository {
    async clear() {
        await gameCollection.deleteMany({});
    }
    async populate(count: number, fixturesGenerator: (partialEntity?: Partial<GameData>) => Promise<GameData>) : Promise<void> {
        this.clear();
        const fixtures = await Promise.all(Array.from({ length: count }, async () => await fixturesGenerator()));
        await gameCollection.insertMany(fixtures);
    }
    async insert(...entities: GameData[]): Promise<void> {
        await gameCollection.insertMany(entities);
    }
    async filter(filter: any, options?: { projection?: any, sort?: any }){
        return await gameCollection.find(filter, options).toArray()
    }
    async findOne(filter: any, options?: { projection?: any, sort?: any }){
        return await gameCollection.findOne(filter, options);
    }
    async updateOne(filter: Filter<GameData>, data: any){
        return await gameCollection.updateOne(filter, data);
    }
}

export const gameRepository = new GameRepository();
