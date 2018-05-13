const joi = require('joi');

const datePattern = /\d{4}-\d{2}-\d{2}/;

const newsQueryString = {
  partyId: joi.string().min(1).max(4).required(),
  limit: joi.number().integer().min(1).max(30).required(),
  pollDate: joi.string().regex(datePattern).isoDate().required()
};

const pollsQueryString = {
  company: joi.string().min(1).max(12).required(),
  limit: joi.number().integer().min(1).max(100).required(),
  until: joi.string().regex(datePattern).isoDate().required()
};

module.exports = {
  newsQueryString,
  pollsQueryString
};
