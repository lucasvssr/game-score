import supertest from 'supertest';
import { app } from '../../src/app';
import { mongoClient } from '../../src/services/mongodb';
import { helloCollection, helloRepository } from '../../src/hello/hello.repository';
        
describe('Test /api/hello', () => {
    test('GET /api/hello/world', async () => {
        const response = await supertest(app).get('/api/hello/world');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({message: 'hello'});
    });

    const table = [
        {a: 1, r: 1},
        {a: 4, r: 16},
        {a: 5, r: 25},
        {a: 10, r: 100},
        {a: 12, r: 144},
      ];

    test.each(table)('GET /api/hello/square/', async ({a, r}) => {
        const response = await supertest(app).get('/api/hello/square/'+ a);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({result: r});
    });

    test('GET /api/hello/square/XYZ', async () => {
        const response = await supertest(app).get('/api/hello/square/XYZ');
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({error: 'Invalid input'});
    });

    test("GET /api/hello", async () => {
        await helloRepository.clear();
        await helloRepository.insert(
            { message: "hello" },
            { message: "world" },
        ); 
        
        const response = await supertest(app).get("/api/hello");
        
        expect(response.statusCode).toBe(200); 
        expect(response.body.length).toEqual(2);
        expect(response.body[0].message).toEqual("hello");
        expect(response.body[1].message).toEqual("world"); 
    })

    test("POST /api/hello", async () => {
        await helloRepository.clear();
        const response = await supertest(app).post("/api/hello").send([{ message: "hello" }, { message: "bonjour" }]);
        expect(response.statusCode).toBe(201);
        expect(response.body.length).toEqual(2);
        expect(response.body[0].message).toEqual("hello");
        expect(response.body[1].message).toEqual("bonjour");
    });

    test("POST /api/hello with invalid input", async () => {
        await helloRepository.clear();
        const response = await supertest(app).post("/api/hello").send([{ data: "hello" }]);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ "status": "error", "message": "Données invalides." });
    });

    test("GET /api/hello/{id}", async () => {
        await helloRepository.clear();
        await helloRepository.insert(
            { message: "hello" },
            { message: "world" },
        );
        const data = await helloCollection.findOne({ message: "world" });
        if (!data) {
            throw new Error("Data not found");
        }
        const response = await supertest(app).get("/api/hello/"+ data._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("world");
    });

    test("GET /api/hello/{id} with no data", async () => {
        await helloRepository.clear();
        const response = await supertest(app).get("/api/hello/123456789012345678901234");
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ "status": "error", "message": "Message non trouvé." });
    });

    test("DELETE /api/hello/{id}", async () => {
        await helloRepository.clear();
        await helloRepository.insert(
            { message: "hello" },
            { message: "world" },
        );
        const data = await helloCollection.findOne({ message: "world" });
        if (!data) {
            throw new Error("Data not found");
        }
        const response = await supertest(app).delete("/api/hello/"+ data._id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ "status": "success", "message": "Message supprimé." });
    });

    test("DELETE /api/hello/{id} with no data", async () => {
        await helloRepository.clear();
        const response = await supertest(app).delete("/api/hello/123456789012345678901234");
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ "status": "error", "message": "Message non trouvé." });
    });
});

afterAll(async () => {
    await mongoClient.close();
})