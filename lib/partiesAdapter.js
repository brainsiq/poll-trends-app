const { enabledParties } = require('./config');

module.exports.toResponse = parties =>
  parties.reduce((response, party) => {
    const { name, code, colour } = party;

    if (!enabledParties.includes(code)) {
      return response;
    }

    return [...response, { name, code, colour }];
  }, []);
