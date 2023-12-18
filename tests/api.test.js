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


});
