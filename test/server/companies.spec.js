const sinon = require('sinon');
const OpinionBeeApiClient = require('opinionbee-api');
const { expect } = require('chai');
const config = require('../../lib/config');
const app = require('./testableApp');

describe('GET /companies', () => {
  const fixtures = {
    stubbedCompanies: []
  };
  const enabledCompanies = config.enabledCompanies;
  const expectedCompanies = [
    { id: 'YG', name: 'YouGov' }
  ];
  let companiesApiStub = null;

  beforeEach(() => {
    fixtures.stubbedCompanies = [
      { code: 'YG', name: 'YouGov', canonical: 'yougov' }
    ];

    config.enabledCompanies = ['YG'];

    companiesApiStub = sinon.stub(OpinionBeeApiClient.prototype, 'companies').resolves(fixtures.stubbedCompanies);
  });

  afterEach(() => {
    config.enabledCompanies = enabledCompanies;
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
        expect(res.body).to.deep.equal(expectedCompanies);
      })
      .end(done);
  });

  it('returns only the enabled companies', done => {
    fixtures.stubbedCompanies.push({ code: 'OP', name: 'Opinium' });

    app.get('/companies')
      .expect(200)
      .expect(res => {
        expect(res.body).to.deep.equal(expectedCompanies);
      })
      .end(done);
  });

  it('sorts companies by name', done => {
    config.enabledCompanies = ['YG', 'OP'];

    fixtures.stubbedCompanies.push({ code: 'OP', name: 'Opinium' });

    app.get('/companies')
      .expect(200)
      .expect(res => {
        expect(res.body).to.deep.equal([
          { id: 'OP', name: 'Opinium' },
          expectedCompanies[0]
        ]);
      })
      .end(done);
  });
});
