var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var eventsRouter = require("./routes/events");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use("/", indexRouter);
app.use("/api/v1/events", eventsRouter);

//Connection to mongo
const mongoose = require("mongoose");

const DB_URL =
  "mongodb+srv://eventos:eventos23@events-service.spgszx5.mongodb.net/?retryWrites=true&w=majority";
console.log("Connecting: %s", DB_URL);
mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "db connection error"));

module.exports = app;
