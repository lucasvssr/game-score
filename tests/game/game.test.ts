import supertest from 'supertest';
import { app } from '../../src/app';
import { gameRepository } from '../../src/game/game.repository';
import { Tour } from '../../src/player/player';
import { playerRepository } from '../../src/player/player.repository';
import { response } from 'express';

describe('Test /api/player', () => {
    test("GET /api/player", async () => {
        await gameRepository.clear();
        await gameRepository.insert(
            {
                players: {
                    player1: "Jhon",
                    player2: "Tom"
                },
                config: {
                    tour: "ATP" as Tour,
                    sets: 4
                },
                state: {
                    currentSet: 1,
                    tieBreak: false,
                    scores: {
                        [0]: {
                            sets: 1,
                            games: [6, 4],
                            points: 40
                        },
                        [1]: {
                            sets: 0,
                            games: [4, 3],
                            points: 30
                        }
                    },
                    winner: 0
                }
            },
            {
                players: {
                    player1: "Jhon",
                    player2: "Tom"
                },
                config: {
                    tour: "WTA" as Tour,
                    sets: 2
                },
                state: {
                    currentSet: 2,
                    tieBreak: true,
                    scores: {
                        [0]: {
                            sets: 1,
                            games: [6, 4],
                            points: 40
                        },
                        [1]: {
                            sets: 1,
                            games: [4, 6],
                            points: 30
                        }
                    },
                    winner: 1
                }
            },
        );

        const response = await supertest(app).get("/api/game");

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(2);

        expect(response.body[0].players.player1).toEqual("Jhon");
        expect(response.body[0].players.player2).toEqual("Tom");
        expect(response.body[0].config.tour).toEqual("ATP");
        expect(response.body[0].config.sets).toEqual(4);
        expect(response.body[0].state.currentSet).toEqual(1);
        expect(response.body[0].state.tieBreak).toEqual(false);
        expect(response.body[0].state.scores[0].sets).toEqual(1);
        expect(response.body[0].state.scores[0].games).toEqual([6, 4]);
        expect(response.body[0].state.scores[0].points).toEqual(40);
        expect(response.body[0].state.scores[1].sets).toEqual(0);
        expect(response.body[0].state.scores[1].games).toEqual([4, 3]);
        expect(response.body[0].state.scores[1].points).toEqual(30);
        expect(response.body[0].state.winner).toEqual(0);

        expect(response.body[1].players.player1).toEqual("Jhon");
        expect(response.body[1].players.player2).toEqual("Tom");
        expect(response.body[1].config.tour).toEqual("WTA");
        expect(response.body[1].config.sets).toEqual(2);
        expect(response.body[1].state.currentSet).toEqual(2);
        expect(response.body[1].state.tieBreak).toEqual(true);
        expect(response.body[1].state.scores[0].sets).toEqual(1);
        expect(response.body[1].state.scores[0].games).toEqual([6, 4]);
        expect(response.body[1].state.scores[0].points).toEqual(40);
        expect(response.body[1].state.scores[1].sets).toEqual(1);
        expect(response.body[1].state.scores[1].games).toEqual([4, 6]);
        expect(response.body[1].state.scores[1].points).toEqual(30);
        expect(response.body[1].state.winner).toEqual(1);
    });

    const listMatchs = [
        {
            players: {
                player1: {
                    firstName: "Nedra",
                    lastName: "Langosh",
                    tour: "WTA" as Tour,
                    country: "France"
                },
                player2: {
                    firstName: "Tom",
                    lastName: "Jhon",
                    tour: "WTA" as Tour,
                    country: "Suisse"
                }
            },
            config: {
                tour: "WTA" as Tour,
                sets: 4
            },
            state: {
                currentSet: 1,
                tieBreak: false,
                scores: {
                    [0]: {
                        sets: 1,
                        games: [6, 4],
                        points: 40
                    },
                    [1]: {
                        sets: 0,
                        games: [4, 3],
                        points: 30
                    }
                },
                winner: 0
            }
        },
        {
            players: {
                player1: {
                    firstName: "Mona",
                    lastName: "Steuber",
                    tour: "ATP" as Tour,
                    country: "France"
                },
                player2: {
                    firstName: "Julia",
                    lastName: "Miller",
                    tour: "ATP" as Tour,
                    country: "Suisse"
                }
            },
            config: {
                tour: "ATP" as Tour,
                sets: 2
            },
            state: {
                currentSet: 2,
                tieBreak: true,
                scores: {
                    [0]: {
                        sets: 1,
                        games: [6, 4],
                        points: 40
                    },
                    [1]: {
                        sets: 1,
                        games: [4, 6],
                        points: 30
                    }
                },
                winner: 1
            }
        }
    ]

    const table = [
        { search: "nom=Langosh", result: { players: { player1: { firstName: "Nedra", lastName: "Langosh", tour: "WTA" as Tour, country: "France" }, player2: { firstName: "Tom", lastName: "Jhon", tour: "WTA" as Tour, country: "Suisse" } }, config: { tour: "WTA" as Tour, sets: 4 }, state: { currentSet: 1, tieBreak: false, scores: { [0]: { sets: 1, games: [6, 4], points: 40 }, [1]: { sets: 0, games: [4, 3], points: 30 } }, winner: 0 } } },
        {
            search: "tour=ATP", result: {
                players: {
                    player1: {
                        firstName: "Mona",
                        lastName: "Steuber",
                        tour: "ATP" as Tour,
                        country: "France"
                    },
                    player2: {
                        firstName: "Julia",
                        lastName: "Miller",
                        tour: "ATP" as Tour,
                        country: "Suisse"
                    }
                },
                config: {
                    tour: "ATP" as Tour,
                    sets: 2
                },
                state: {
                    currentSet: 2,
                    tieBreak: true,
                    scores: {
                        [0]: {
                            sets: 1,
                            games: [6, 4],
                            points: 40
                        },
                        [1]: {
                            sets: 1,
                            games: [4, 6],
                            points: 30
                        }
                    },
                    winner: 1
                }
            }
        }
    ]

    test.each(table)("GET /api/game?%s", async ({ search, result }) => {
        await gameRepository.clear();
        await gameRepository.insert(...listMatchs);

        const response = await supertest(app).get(`/api/game?${search}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0]).toMatchObject(result);
    });

    const listPlayer = [
        {firstName: "Mona", lastName: "Steuber", tour: "ATP" as Tour, country: "Greenland"},
        {firstName: "Julia", lastName: "Miller", tour: "ATP" as Tour, country: "Cuba"},
    ]

    test("POST /api/game/new", async () => {
        await gameRepository.clear();
        await playerRepository.clear();

        await playerRepository.insert(...listPlayer);

        const player1 = await playerRepository.findOne({firstName: "Mona"});
        const player2 = await playerRepository.findOne({firstName: "Julia"});

        const response = await supertest(app).post("/api/game/new").send({
            players: {
                player1: player1?._id,
                player2: player2?._id
            },
            config: {
                tour: "ATP" as Tour,
                sets: 2
            },
        });

        expect(response.statusCode).toBe(201);
        const data = await gameRepository.filter({}, {projection: {_id: 0}});
        expect(response.body).toMatchObject(data[0]);
    });

    test("GET /api/game/:id", async () => {
        await gameRepository.clear();
        await playerRepository.clear();

        await playerRepository.insert(...listPlayer);

        const player1 = await playerRepository.findOne({firstName: "Mona"});
        const player2 = await playerRepository.findOne({firstName: "Julia"});

        await gameRepository.insert({
            players: { player1: player1?._id, player2: player2?._id }, config: { tour: "ATP" as Tour, sets: 2 },
            state: {
                currentSet: 0,
                tieBreak: false,
                scores: undefined,
                winner: undefined
            }
        });
        const data = await gameRepository.findOne({ "players.player1": player1?._id });
        if (!data) {
            throw new Error("Data not found");
        }
        const response = await supertest(app).get("/api/game/" + data._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.players.player1).toEqual(data.players.player1.toString());
        expect(response.body.players.player2).toEqual(data.players.player2.toString());
        expect(response.body.config.tour).toEqual(data.config.tour);
        expect(response.body.config.sets).toEqual(data.config.sets);
        expect(response.body.state.currentSet).toEqual(data.state.currentSet);
        expect(response.body.state.tieBreak).toEqual(data.state.tieBreak);
    });

    test("PATCH /api/game/:id/point/:player with bad id", async () => {
        await gameRepository.clear();
        await playerRepository.clear();

        await playerRepository.insert(...listPlayer);
        const player1 = await playerRepository.findOne({firstName: "Mona"});
        const player2 = await playerRepository.findOne({firstName: "Julia"});

        await gameRepository.insert({
            players: {
                player1: player1?._id,
                player2: player2?._id
            },
            config: {
                tour: "ATP" as Tour,
                sets: 2
            },
            state: {
                currentSet: 0,
                tieBreak: false,
                scores: undefined,
                winner: undefined
            }
        })

        const response = await supertest(app).patch("/api/game/"+player1?._id+"/point/0").send();

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ "status": "error", "message": "Paramètres invalides." });
    });

    test("PATCH /api/game/:id/point/:player with bad player", async () => {
        await gameRepository.clear();
        await playerRepository.clear();

        await playerRepository.insert(...listPlayer);
        const player1 = await playerRepository.findOne({firstName: "Mona"});
        const player2 = await playerRepository.findOne({firstName: "Julia"});

        await gameRepository.insert({
            players: {
                player1: player1?._id,
                player2: player2?._id
            },
            config: {
                tour: "ATP" as Tour,
                sets: 2
            },
            state: {
                currentSet: 0,
                tieBreak: false,
                scores: undefined,
                winner: undefined
            }
        })

        const game = await gameRepository.findOne({ "players.player1": player1?._id });

        const response = await supertest(app).patch("/api/game/"+ game?._id + "/point/10").send();

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ "status": "error", "message": "Paramètres invalides." });
    });

    test("PATCH /api/game/:id/point/:player", async () => {
        await gameRepository.clear();
        await playerRepository.clear();

        await playerRepository.insert(...listPlayer);
        const player1 = await playerRepository.findOne({firstName: "Mona"});
        const player2 = await playerRepository.findOne({firstName: "Julia"});

        await gameRepository.insert({
            players: {
                player1: player1?._id,
                player2: player2?._id
            },
            config: {
                tour: "ATP" as Tour,
                sets: 2
            },
            state: {
                currentSet: 0,
                tieBreak: true,
                scores: [
                    {
                        sets: 0,
                        games: [],
                        points: 4,
                    },
                    {
                        sets: 0,
                        games: [],
                        points: 2,
                    }
                ],
                winner: undefined
            }
        })

        const game = await gameRepository.findOne({ "players.player1": player1?._id });

        const response = await supertest(app).patch("/api/game/"+ game?._id + "/point/0").send();
        console.log(response.body, response.body.state.scores);

        expect(response.statusCode).toBe(200);
        expect(response.body.state.scores[0].points).toEqual(5);
        expect(response.body.state.scores[0].sets).toEqual(0);
        expect(response.body.state.scores[0].games).toEqual([]);
        expect(response.body.state.scores[1].points).toEqual(2);
        expect(response.body.state.currentSet).toEqual(0);
        expect(response.body.state.tieBreak).toEqual(true);
        expect(response.body.state.winner).toEqual(null); 
    });

    test("PATCH /api/game/:id/point/:player", async () => {
        await gameRepository.clear();
        await playerRepository.clear();

        await playerRepository.insert(...listPlayer);
        const player1 = await playerRepository.findOne({firstName: "Mona"});
        const player2 = await playerRepository.findOne({firstName: "Julia"});

        await gameRepository.insert({
            players: {
                player1: player1?._id,
                player2: player2?._id
            },
            config: {
                tour: "ATP" as Tour,
                sets: 2
            },
            state: {
                currentSet: 0,
                tieBreak: true,
                scores: [
                    {
                        sets: 0,
                        games: [],
                        points: 6,
                    },
                    {
                        sets: 0,
                        games: [],
                        points: 2,
                    }
                ],
                winner: undefined
            }
        })

        const game = await gameRepository.findOne({ "players.player1": player1?._id });

        const response = await supertest(app).patch("/api/game/"+ game?._id + "/point/0").send();

        expect(response.statusCode).toBe(200);
        expect(response.body.state.scores[0].points).toEqual(0);
        expect(response.body.state.scores[0].sets).toEqual(1);
        expect(response.body.state.scores[0].games).toEqual([0]);
        expect(response.body.state.scores[1].points).toEqual(0);
        expect(response.body.state.currentSet).toEqual(1);
        expect(response.body.state.tieBreak).toEqual(false);
        expect(response.body.state.winner).toEqual(0);
    });

});