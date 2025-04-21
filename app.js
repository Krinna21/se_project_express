const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { ERROR_INTERNAL_SERVER } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    app.use((req, res) => {
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Failed to connect to the database" });
    });
  });

app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
