const User = require('../models/user');
const {
  ERROR_DOES_NOT_EXIST,
  INVALID_DATA_CODE,
  DOES_NOT_EXIST_CODE,
  DEFAULT_CODE,
} = require("../utils/errors");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(DEFAULT_CODE).send({ message: "Error with the server" });
  }
};

module.exports.findUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(() => {
      throw ERROR_DOES_NOT_EXIST;
    });
    res.send({ data: user });
  } catch (error) {
    if (error.statusCode === DOES_NOT_EXIST_CODE) {
      res.status(DOES_NOT_EXIST_CODE).send({
        message: "Requested data could not be found",
      });
    } else if (error.name === "CastError") {
      res.status(INVALID_DATA_CODE).send({
        message: "Id provided was invalid",
      });
    } else {
      res.status(DEFAULT_CODE).send({ message: "Error with the server" });
    }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.create({ name, avatar });
    res.send(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(INVALID_DATA_CODE).send({
        message: "Data provided is invalid",
      });
    } else {
      res.status(DEFAULT_CODE).send({ message: "Error with the server" });
    }
  }
};