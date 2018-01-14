const querystring = require('querystring');
const nock = require('nock');
const config = require('../../lib/config');
const news = require('../../lib/news');
const { expect } = require('chai');

const testApiKey = 'foobar';
const testGuardianNewsQuery = (expectedQuery, done, partyId) => {
  nock.disableNetConnect();

  nock('http://content.guardianapis.com')
    .get('/search')
    .query((actualQueryString) => console.log(querystring.stringify(actualQueryString), expectedQuery) || querystring.stringify(actualQueryString) === expectedQuery)
    .reply(200, {
      response: {
        results: []
      }
    });

  const options = {
    until: new Date(2015, 0, 1),
    limit: 15
  };

  if (partyId) {
    options.partyId = partyId;
  }

  news.get(options)
    .then(results => {
      expect(results).to.deep.equal([]);
      done();
    })
    .catch(done.fail);
};

describe('news', () => {
  beforeEach(() => {
    config.guardianApiKey = testApiKey;
  });

  afterEach(() => {
    config.guardianApiKey = process.env.GUARDIAN_API_KEY;
  });

  it('should get news from the guardian for the 7 days up to the requested date', done => {
    const expectedQuery = `show-fields=thumbnail&section=politics&tag=theguardian%2Fmainsection%2Ctone%2Fnews&api-key=${testApiKey}&to-date=2015-01-01&from-date=2014-12-25&page-size=15`;
    testGuardianNewsQuery(expectedQuery, done);
  });

  it('should request the labour party tag when partyId is lab', done => {
    const expectedQuery = `show-fields=thumbnail&section=politics&tag=theguardian%2Fmainsection%2Ctone%2Fnews%2Cpolitics%2Flabour&api-key=${testApiKey}&to-date=2015-01-01&from-date=2014-12-25&page-size=15`;
    testGuardianNewsQuery(expectedQuery, done, 'lab');
  });

  it('should request the conservatives party tag when partyId is con', done => {
    const expectedQuery = `show-fields=thumbnail&section=politics&tag=theguardian%2Fmainsection%2Ctone%2Fnews%2Cpolitics%2Fconservatives&api-key=${testApiKey}&to-date=2015-01-01&from-date=2014-12-25&page-size=15`;
    testGuardianNewsQuery(expectedQuery, done, 'con');
  });

  it('should request the lib dem party tag when partyId is ld', done => {
    const expectedQuery = `show-fields=thumbnail&section=politics&tag=theguardian%2Fmainsection%2Ctone%2Fnews%2Cpolitics%2Fliberaldemocrats&api-key=${testApiKey}&to-date=2015-01-01&from-date=2014-12-25&page-size=15`;
    testGuardianNewsQuery(expectedQuery, done, 'ld');
  });

  it('should request the ukip party tag when partyId is ukip', done => {
    const expectedQuery = `show-fields=thumbnail&section=politics&tag=theguardian%2Fmainsection%2Ctone%2Fnews%2Cpolitics%2Fukip&api-key=${testApiKey}&to-date=2015-01-01&from-date=2014-12-25&page-size=15`;
    testGuardianNewsQuery(expectedQuery, done, 'ukip');
  });

  it('should request the green party tag when partyId is grn', done => {
    const expectedQuery = `show-fields=thumbnail&section=politics&tag=theguardian%2Fmainsection%2Ctone%2Fnews%2Cpolitics%2Fgreen-party&api-key=${testApiKey}&to-date=2015-01-01&from-date=2014-12-25&page-size=15`;
    testGuardianNewsQuery(expectedQuery, done, 'grn');
  });
});
