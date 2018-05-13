const sinon = require('sinon');
const { expect } = require('chai');
const app = require('./testableApp');
const news = require('../../lib/news');

describe('GET /news', () => {
  const pollDate = '2018-01-01';
  const partyId = 'lab';
  const limit = 10;
  const stubbedNews = [{ id: 1 }, { id: 2 }];
  let newsStub = null;

  beforeEach(() => {
    newsStub = sinon.stub(news, 'get').resolves(stubbedNews);
  });

  afterEach(() => {
    newsStub.restore();
  });

  it('returns news from The Guardian', done => {
    app.get('/news')
      .query({ pollDate, partyId, limit })
      .expect(200)
      .expect(res => {
        expect(res.body).to.deep.equal(stubbedNews);
        sinon.assert.calledWith(newsStub, { limit, partyId, until: new Date('2017-12-31') });
      })
      .end(done);
  });

  it('validates "partyId"', done => {
    app.get('/news')
      .query({ pollDate, limit })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"partyId" is required/);
      })
      .end(done);
  });

  it('validates "limit"', done => {
    app.get('/news')
      .query({ partyId, pollDate, limit: -1 })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"limit" must be larger than or equal to 1/);
      })
      .end(done);
  });

  it('validates "pollDate"', done => {
    app.get('/news')
      .query({ partyId, limit, pollDate: 'sdfsdk' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"pollDate" .* fails to match the required pattern/);
      })
      .end(done);
  });

  it('validates that "pollDate" is an actual date', done => {
    app.get('/news')
      .query({ partyId, limit, pollDate: '2018-01-40' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"pollDate" must be a valid ISO 8601 date/);
      })
      .end(done);
  });
});
