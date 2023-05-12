const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

require('dotenv').config();

const { JWT_SECRET } = process.env;

const User = require("../models/user");

const NotFoundError = require("../errors/NotFoundError");

const ConflictError = require('../errors/ConflictError')

const BadRequestError = require("../errors/BadRequestError");

const UnauthorizedError = require('../errors/UnauthorizedError')

module.exports = {
  async getUsers(req, res) {
    User.find({})
      .then((users) => res.send(users))
      .catch(() => {
        res.status(500).send({ message: "Error with the server" });
      });
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
          .catch((err) => {
            if (err.name === "ValidationError") {
              throw new BadRequestError("Data provided is invalid");
            } else if (err.code === 11000) {
              throw new ConflictError("User with this email already exists");
            } else {
              throw new Error("Error with the server");
            }
          });
      })
      .catch(() => {
        throw new Error("Error with the server");
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
        throw new UnauthorizedError(error.message);
      });
  },

  async getCurrentUser(req, res) {
    User.findById(req.user._id)
      .orFail(() => {
        throw new NotFoundError("Requested data could not be found");
      })
      .then((user) => res.send({ data: user }))
      .catch((error) => {
        if (error.name === "CastError") {
          throw new BadRequestError("Id provided was invalid");
        } else {
          throw new Error("Error with the server");
        }
      });
  },

  async updateUser(req, res) {
    const { name, avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true })
      .orFail(() => {
        throw new NotFoundError("Requested data could not be found");
      })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          throw new BadRequestError("Data provided is invalid");
        } else {
          throw new Error("Error with the server");
        }
      });
  },
};
