const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then()
  .catch(console.error);

app.use(express.json());
app.use((req, next) => {
  req.user = {
    _id: "67a280ac23258c2c7b731ef7",
  };
  next();
});

app.use("/", indexRouter);

app.listen(PORT);
