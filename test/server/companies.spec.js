const sinon = require('sinon');
const OpinionBeeApiClient = require('opinionbee-api');
const { expect } = require('chai');
const app = require('./testableApp');

describe('GET /companies', () => {
  const fixtures = {
    stubbedCompanies: []
  };
  let companiesApiStub = null;

  beforeEach(() => {
    fixtures.stubbedCompanies = [{ code: 1, name: 'foo', canonical: 'foo' }, { code: 2, name: 'bar', canonical: 'bar' }];

    companiesApiStub = sinon.stub(OpinionBeeApiClient.prototype, 'companies').resolves(fixtures.stubbedCompanies);
  });

  afterEach(() => {
    companiesApiStub.restore();
  });

  it('calls Opinionbee', done => {
    app.get('/companies')
      .expect(200)
      .expect(() => {
        expect(companiesApiStub.called).to.equal(true);
      })
      .end(done);
  });

  it('returns only company id and name', done => {
    app.get('/companies')
      .expect(200)
      .expect(res => {
        expect(res.body).to.deep.equal([
          { id: 1, name: 'foo' },
          { id: 2, name: 'bar' }
        ]);
      })
      .end(done);
  });
});
