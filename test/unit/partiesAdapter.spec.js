const { expect } = require('chai');
const partiesAdapter = require('../../lib/partiesAdapter');

describe('partiesAdapter', () => {
  let parties = [];

  beforeEach(() => {
    parties = [{
      name: 'Conservatives',
      code: 'CON',
      colour: 'blue',
      textcolour: 'not blue',
      beep: 'boop'
    }, {
      name: 'Labour',
      code: 'LAB',
      colour: 'red',
      textcolour: 'not red',
      foo: 'bar'
    }];
  });

  it('removes unwanted fields', () => {
    expect(partiesAdapter.toResponse(parties)).to.deep.equal([{
      name: 'Conservatives',
      code: 'CON',
      colour: 'blue'
    }, {
      name: 'Labour',
      code: 'LAB',
      colour: 'red'
    }]);
  });

  it('excludes not major-party results results', () => {
    parties.push({
      name: 'Sinn Fein',
      code: 'SF'
    });

    const codes = partiesAdapter.toResponse(parties).map(({ code }) => code);

    expect(codes).to.deep.equal(['CON', 'LAB']);
  });
});
