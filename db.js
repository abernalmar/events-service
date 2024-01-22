const mongoose = require('mongoose');

const DB_URL = (process.env.DB_URL ||"mongodb+srv://eventos:eventos23@events-service.spgszx5.mongodb.net/?retryWrites=true&w=majority");


mongoose.connect(DB_URL);
const db = mongoose.connection;

// recover from errors
db.on('error', console.error.bind(console, 'db connection error'));

module.exports = db;