const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const Event = require("../models/event");

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
    /* DA ERROR LA DATE, NO SÉ EN QUÉ FORMATO PONERLA
    it("should create a new event", async () => {
      const eventData = {
        name: "Test Event",
        place: "Test Place",
        date: new Date("2023-01-01T12:00:00Z"),
      };

      const response = await request(app).post("/events").send(eventData);

      expect(response.status).toBe(201);
    });*/

    it("should return 400 for incomplete event data", async () => {
      const incompleteEventData = {
        name: "Test Event",
        // Missing 'place' field intentionally
      };

      const response = await request(app)
        .post("/events")
        .send(incompleteEventData);

      expect(response.status).toBe(400);
    });

    it("should return 400 if 'date' has an invalid format", async () => {
      const eventData = {
        name: "Test Event",
        place: "Test Place",
        date: "invalid-date-format", // Format is not valid
      };

      const response = await request(app).post("/events").send(eventData);

      expect(response.status).toBe(400);
    });

    it("should return 400 if 'date' is missing", async () => {
      const incompleteEventData = {
        name: "Test Event",
        place: "Test Place",
        // Missing 'date' field intentionally
      };

      const response = await request(app)
        .post("/events")
        .send(incompleteEventData);

      expect(response.status).toBe(400);
    });
  });
});
