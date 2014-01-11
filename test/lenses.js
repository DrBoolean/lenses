var Lenses = require('../src/lenses').expose(global)
  , assert = require("assert")
  , compose = require('pointfree-fantasy').compose
  , curry = require('lodash.curry')
  ;

var add = curry(function(x, y) { return x + y; });

describe('Lenses', function() {
	describe("Object Lens", function() {
		var state = {user: {birthday: {day: 22, year: 1982}}, settings: {level: 20}}
			, L = makeLenses(['user', 'birthday', 'day', 'year', 'settings', 'level'])
			, userBirthdayYear = compose(L.user, L.birthday, L.year)
			;

	  it('returns the value from the object', function() {
			assert.equal(view(userBirthdayYear, state), 1982)
    });

    it('sets the value for the object', function() {
			assert.deepEqual(set(userBirthdayYear, 1999, state), {user: {birthday: {day: 22, year: 1999}}, settings: {level: 20}})
	  });

	  it('modifies the value of the object', function() {
			assert.deepEqual(over(userBirthdayYear, add(2), state), {user: {birthday: {day: 22, year: 1984}}, settings: {level: 20}})
	  });
	});

	describe("Array Lens", function() {
		it('alters the second element', function() {
			assert.deepEqual(over(_2, add(1), [1,2,3]), [1,3,3])
		});

		it('views the third element', function() {
			assert.deepEqual(view(_3, [13,12,9]), 9)
		});

		it('sets the first element', function() {
			assert.deepEqual(set(_1, 10, [13,12,9]), [10,12,9]);
		});
	});

	describe("String Lens", function() {
		it('alters the second element', function() {
			assert.deepEqual(over(_2, add('im'), 'the string'), 'timhe string')
		});

		it('views the third element', function() {
			assert.deepEqual(view(_3, 'the'), 'e')
		});

		it('sets the first element', function() {
			assert.deepEqual(set(_1, 'b', 'sync'), 'bync');
		});
	});


	it('maps like fmap', function() {
		var f = over(compose(mapped, mapped, mapped), add(1))
		assert.deepEqual(f([[[2]]]), [[[3]]])
	});
});
