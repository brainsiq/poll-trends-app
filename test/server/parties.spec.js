const sinon = require('sinon');
const OpinionBeeApiClient = require('opinionbee-api');
const { expect } = require('chai');
const app = require('./testableApp');

describe('GET /parties', () => {
  const stubbedParties = [{ id: 1 }, { id: 2 }];
  let partiesApiStub = null;

  beforeEach(() => {
    partiesApiStub = sinon.stub(OpinionBeeApiClient.prototype, 'parties').resolves(stubbedParties);
  });

  afterEach(() => {
    partiesApiStub.restore();
  });

  it('returns parties from Opinionbee', done => {
    app.get('/parties')
      .expect(200)
      .expect(res => {
        expect(partiesApiStub.called).to.equal(true);
        expect(res.body).to.deep.equal(stubbedParties);
      })
      .end(done);
  });
});
