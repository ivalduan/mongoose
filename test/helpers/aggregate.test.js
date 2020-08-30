'use strict';

const assert = require('assert');
const stringifyAccumulatorOptions = require('../../lib/helpers/aggregate/stringifyAccumulatorOptions');

describe('stringifyAccumulatorOptions', function() {
  it('converts accumulator args to strings (gh-9364)', function() {
    const pipeline = [{
      $group: {
        _id: '$author',
        avgCopies: {
          $accumulator: {
            init: function() {
              return { count: 0, sum: 0 };
            },
            accumulate: function(state, numCopies) {
              return {
                count: state.count + 1,
                sum: state.sum + numCopies
              };
            },
            accumulateArgs: ['$copies'],
            merge: function(state1, state2) {
              return {
                count: state1.count + state2.count,
                sum: state1.sum + state2.sum
              };
            },
            finalize: function(state) {
              return (state.sum / state.count);
            },
            lang: 'js'
          }
        }
      }
    }];

    stringifyAccumulatorOptions(pipeline);

    assert.equal(typeof pipeline[0].$group.avgCopies.$accumulator.init, 'string');
    assert.equal(typeof pipeline[0].$group.avgCopies.$accumulator.accumulate, 'string');
    assert.equal(typeof pipeline[0].$group.avgCopies.$accumulator.merge, 'string');
    assert.equal(typeof pipeline[0].$group.avgCopies.$accumulator.finalize, 'string');
  });
});