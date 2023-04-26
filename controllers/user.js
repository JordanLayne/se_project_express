const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  ERROR_DOES_NOT_EXIST,
  INVALID_DATA_CODE,
  DOES_NOT_EXIST_CODE,
  DEFAULT_CODE,
  CONFLICT_CODE,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

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
    try {
      const {
        name = "Elise Bouer",
        avatar = "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png",
        email,
        password,
      } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(CONFLICT_CODE).send({
          message: "User with this email already exists",
        });
      }
      const user = await User.create({
        name,
        avatar,
        email,
        password: await bcrypt.hash(password, 10),
      });
     res.send({ data: user });
    } catch (error) {
      if (error.name === "ValidationError") {
        res.status(INVALID_DATA_CODE).send({
          message: "Data provided is invalid",
        });
      } else {
        res.status(DEFAULT_CODE).send({ message: "Error with the server" });
      }
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findUserByCredentials(email, password);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    } catch (error) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
  },

  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user._id).orFail(() => {
        throw ERROR_DOES_NOT_EXIST;
      });
      res.send({ data: user });
    } catch (error) {
      if (error.statusCode === DOES_NOT_EXIST_CODE) {
        res.status(DOES_NOT_EXIST_CODE).send({
          message: "Requested data could not be found",
        });
      } else {
        res.status(DEFAULT_CODE).send({ message: "Error with the server" });
      }
    }
  },
  async updateUserProfile(req, res) {
    try {
      const { name, avatar } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, avatar },
        { new: true, runValidators: true }
      );
      res.send({ data: user });
    } catch (error) {
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
    }
  },
};
