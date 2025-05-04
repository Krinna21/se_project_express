const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { ERROR_INTERNAL_SERVER } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to DB");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
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
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
