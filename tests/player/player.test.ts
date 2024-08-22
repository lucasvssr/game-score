import supertest from 'supertest';
import { app } from '../../src/app';
import { playerCollection, playerRepository } from '../../src/player/player.repository';
import { Tour } from '../../src/player/player';

describe('Test /api/player', () => {
    test("GET /api/player", async () => {
        await playerRepository.clear();
        await playerRepository.insert(
            {firstName: "Jhon", lastName: "Tom", tour: "ATP", country: "France" },
            {firstName: "Tom", lastName: "Jhon", tour: "WTA", country: "Suisse" },
        ); 
        
        const response = await supertest(app).get("/api/player");
        
        expect(response.statusCode).toBe(200); 
        expect(response.body.length).toEqual(2);

        expect(response.body[0].firstName).toEqual("Jhon");
        expect(response.body[0].lastName).toEqual("Tom");
        expect(response.body[0].tour).toEqual("ATP");
        expect(response.body[0].country).toEqual("France");

        expect(response.body[1].firstName).toEqual("Tom");
        expect(response.body[1].lastName).toEqual("Jhon");
        expect(response.body[1].tour).toEqual("WTA");
        expect(response.body[1].country).toEqual("Suisse");
    })

    test("GET /api/player", async () => {
        await playerRepository.clear();
        await playerRepository.insert(
            {firstName: "Jhon", lastName: "Tom", tour: "ATP", country: "France" },
            {firstName: "Tom", lastName: "Jhon", tour: "WTA", country: "Suisse" },
        ); 
        
        const response = await supertest(app).get("/api/player");
        
        expect(response.statusCode).toBe(200); 
        expect(response.body.length).toEqual(2);

        expect(response.body[0].firstName).toEqual("Jhon");
        expect(response.body[0].lastName).toEqual("Tom");
        expect(response.body[0].tour).toEqual("ATP");
        expect(response.body[0].country).toEqual("France");
        
        expect(response.body[1].firstName).toEqual("Tom");
        expect(response.body[1].lastName).toEqual("Jhon");
        expect(response.body[1].tour).toEqual("WTA");
        expect(response.body[1].country).toEqual("Suisse");
    })

    const listPlayer = [
        {firstName: "Mona", lastName: "Steuber", tour: "ATP" as Tour, country: "Greenland"},
        {firstName: "Julia", lastName: "Miller", tour: "ATP" as Tour, country: "Cuba"},
        {firstName: "Nedra", lastName: "Langosh", tour: "WTA" as Tour, country: "Venezuela"},
        {firstName: "Omari", lastName: "Reichert", tour: "ATP" as Tour, country: "Armenia"},
        {firstName: "Kim", lastName: "Wunsch", tour: "ATP" as Tour, country: "Luxembourg"}
    ]

    const table = [
            {s: "firstName=Mona",  r: {firstName: "Mona", lastName: "Steuber", tour: "ATP", country: "Greenland"}},
            {s: "lastName=Miller",r: {firstName: "Julia", lastName: "Miller", tour: "ATP", country: "Cuba"}},
            {s: "tour=WTA",r: {firstName: "Nedra", lastName: "Langosh", tour: "WTA", country: "Venezuela"}},
            {s: "country=Armenia",r: {firstName: "Omari", lastName: "Reichert", tour: "ATP", country: "Armenia"}},
            {s: "firstName=Kim&country=Luxembourg",r: {firstName: "Kim", lastName: "Wunsch", tour: "ATP", country: "Luxembourg"}},
        ];

    test.each(table)('GET /api/player/', async ({s, r}) => {
        await playerRepository.clear();
        playerRepository.insert(...listPlayer);
        const response = await supertest(app).get('/api/player?'+ s);

        expect(response.statusCode).toBe(200);
        expect(response.body[0].firstName).toEqual(r.firstName);
        expect(response.body[0].lastName).toEqual(r.lastName);
        expect(response.body[0].tour).toEqual(r.tour);
        expect(response.body[0].country).toEqual(r.country);
    });

    test("POST /api/player", async () => {
        await playerRepository.clear();
        const response = await supertest(app).post("/api/player").send([{firstName: "Mona", lastName: "Steuber", tour: "ATP" as Tour, country: "Greenland"}, {firstName: "Julia", lastName: "Miller", tour: "ATP" as Tour, country: "Cuba"}]);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.length).toEqual(2);

        expect(response.body[0].firstName).toEqual("Mona");
        expect(response.body[0].lastName).toEqual("Steuber");
        expect(response.body[0].tour).toEqual("ATP");
        expect(response.body[0].country).toEqual("Greenland");

        expect(response.body[1].firstName).toEqual("Julia");
        expect(response.body[1].lastName).toEqual("Miller");
        expect(response.body[1].tour).toEqual("ATP");
        expect(response.body[1].country).toEqual("Cuba");
    });

    test("POST /api/player with invalid input", async () => {
        await playerRepository.clear();
        const response = await supertest(app).post("/api/player").send([{firstName: "Mona", tour: "ATP" as Tour, country: "Greenland"}]);
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ "status": "error", "message": "Données invalides."});

    });

    test("GET /api/player/:id", async () => {
        await playerRepository.clear();
        await playerRepository.insert({firstName: "Mona", lastName: "Steuber", tour: "ATP" as Tour, country: "Greenland"});
        const data = await playerCollection.findOne({ firstName: "Mona" });
        if (!data) {
            throw new Error("Data not found");
        }
        const response = await supertest(app).get("/api/player/" + data._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.firstName).toEqual("Mona");
        expect(response.body.lastName).toEqual("Steuber");
        expect(response.body.tour).toEqual("ATP");
        expect(response.body.country).toEqual("Greenland");
    });

    test("DELETE /api/player/:id", async () => {
        await playerRepository.clear();
        await playerRepository.insert({firstName: "Mona", lastName: "Steuber", tour: "ATP" as Tour, country: "Greenland"});
        const data = await playerCollection.findOne({ firstName: "Mona" });
        if (!data) {
            throw new Error("Data not found");
        }
        const response = await supertest(app).delete("/api/player/" + data._id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ "status": "success", "message": "Joueur(se) supprimé(e)." });
    });
});