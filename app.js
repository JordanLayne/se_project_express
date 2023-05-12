const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const { errors } = require("celebrate");

const helmet = require("helmet");

const cors = require("cors");

const errorHandler = require("./middlewares/errorMiddleware");

const routes = require("./routes/index");

const limiter = require("./rateLimitConfig");

const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());

app.use(helmet());

app.use(requestLogger);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.use(limiter);

app.use(routes);

app.listen(PORT, () => {});
