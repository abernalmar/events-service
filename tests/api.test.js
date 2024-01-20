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

  describe("GET /api/v1/events", () => {
    it("should return a list of events", async () => {
      const response = await request(app).get("/api/v1/events");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return 404 for a non-existing event", async () => {
      const nonExistingEventName = "NonExistingEvent";
      const response = await request(app).get(
        `/api/v1/events/${nonExistingEventName}`
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Event not found");
    });
  });

  describe("POST /events", () => {
    it("should create a new event", async () => {
      const eventData = {
        name: "Test Event",
        place: "Test Place",
        date: new Date(2024, 3, 31),
      };

      const authHeader = {
        Authorization: 'Bearer b3c5c72b-e228-424d-98a8-a370c4ee2d5a',
      };

      const response = await request(app)
        .post("/api/v1/events")
        .set(authHeader)
        .send(eventData);

      expect(response.status).toBe(201);
    });

    it("should return 400 for incomplete event data", async () => {
      const incompleteEventData = {
        name: "Test Event",
        // Missing 'place' field intentionally
      };
      const authHeader = {
        Authorization: 'Bearer b3c5c72b-e228-424d-98a8-a370c4ee2d5a',
      };
      const response = await request(app)
        .post("/api/v1/events")
        .set(authHeader)
        .send(incompleteEventData);

      expect(response.status).toBe(400);
    });

    it("should return 400 if 'date' has an invalid format", async () => {
      const eventData = {
        name: "Test Event",
        place: "Test Place",
        date: "invalid-date-format", // Format is not valid
      };

      const authHeader = {
        Authorization: 'Bearer b3c5c72b-e228-424d-98a8-a370c4ee2d5a',
      };

      const response = await request(app)
        .post("/api/v1/events")
        .set(authHeader)
        .send(eventData);

      expect(response.status).toBe(400);
    });

    /*
    it("should return 400 if 'date' is missing", async () => {
      const incompleteEventData = {
        name: "Test Event",
        place: "Test Place",
        // Missing 'date' field intentionally
      };

      const response = await request(app)
        .post("/api/v1/events")
        .send(incompleteEventData);

      expect(response.status).toBe(400);
    });*/
  });

  describe("PUT /api/v1/events/:name", () => {
    it("should update an existing event", async () => {
      const eventNameToUpdate = "EventToUpdate";

      // Crea un evento para ser actualizado
      const eventToUpdate = new Event({
        name: eventNameToUpdate,
        place: "Test Place",
        date: new Date(2021, 3, 31),
        description: "Test Description",
        category: "Test Category",
      });
      await eventToUpdate.save();

      const updatedEventData = {
        place: "Updated Place",
        description: "Updated Description",
        category: "Updated Category",
      };
      const authHeader = {
        Authorization: 'Bearer b3c5c72b-e228-424d-98a8-a370c4ee2d5a',
      };
      const response = await request(app)
        .put(`/api/v1/events/${eventNameToUpdate}`)
        .set(authHeader)
        .send(updatedEventData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(eventNameToUpdate);
      expect(response.body.place).toBe(updatedEventData.place);
      expect(response.body.description).toBe(updatedEventData.description);
      expect(response.body.category).toBe(updatedEventData.category);
    });

    it("should return 404 for updating a non-existing event", async () => {
      const nonExistingEventName = "NonExistingEvent";
      const updatedEventData = {
        place: "Updated Place",
        description: "Updated Description",
        category: "Updated Category",
      };
      const authHeader = {
        Authorization: 'Bearer b3c5c72b-e228-424d-98a8-a370c4ee2d5a',
      };

      const response = await request(app)
        .put(`/api/v1/events/${nonExistingEventName}`)
        .set(authHeader)
        .send(updatedEventData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Event not found");
    });
  });

  describe("DELETE /api/v1/events/:name", () => {
    it("should delete an existing event", async () => {
      const eventNameToDelete = "EventToDelete";

      // Crea un evento para ser eliminado
      const eventToDelete = new Event({
        name: eventNameToDelete,
        place: "Test Place",
        date: new Date(2024, 3, 19),
        description: "Test Description",
        category: "Test Category",
      });
      

      await eventToDelete.save();
      const authHeader = {
        Authorization: 'Bearer b3c5c72b-e228-424d-98a8-a370c4ee2d5a',
      };
      const response = await request(app).delete(
        `/api/v1/events/${eventNameToDelete}`
      ).set(authHeader);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(eventNameToDelete);

      // Verifica que el evento realmente se eliminó de la base de datos
      const deletedEvent = await Event.findOne({ name: eventNameToDelete });
      expect(deletedEvent).toBeNull();
    });

    it("should return 404 for a non-existing event", async () => {
      const nonExistingEventName = "NonExistingEvent";
      const authHeader = {
        Authorization: 'Bearer b3c5c72b-e228-424d-98a8-a370c4ee2d5a',
      };
      const response = await request(app).delete(
        `/api/v1/events/${nonExistingEventName}`
      ).set(authHeader);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Event not found");
    });
  });

  afterAll(async () => {
    await Event.deleteMany({});
    await mongoose.connection.close();
  });
});
