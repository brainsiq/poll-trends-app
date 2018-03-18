const { enabledParties } = require('./config');

const headlineIsForEnabledParty = headline => enabledParties.includes(headline.party.code);

module.exports.toResponse = polls => polls.map(poll => ({
  id: poll.id,
  date: poll.date,
  results: Object.values(poll.headline)
    .filter(headlineIsForEnabledParty)
    .map(headline => ({
      party: headline.party.code,
      pct: headline.pct
    }))
}));
