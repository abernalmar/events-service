var express = require('express');
var router = express.Router();
var events = [
    {"name": "Boda", "place:": "Plaza de España"}, 
    {"name": "Bautizo", "place": "Avenida Reina Mercedes"}
]

/* GET events listing. */
router.get('/', function(req, res, next) {
  res.send(events);
});

module.exports = router;