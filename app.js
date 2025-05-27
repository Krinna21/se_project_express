require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

app.use(
  cors({
    origin: "https://www.whatowear.jumpingcrab.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("Connected to DB");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to DB:", err);
  });

app.use(express.json());
app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

app.listen(PORT, () => {
  // console.log(`Listening on port ${PORT}`);
});
