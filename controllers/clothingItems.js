/* eslint-disable consistent-return */
const Item = require('../models/clothingItems');
const User = require('../models/user');
const {
  ERROR_DOES_NOT_EXIST,
  INVALID_DATA_CODE,
  DOES_NOT_EXIST_CODE,
  DEFAULT_CODE,
} = require('../utils/errors');

const handleErrors = (err, res) => {
  const { statusCode, name } = err;
  if (statusCode === DOES_NOT_EXIST_CODE) {
    res.status(DOES_NOT_EXIST_CODE).send({
      message: 'Requested data could not be found',
    });
  } else if (name === 'CastError') {
    res.status(INVALID_DATA_CODE).send({
      message: 'Id provided was invalid',
    });
  } else if (name === 'ValidationError') {
    res.status(INVALID_DATA_CODE).send({
      message: 'Data provided is invalid',
    });
  } else {
    res.status(DEFAULT_CODE).send({ message: 'Error with the server' });
  }
};

module.exports.getClothing = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => handleErrors(err, res));
};

module.exports.removeClothing = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        throw ERROR_DOES_NOT_EXIST;
      }

      if (item.owner.toString() !== userId.toString()) {
        res.status(403).send({ message: 'You are not authorized to delete this item' });
      } else {
        return Item.findByIdAndDelete(itemId)
          .then((deletedItem) => {
            res.send({ data: deletedItem });
          });
      }
    })
    .catch((err) => handleErrors(err, res));
};

module.exports.addClothing = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const { _id: owner } = req.user;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201);
      res.send({ data: item });
    })
    .catch((err) => handleErrors(err, res));
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
    .catch((err) => handleErrors(err, res));
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
    .catch((err) => handleErrors(err, res));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleErrors(err, res));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw ERROR_DOES_NOT_EXIST;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleErrors(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => handleErrors(err, res));
};

module.exports.ERROR_DOES_NOT_EXIST = ERROR_DOES_NOT_EXIST;
module.exports.INVALID_DATA_CODE = INVALID_DATA_CODE;