const { string } = require("joi");
const Joi = require("joi");

exports.authUser = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  listAs: Joi.string().required(),
  gender: Joi.string().required(),
  phone: Joi.string().required(),
});

exports.authProperty = Joi.object({
  propertyName: Joi.string().required(),
  cityId: Joi.number().required(),
  address: Joi.string().required(),
  yearPrice: Joi.number().required(),
  monthPrice: Joi.number().required(),
  dayPrice: Joi.number().required(),
  furnished: Joi.string().required(),
  petAllowed: Joi.string().required(),
  sharedAccomodation: Joi.string().required(),
  bedroom: Joi.number().required(),
  bathroom: Joi.number().required(),
  area: Joi.number().required(),
});

exports.authTransaction = Joi.object({
  checkin: Joi.string().required(),
  checkout: Joi.string().required(),
  total: Joi.number().required(),
  propertyId: Joi.number().required(),
  userId: Joi.number().required(),
  duration: Joi.string().required(),
  status: Joi.string(),
  attachment: Joi.string(),
});
