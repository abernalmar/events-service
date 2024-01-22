const mongoose = require('mongoose');
const dbConnect = require('./db');
const ApiKey = require('./models/apikey');

dbConnect.on("connected", async () => {
    try {
        const user = new ApiKey({ user: "admin" });
        await user.save();
        console.log("ApiKey: " + user.apiKey);
    } catch (err) {
        console.error(err);
    }
});