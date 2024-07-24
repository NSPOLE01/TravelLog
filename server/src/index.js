const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const middlewars = require("./middlewares");
const mongoose = require("mongoose");
const logs = require("./api/logs");

require("dotenv").config();
const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("common"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.use("/api/logs", logs);

app.use(middlewars.notFound);
app.use(middlewars.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`listening at http://localhost:1337`);
});
