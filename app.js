const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const helmet = require("helmet");
const cors = require("cors");
const limiter = require("./utils/config");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorMiddleware");
const routes = require("./routes/index");

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const app = express();

const corsOptions = {
  origin: 'https://www.attireadvisor.chickenkiller.com'
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {

});
