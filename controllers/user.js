const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const JWT_SECRET  = require("../utils/config");

const {
  ERROR_DOES_NOT_EXIST,
  INVALID_DATA_CODE,
  DOES_NOT_EXIST_CODE,
  DEFAULT_CODE,
  CONFLICT_CODE,
  UNAUTHORIZED_CODE,
} = require("../utils/errors");


module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (error) {
      res.status(DEFAULT_CODE).send({ message: "Error with the server" });
    }
  },

  async findUser(req, res) {
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
  },

  async createUser(req, res) {
    const { name, avatar, email, password } = req.body;

    bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.create({ name, avatar, email, password: hash })
          .then((user) => {
            res.send({ name, avatar, email, _id: user._id });
          })
          .catch((error) => {
            if (error.name === "ValidationError") {
              res.status(INVALID_DATA_CODE).send({
                message: "Data provided is invalid",
              });
            } else if (error.code === 11000) {
              res
                .status(CONFLICT_CODE)
                .send({ message: "User with this email already exists" });
            } else {
              res
                .status(DEFAULT_CODE)
                .send({ message: "Error with the server" });
            }
          });
      })
      .catch(() => {
        res.status(DEFAULT_CODE).send({ message: "Error with the server" });
      });
  },

  async login(req, res) {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      })
      .catch((error) => {
        res.status(UNAUTHORIZED_CODE).send({ message: error.message });
      });
  },

  async getCurrentUser(req, res) {
    User.findById(req.user._id)
      .orFail(() => {
        throw ERROR_DOES_NOT_EXIST;
      })
      .then((user) => res.send({ data: user }))
      .catch((error) => {
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
      });
  },
  async updateUser(req, res) {
    const { name, avatar } = req.body;

    User.findByIdAndUpdate(req.user._id, { name, avatar })
      .orFail(() => {
        throw ERROR_DOES_NOT_EXIST;
      })
      .then((user) => res.send(user))
      .catch((error) => {
        if (error.name === "ValidationError") {
          res.status(INVALID_DATA_CODE).send({
            message: "Data provided is invalid",
          });
        } else if (error.statusCode === DOES_NOT_EXIST_CODE) {
          res.status(DOES_NOT_EXIST_CODE).send({
            message: "Requested data could not be found",
          });
        } else {
          res.status(DEFAULT_CODE).send({ message: "Error with the server" });
        }
      });
  },
};
