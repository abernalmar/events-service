var express = require('express');
var router = express.Router();
var events = [
    {"id": "1", "name": "Boda", "place:": "Plaza de España"}, 
    {"id": "2", "name": "Bautizo", "place": "Avenida Reina Mercedes"}
]

/* GET */
router.get('/:eventId?', function(req, res, next) {
var eventId = req.params.eventId;

if (eventId) {
    // If eventId is provided, find and return the specific event
    var event = events.find(e => e.id === eventId);
    if (event) {
    res.json(event);
    } else {
    res.status(404).json({error: 'Event not found'});
    }
} else {
    // If no eventId provided, return the entire list of events
    res.json(events);
}
});
  

/* POST create a new event. */
router.post('/', function(req, res, next) {
    var newEvent = req.body;
    events.push(newEvent);
    res.status(201).json(newEvent);
  });

/* DELETE delete an existing event. */
router.delete('/:eventId', function(req, res, next) {
    var eventId = req.params.eventId;
  
    // Remove the event from the array
    for (var i = 0; i < events.length; i++) {
      if (events[i].id === eventId) {
        var deletedEvent = events.splice(i, 1);
        res.json(deletedEvent[0]);
        return;
      }
    }
  
    res.status(404).json({error: 'Event not found'});
  });

  /* PUT update an existing event. */
router.put('/:eventId', function(req, res, next) {
    var eventId = req.params.eventId;
    var updatedEvent = req.body;
  
    // Update the event in the array
    for (var i = 0; i < events.length; i++) {
      if (events[i].id === eventId) {
        events[i] = updatedEvent;
        res.json(updatedEvent);
        return;
      }
    }
  
    res.status(404).json({error: 'Event not found'});
  });
  

module.exports = router;