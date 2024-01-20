const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const apiKeySchema = new mongoose.Schema({
    user: String,
    apiKey: String
});

apiKeySchema.pre('save', function(next) {
    const user = this;
    user.apiKey = uuidv4();
    next();
});

module.exports = mongoose.model('ApiKey', apiKeySchema);