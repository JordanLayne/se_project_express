const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }

  return helpers.error("string.email");
};

const nameValidation = Joi.string().required().min(2).max(30).messages({
  "string.min": 'The minimum length of the "name" field is 2',
  "string.max": 'The maximum length of the "name" field is 30',
  "string.empty": 'The "name" field must be filled in',
});

const imageUrlValidation = Joi.string().required().custom(validateUrl).messages({
  "string.empty": 'The "imageUrl" field must be filled in',
  "string.uri": 'The "imageUrl" field must be a valid url',
});

const weatherValidation = Joi.string().required().valid("hot", "warm", "cold").messages({
  "string.empty": 'The "weather" field must be filled in',
});

const avatarValidation = Joi.string().custom(validateUrl).allow(null, "").messages({
  "string.uri": 'The "avatar" field must be a valid url',
});

const emailValidation = Joi.string().required().custom(validateEmail).messages({
  "string.empty": 'The "email" field must be filled in',
  "string.email": 'The "email" field must be a valid email address',
});

const passwordValidation = Joi.string().required().messages({
  "string.empty": 'The "password" field must be filled in',
});

module.exports.validateItemInfo = celebrate({
  body: Joi.object().keys({
    name: nameValidation,
    imageUrl: imageUrlValidation,
    weather: weatherValidation,
  }),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: nameValidation,
    avatar: avatarValidation,
    email: emailValidation,
    password: passwordValidation,
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: passwordValidation,
  }),
});

module.exports.validateIds = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).messages({
      "string.hex": "'_id' does not use hexadecimal values",
      "string.length": "'_id' length is not equal to 24",
    }),
  }),
});
