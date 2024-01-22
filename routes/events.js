var express = require("express");
var router = express.Router();
const debug = require("debug")("EventHub:events");
var Event = require("../models/event");
const axios = require('axios');
const passport = require('passport');
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

// Ruta para crear un evento
router.post("/", async function (req, res, next) {
  const { name, place, date, description, category } = req.body;

  try {
    // Crear una instancia del modelo Event con los datos proporcionados
    const event = new Event({
      name,
      place,
      date,
      description,
      category,
      assistants: [], // Inicializamos la lista de asistentes vacía por ahora
    });

    // Guardar la instancia del modelo en la base de datos
    const savedEvent = await event.save();

    // Llamar a la función para crear un asistente automáticamente
    await createAutomaticAssistant(savedEvent._id);

    res.status(201).json(savedEvent.cleanup()); // Respuesta 201 cuando la operación es exitosa
  } catch (e) {
    if (e.errors) {
      console.error("Validation problem with saving", e);
      res.status(400).json({ error: e.message });
    } else {
      console.error("DB problem", e);
      res.status(500).json({
        error: "Internal Server Error: Failed to save event to the database.",
      });
    }
  }
});

// Función para crear automáticamente un asistente
async function createAutomaticAssistant(eventId) {
  // Datos del asistente predeterminado
  const assistantData = {
    name: "Nabil",
    surname: "Fekir",
    email: "nabil.fekir@example.com",
    eventId: eventId,
    username: "nabil_fekir",
  };

  try {
    // Encabezado de autorización con el token Bearer
    const authHeader = {
      Authorization: 'Bearer 37f7b2a4-2fdc-4e17-a72b-6570187d3cb6',
    };

    // Hacer una solicitud POST al servicio de asistentes para crear el asistente
    const response = await axios.post('http://localhost:4001/api/v1/assistants', assistantData, {
      headers: authHeader,
    });
    
    // Obtener el ID del asistente creado
    const assistantId = response.data._id;

    // Obtener el evento para actualizar la lista de asistentes
    const event = await Event.findById(eventId);
    if (event) {
      // Añadir el ID del asistente a la lista de asistentes del evento
      event.assistants.push(assistantId);

      // Guardar la instancia actualizada del modelo Event en la base de datos
      await event.save();
      console.log("Asistente creado y evento actualizado con éxito");
    } else {
      console.log("No se encontró el evento correspondiente al ID:", eventId);

    }
  } catch (error) {
    console.error("Error creating automatic assistant", error);
  }
}


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
