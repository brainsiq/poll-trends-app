const querystring = require('querystring');
const { promisify } = require('util');
const joi = require('joi');
const Router = require('koa-router');
const OpinionBeeApiClient = require('opinionbee-api');
const config = require('./config');
const news = require('./news');
const {
  newsQueryString: newsQueryStringSchema,
  pollsQueryString: pollsQueryStringSchema
} = require('./requestSchemas');

const router = new Router();
const apiClient = new OpinionBeeApiClient({ apiKey: config.opinionBeeApiKey });
const assertQueryString = promisify(joi.validate);

router.get('/companies', async ctx => {
  const companies = await apiClient.companies();

  ctx.body = companies
    .filter(company => config.enabledCompanies.includes(company.code))
    .map(({ code, name }) => ({
      id: code,
      name
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

router.get('/parties', async ctx => {
  const parties = await apiClient.parties();

  ctx.body = parties;
});

router.get('/polls', async ctx => {
  const { company, limit, until } = querystring.parse(ctx.querystring);

  await assertQueryString({ company, limit, until }, pollsQueryStringSchema);

  const polls = await apiClient.polls({ company, limit: +limit, endDate: until });

  ctx.body = polls.sort((p1, p2) => p1.date.localeCompare(p2.date));
});

router.get('/news', async ctx => {
  const { limit, until, partyId } = querystring.parse(ctx.querystring);

  await assertQueryString({ partyId, limit, until }, newsQueryStringSchema);

  const newsItems = await news.get({ limit: +limit, until, partyId });

  ctx.body = newsItems;
});

module.exports = router.routes();
