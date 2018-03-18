const { expect } = require('chai');
const pollsAdapter = require('../../lib/pollsAdapter');

describe('pollsAdapter', () => {
  let polls = [];

  beforeEach(() => {
    polls = [{
      id: 1,
      date: '2017-12-01',
      headline: {
        CON: {
          pct: 40,
          party: { code: 'CON' }
        },
        LAB: {
          pct: 39,
          party: { code: 'LAB' }
        },
        LD: {
          pct: 15,
          party: { code: 'LD' }
        },
        UKIP: {
          pct: 8,
          party: { code: 'UKIP' }
        },
        GRN: {
          pct: 4,
          party: { code: 'GRN' }
        }
      }
    }];
  });

  it('formats polls', () => {
    expect(pollsAdapter.toResponse(polls)).to.deep.equal([{
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
    }]);
  });

  it('excludes not major-party results results', () => {
    // e.g. DK = Don't know
    polls[0].headline.DK = {
      pct: 1,
      party: {
        code: 'DK'
      }
    };

    expect(pollsAdapter.toResponse(polls)).to.deep.equal([{
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
    }]);
  });
});
