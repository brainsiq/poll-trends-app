const querystring = require('querystring');
const { promisify } = require('util');
const joi = require('joi');
const Router = require('koa-router');
const OpinionBeeApiClient = require('opinionbee-api');
const { opinionBeeApiKey } = require('./config');
const news = require('./news');

const router = new Router();
const apiClient = new OpinionBeeApiClient({ apiKey: opinionBeeApiKey });

router.get('/companies', async ctx => {
  const companies = await apiClient.companies();

  ctx.body = companies;
});

router.get('/parties', async ctx => {
  const parties = await apiClient.parties();

  ctx.body = parties;
});

router.get('/polls', async ctx => {
  const polls = await apiClient.polls();

  ctx.body = polls;
});

const newsQuerySchema = {
  partyId: joi.string().min(1).max(4).required(),
  limit: joi.number().integer().min(1).max(30).required(),
  until: joi.string().regex(/\d{4}-\d{2}-\d{2}/).isoDate().required()
};

router.get('/news', async ctx => {
  const { limit, until, partyId } = querystring.parse(ctx.querystring);
  const assertQuerystring = promisify(joi.validate);

  await assertQuerystring({ partyId, limit, until }, newsQuerySchema);

  const newsItems = await news.get({ limit: +limit, until, partyId });

  ctx.body = newsItems;
});

module.exports = router.routes();
