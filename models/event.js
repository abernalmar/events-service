const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  //
  name: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
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
