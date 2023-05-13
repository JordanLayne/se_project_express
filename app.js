const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const limiter = require("./utils/config");
const { errors } = require("celebrate");
const helmet = require("helmet");
const cors = require("cors");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorMiddleware");
const routes = require("./routes/index");

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const app = express();

app.use(errorHandler);
app.use(helmet());
app.use(cors());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(limiter);
app.use(errors());
app.use(routes);
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
