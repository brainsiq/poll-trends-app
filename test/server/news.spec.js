const sinon = require('sinon');
const { expect } = require('chai');
const app = require('./testableApp');
const news = require('../../lib/news');

describe('GET /news', () => {
  const until = '2018-01-01';
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
      .query({ until, partyId, limit })
      .expect(200)
      .expect(res => {
        expect(res.body).to.deep.equal(stubbedNews);
        sinon.assert.calledWith(newsStub, { limit, partyId, until });
      })
      .end(done);
  });

  it('validates "partyId"', done => {
    app.get('/news')
      .query({ until, limit })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"partyId" is required/);
      })
      .end(done);
  });

  it('validates "limit"', done => {
    app.get('/news')
      .query({ partyId, until, limit: -1 })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"limit" must be larger than or equal to 1/);
      })
      .end(done);
  });

  it('validates "until"', done => {
    app.get('/news')
      .query({ partyId, limit, until: 'sdfsdk' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"until" .* fails to match the required pattern/);
      })
      .end(done);
  });

  it('validates that "until" is an actual date', done => {
    app.get('/news')
      .query({ partyId, limit, until: '2018-01-40' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"until" must be a valid ISO 8601 date/);
      })
      .end(done);
  });
});
