const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
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
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  assistants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: String,
    },
  ],
});

eventSchema.methods.cleanup = function () {
  return {
    name: this.name,
    place: this.place,
    date: this.date,
    description: this.description,
    category: this.category,
    assistants: this.assistants,
  };
};

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
