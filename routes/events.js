var express = require('express');
var router = express.Router();
const debug = require('debug')('EventHub:events');
var Event = require('../models/event');

/* GET */
router.get('/:name?', async function(req, res, next) {

    var eventName = req.params.name;

if (eventName) {
    // If eventId is provided, find and return the specific event
    var event = await Event.find(e => e.name === eventName);
    if (event) {
    res.json(event);
    } else {
    res.status(404).json({error: 'Event not found'});
    }
} else {
    // If no eventId provided, return the entire list of events
    const result = await Event.find();
    res.send(result.map((c) => c.cleanup()));
}
});
  

/* POST create a new event. */
router.post('/', async function(req, res, next) {
    const {name, place} = req.body;
    const event = new Event({
        name,
        place
    });
    try {
        await event.save();
        res.sendStatus(201);  // Envía respuesta 201 solo cuando la operación es exitosa
    } catch (e) {
        if (e.errors) {
            console.error("Validation problem with saving", e);
            res.status(400).send({ error: e.message });
        } else {
            console.error("DB problem", e);
            res.status(500).send({ error: 'Internal Server Error: Failed to save event to the database.' });
        }
    }
  });

/* DELETE delete an existing event. */
router.delete('/:name', function(req, res, next) {
    var name = req.params.name;
  
    // Remove the event from the array
    for (var i = 0; i < events.length; i++) {
      if (events[i].name === name) {
        var deletedEvent = events.splice(i, 1);
        res.json(deletedEvent[0]);
        return;
      }
    }
  
    res.status(404).json({error: 'Event not found'});
  });

/* PUT update an existing event. */
router.put('/:name', function(req, res, next) {
    var name = req.params.name;
    var updatedEvent = req.body;
  
    // Update the event in the array
    for (var i = 0; i < events.length; i++) {
      if (events[i].name === name) {
        events[i] = updatedEvent;
        res.json(updatedEvent);
        return;
      }
    }
  
    res.status(404).json({error: 'Event not found'});
  });
  

module.exports = router;