const sinon = require('sinon');
const OpinionBeeApiClient = require('opinionbee-api');
const { expect } = require('chai');
const app = require('./testableApp');

describe('GET /polls', () => {
  const stubbedPolls = [{ id: 1 }, { id: 2 }];
  const company = 'yg';
  const limit = 50;
  const until = '2018-01-01';
  let pollsApiStub = null;

  beforeEach(() => {
    pollsApiStub = sinon.stub(OpinionBeeApiClient.prototype, 'polls').resolves(stubbedPolls);
  });

  afterEach(() => {
    pollsApiStub.restore();
  });

  it('returns polls from Opinionbee', done => {
    app.get('/polls')
      .query({ company, limit, until })
      .expect(200)
      .expect(res => {
        sinon.assert.calledWith(pollsApiStub, { company, limit, endDate: until });
        expect(res.body).to.deep.equal(stubbedPolls);
      })
      .end(done);
  });

  it('validates "company"', done => {
    app.get('/polls')
      .query({ company: '', limit, until })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"company" is not allowed to be empty/);
      })
      .end(done);
  });

  it('validates "limit"', done => {
    app.get('/polls')
      .query({ company, limit: 500, until })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"limit" must be less than or equal to 100/);
      })
      .end(done);
  });

  it('validates "until"', done => {
    app.get('/polls')
      .query({ company, limit, until: '2018-01-99' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.match(/"until" must be a valid ISO 8601 date/);
      })
      .end(done);
  });
});
