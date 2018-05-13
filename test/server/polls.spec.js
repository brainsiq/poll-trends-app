const sinon = require('sinon');
const OpinionBeeApiClient = require('opinionbee-api');
const { expect } = require('chai');
const app = require('./testableApp');

describe('GET /polls', () => {
  const company = 'yg';
  const limit = 50;
  const until = '2018-01-01';
  let stubbedPolls = [];
  let pollsApiStub = null;

  beforeEach(() => {
    stubbedPolls = [{
      id: 1,
      date: '2017-12-01',
      headline: {
        CON: {
          pct: 40,
          party: {
            code: 'CON'
          }
        },
        LAB: {
          pct: 39,
          party: {
            code: 'LAB'
          }
        },
        LD: {
          pct: 15,
          party: {
            code: 'LD'
          }
        },
        UKIP: {
          pct: 8,
          party: {
            code: 'UKIP'
          }
        },
        GRN: {
          pct: 4,
          party: {
            code: 'GRN'
          }
        }
      }
    }, {
      id: 2,
      date: '2018-01-01',
      headline: {
        CON: {
          pct: 40,
          party: {
            code: 'CON'
          }
        },
        LAB: {
          pct: 39,
          party: {
            code: 'LAB'
          }
        },
        LD: {
          pct: 15,
          party: {
            code: 'LD'
          }
        },
        UKIP: {
          pct: 8,
          party: {
            code: 'UKIP'
          }
        },
        GRN: {
          pct: 4,
          party: {
            code: 'GRN'
          }
        }
      }
    }];

    pollsApiStub = sinon.stub(OpinionBeeApiClient.prototype, 'polls').callsFake(() => {
      return Promise.resolve(stubbedPolls.slice());
    });
  });

  afterEach(() => {
    pollsApiStub.restore();
  });

  it('returns polls from Opinionbee', done => {
    app.get('/polls')
      .query({ company, limit, until })
      .expect(200)
      .expect(res => {
        sinon.assert.calledWith(pollsApiStub, { company, limit, endDate: until, pollType: 'WESTVI' });
        expect(res.body).to.deep.equal([{
          id: 1,
          date: '2017-12-01',
          results: [{
            party: 'CON',
            pct: 40
          }, {
            party: 'LAB',
            pct: 39
          }, {
            party: 'LD',
            pct: 15
          }, {
            party: 'UKIP',
            pct: 8
          }, {
            party: 'GRN',
            pct: 4
          }]
        }, {
          id: 2,
          date: '2018-01-01',
          results: [{
            party: 'CON',
            pct: 40
          }, {
            party: 'LAB',
            pct: 39
          }, {
            party: 'LD',
            pct: 15
          }, {
            party: 'UKIP',
            pct: 8
          }, {
            party: 'GRN',
            pct: 4
          }]
        }]);
      })
      .end(done);
  });

  it('sorts polls by date (oldest first)', done => {
    const oldPoll = { id: 3, date: '2017-01-01', headline: {} };

    stubbedPolls.push(oldPoll);

    app.get('/polls')
      .query({ company, limit, until })
      .expect(200)
      .expect(res => {
        expect(res.body.map(({ id }) => id))
          .to.deep.equal([3, 1, 2]);
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
