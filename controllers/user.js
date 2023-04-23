const User = require('../models/user');
const {
  ERROR_DOES_NOT_EXIST,
  INVALID_DATA_CODE,
  DOES_NOT_EXIST_CODE,
  DEFAULT_CODE,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(DEFAULT_CODE).send({ message: "Error with the server" });
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw ERROR_DOES_NOT_EXIST;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === DOES_NOT_EXIST_CODE) {
        res.status(DOES_NOT_EXIST_CODE).send({
          message: "Requested data could not be found",
        });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA_CODE).send({
          message: "Id provided was invalid",
        });
      } else {
        res.status(DEFAULT_CODE).send({ message: "Error with the server" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA_CODE).send({
          message: "Data provided is invalid",
        });
      } else {
        res.status(DEFAULT_CODE).send({ message: "Error with the server" });
      }
    });
};