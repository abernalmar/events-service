const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  place: {
    type: String,
    required: true,
    unique: false,
  },
  date: {
    type: Date,
    required: false,
  },
  description: {
    type: String,
    unique: false,
  },
  category: {
    type: String,
    unique: false,
  },
});

eventSchema.methods.cleanup = function () {
  return {
    name: this.name,
    place: this.place,
    date: this.date,
    description: this.description,
    category: this.category,
    _id: this._id,
  };
};

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
