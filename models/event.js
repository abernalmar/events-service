const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    }
});
eventSchema.methods.cleanup = function() {
    return {
        name: this.name,
    place: this.place
    }
}
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;