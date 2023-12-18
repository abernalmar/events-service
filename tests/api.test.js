const app = require('../app');
const request = require('supertest');
const Event = require('../models/event');

describe("Events API", () => {
    describe("GET /", () => {
        it("should return an HTML document", async () => {
            const response = await request(app).get("/");

            expect(response.status).toBe(200);
            expect(response.type).toEqual(expect.stringContaining("html"));
        });
    });

    describe("GET /events", () => {
        it("should return a list of events", async () => {
            const response = await request(app).get("/events");
    
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        }, 10000);
    });
    
    describe("POST /events", () => {
        it("should create a new event", async () => {
            const eventData = {
                name: "Test Event",
                place: "Test Place"
            };

            const response = await request(app)
                .post("/events")
                .send(eventData);

            expect(response.status).toBe(201);
        });

        it("should return 400 for incomplete event data", async () => {
            const incompleteEventData = {
                name: "Test Event"
                // Missing 'place' field intentionally
            };

            const response = await request(app)
                .post("/events")
                .send(incompleteEventData);

            expect(response.status).toBe(400);
        });
    });

});
