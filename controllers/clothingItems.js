const Item = require("../models/clothingItems");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

module.exports.getClothing = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch(() => {
      next(new BadRequestError("Error with the server"));
    });
};

module.exports.removeClothing = async (req, res, next) => {
  const owner = req.user._id;

  const item = await Item.findById(req.params.itemId).orFail(() => {
    throw new NotFoundError("Item not found");
  });

  if (String(item.owner) !== owner) {
    return next(
      new ForbiddenError("You do not have permission to delete this resource")
    );
  }

  await item.deleteOne();
  res.send({ data: item });
};

module.exports.addClothing = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201);
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Data provided is invalid"));
      } else {
        next(new BadRequestError("Error with the server"));
      }
    });
};

module.exports.likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(new NotFoundError("Requested data could not be found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Id provided was invalid"));
      } else {
        next(new BadRequestError("Error with the server"));
      }
    });
};

module.exports.dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(new NotFoundError("Requested data could not be found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Id provided was invalid"));
      } else {
        next(new BadRequestError("Error with the server"));
      }
    });
};
