import { Collection } from "mongodb";
import { mongodb } from "../services/mongodb";
import { HelloData } from "./hello";
        
export const helloCollection = mongodb.collection<HelloData>('hello');

class HelloRepository {
    async clear() {
        await helloCollection.deleteMany({});
    }

    async insert(...data: HelloData[]) {
        await helloCollection.insertMany(data);
    }
    async populate(count: number, fixturesGenerator: (partialEntity?: Partial<HelloData>) => HelloData) : Promise<void> {
        this.clear();
        const fixtures = Array.from({ length: count }, () => fixturesGenerator());
        await helloCollection.insertMany(fixtures);
    }
}

export const helloRepository = new HelloRepository();