const sinon = require('sinon');
const OpinionBeeApiClient = require('opinionbee-api');
const { expect } = require('chai');
const app = require('./testableApp');

describe('GET /companies', () => {
  const stubbedCompanies = [{ id: 1 }, { id: 2 }];
  let companiesApiStub = null;

  beforeEach(() => {
    companiesApiStub = sinon.stub(OpinionBeeApiClient.prototype, 'companies').resolves(stubbedCompanies);
  });

  afterEach(() => {
    companiesApiStub.restore();
  });

  it('returns companies from Opinionbee', done => {
    app.get('/companies')
      .expect(200)
      .expect(res => {
        expect(companiesApiStub.called).to.equal(true);
        expect(res.body).to.deep.equal(stubbedCompanies);
      })
      .end(done);
  });
});
