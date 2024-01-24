var express = require("express");
var router = express.Router();
const debug = require("debug")("EventHub:events");
var Event = require("../models/event");

var passport = require("passport");

const axios = require("axios");

/* GET events listing*/
router.get("/", async function (req, res, next) {
  try {
    const result = await Event.find();
    res.send(result.map((c) => c.cleanup()));
  } catch (e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});


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
    try {
      // If eventId is provided, find and return the specific event
      var event = await Event.findById(eventId);
      if (event) {
        res.json(event);
      } else {
        res.status(404).json({ error: "Event not found" });
      }
    } catch (error) {
      // Handle any potential errors during the database query
      console.error("Error finding event by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // If no eventId provided, return the entire list of events
    const result = await Event.find();
    res.send(result.map((c) => c.cleanup()));
  }
});


// Ruta para crear un evento
router.post("/", async function (req, res, next) {
  const { name, place, date, description, category, user } = req.body;
  console.log(user);
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
    const savedEvent = await event.save();

    const { email, name: userName, surname, username } = user;
    console.log("EMAIL: ", email);
    console.log("nameUser: ", name);

    // Guardar la instancia del modelo en la base de datos
    

    // Llamar a la función para crear un asistente automáticamente
    await createAutomaticAssistant(savedEvent._id, userName, surname, email, username);

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
async function createAutomaticAssistant(eventId, nameUser, Surname, Email, Username) {
  // Datos del asistente predeterminado
  const assistantData = {
    name: nameUser,
    surname: Surname,
    email: Email,
    eventId: eventId,
    username: Username,
  };

  try {
    console.log("AQUISIIII");
    // Encabezado de autorización con el token Bearer
    const authHeader = {
      Authorization: 'Bearer 37f7b2a4-2fdc-4e17-a72b-6570187d3cb6',
    };

    // Hacer una solicitud POST al servicio de asistentes para crear el asistente
    console.log(assistantData);
    const response = await axios.post('http://assistants:3000/api/v1/assistants', assistantData, {
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
router.delete(
  "/:name",
  passport.authenticate("bearer", { session: false }),
  async function (req, res, next) {
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
      res.status(500).send({
        error:
          "Internal Server Error: Failed to delete event from the database.",
      });
    }
  }
);

/* PUT update an existing event. */
router.put(
  "/:name",
  passport.authenticate("bearer", { session: false }),
  async function (req, res, next) {
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
      res.status(500).send({
        error: "Internal Server Error: Failed to update event in the database.",
      });
    }
  }
);

module.exports = router;
