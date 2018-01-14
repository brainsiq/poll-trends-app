const sinon = require('sinon');
const OpinionBeeApiClient = require('opinionbee-api');
const { expect } = require('chai');
const app = require('./testableApp');

describe('GET /polls', () => {
  const stubbedPolls = [{ id: 1 }, { id: 2 }];
  let pollsApiStub = null;

  beforeEach(() => {
    pollsApiStub = sinon.stub(OpinionBeeApiClient.prototype, 'polls').resolves(stubbedPolls);
  });

  afterEach(() => {
    pollsApiStub.restore();
  });

  it('returns polls from Opinionbee', done => {
    app.get('/polls')
      .expect(200)
      .expect(res => {
        expect(pollsApiStub.called).to.equal(true);
        expect(res.body).to.deep.equal(stubbedPolls);
      })
      .end(done);
  });
});
