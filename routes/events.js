var express = require("express");
var router = express.Router();
const debug = require("debug")("EventHub:events");
var Event = require("../models/event");

/* GET */
router.get("/:name?", async function (req, res, next) {
  var eventName = req.params.name;

  if (eventName) {
    // If eventId is provided, find and return the specific event
    var event = await Event.findOne({ name: eventName });
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } else {
    // If no eventId provided, return the entire list of events
    const result = await Event.find();
    res.send(result.map((c) => c.cleanup()));
  }
});

/* GET by _id */
router.get("/id/:id", async function (req, res, next) {
  var eventId = req.params.id;

  if (eventId) {
    // If eventId is provided, find and return the specific event
    var event = await Event.findById(eventId);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } else {
    // If no eventId provided, return the entire list of events
    const result = await Event.find();
    res.send(result.map((c) => c.cleanup()));
  }
});

/* POST create a new event. */
router.post("/", async function (req, res, next) {
  const { name, place, date, description, category, assistants } = req.body;
  const event = new Event({
    name,
    place,
    date,
    description,
    category,
    assistants,
  });
  try {
    await event.save();
    res.sendStatus(201); // Envía respuesta 201 solo cuando la operación es exitosa
  } catch (e) {
    if (e.errors) {
      console.error("Validation problem with saving", e);
      res.status(400).send({ error: e.message });
    } else {
      console.error("DB problem", e);
      res
        .status(500)
        .send({
          error: "Internal Server Error: Failed to save event to the database.",
        });
    }
  }
});

/* DELETE delete an existing event. */
router.delete("/:name", async function (req, res, next) {
  var name = req.params.name;
  try {
    const deletedEvent = await Event.findOneAndDelete({ name: name });
    if (deletedEvent) {
      res.json(deletedEvent);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    console.error("DB problem", error);
    res
      .status(500)
      .send({
        error:
          "Internal Server Error: Failed to delete event from the database.",
      });
  }
});

/* PUT update an existing event. */
router.put("/:name", async function (req, res, next) {
  var name = req.params.name;
  var updatedEvent = req.body;

  try {
    const existingEvent = await Event.findOne({ name: name });
    if (existingEvent) {
      Object.assign(existingEvent, updatedEvent);
      await existingEvent.save();
      res.json(existingEvent);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    console.error("DB problem", error);
    res
      .status(500)
      .send({
        error: "Internal Server Error: Failed to update event in the database.",
      });
  }
});

module.exports = router;
