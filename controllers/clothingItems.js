const Item = require("../models/clothingItems");

const {
  ERROR_DOES_NOT_EXIST,

  INVALID_DATA_CODE,

  DOES_NOT_EXIST_CODE,

  DEFAULT_CODE,

  UNAUTHORIZED_CODE,
} = require("../utils/errors");

module.exports.getClothing = (req, res) => {
  Item.find({})

    .then((items) => res.send(items))

    .catch(() => {
      res.status(DEFAULT_CODE).send({ message: "Error with the server" });
    });
};

module.exports.removeClothing = (req, res) => {
  const owner = req.user._id;

  Item.findById(req.params.itemId)

    .orFail(() => {
      throw ERROR_DOES_NOT_EXIST;
    })

    .then((item) => {
      if (String(item.owner) !== owner) {
        return res.status(UNAUTHORIZED_CODE).send({
          message: "You do not have permission to delete this resource",
        });
      }

      return item.deleteOne().then(() => res.send({ data: item }));
    })

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

module.exports.addClothing = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })

    .then((item) => {
      res.status(201);

      res.send({ data: item });
    })

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

module.exports.likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,

    { $addToSet: { likes: req.user._id } },

    { new: true }
  )

    .orFail(() => {
      throw ERROR_DOES_NOT_EXIST;
    })

    .then((item) => res.send({ data: item }))

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

module.exports.dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,

    { $pull: { likes: req.user._id } },

    { new: true }
  )

    .orFail(() => {
      throw ERROR_DOES_NOT_EXIST;
    })

    .then((item) => res.send({ data: item }))

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
