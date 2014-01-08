var Id = require('./lib/identity')
	, Identity = Id.Identity
	, runIdentity = Id.runIdentity
	, Constant = require('./lib/const')
	, Const = Constant.Const
	, getConst = Constant.getConst
	, Pf = require('./lib/pointfree')
	, compose = Pf.compose
	, fmap = Pf.fmap
	, curry = require('lodash.curry')
	;

//+ _K :: a -> (_ -> a)
var _K = function(x) { return function(y) { return x; } }

	// stolen from http://stackoverflow.com/questions/11299284/javascript-deep-copying-object
  , _clone = function(destination, source) {
      for (var property in source) {
        if (typeof source[property] === "object" && source[property] !== null && destination[property]) { 
          clone(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    }

//+ _makeNLens :: Int -> Lens
	, _makeNLens = function(n) {
			return curry(function(f, xs) {
				var ys = xs.slice(0);
				return fmap(function(x) { ys.splice(n, 1, x); return ys; }, f(xs[n]));
			});
		}

//+ _makeKeyLens :: String -> Lens
	, _makeKeyLens = function(key) {
			return curry(function(f, x) {
				return fmap(function(val) {
					var new_obj = _clone({}, x);
					new_obj[key] = val;
					return new_obj;
				}, f(x[key]));
			});
		}

//+ makeLenses :: [String] -> {String: Lens}
	, makeLenses = function(keys) {
			return keys.reduce(function(acc, key) {
				acc[key] = _makeKeyLens(key);
				return acc;
			}, {});
		}

	, _1 = _makeNLens(0)
	, _2 = _makeNLens(1)
	, _3 = _makeNLens(2)
	, _4 = _makeNLens(3)
	, _5 = _makeNLens(4)
	, _6 = _makeNLens(5)
	, _7 = _makeNLens(6)
	, _8 = _makeNLens(7)
	, _9 = _makeNLens(8)

//+ set :: (a -> Identity	b) -> s -> Identity t -> b -> s -> t
	, set = curry(function(lens, val, x) {
			return over(lens, _K(val), x);
		})

//+ view :: (a -> Const	r) -> s -> Const r -> s -> a
	,	view = curry(function(lens, x) {
			return compose(getConst, lens(Const))(x);
		})

//+ over :: (a -> Identity b) -> s -> Identity t -> b -> s -> t
	, over = curry(function(lens, f, x) {
			return compose(runIdentity, lens(compose(Identity,f)))(x);
		})

//+ mapped :: (a -> Identity b) -> s -> Identity t
	,	mapped = curry(function(f, x) {
		  return Identity(fmap(compose(runIdentity, f), x));
		})
	;

var _Lenses = { makeLenses: makeLenses
						  , set: set
						  , view: view
						  , over: over
						  , mapped: mapped
						  , _1 : _1
						  , _2 : _2
						  , _3 : _3
						  , _4 : _4
						  , _5 : _5
						  , _6 : _6
						  , _7 : _7
						  , _8 : _8
						  , _9 : _9
						  }

_Lenses.expose = function(env) {
  var f;
  for (f in _Lenses) {
    if (f !== 'expose' && _Lenses.hasOwnProperty(f)) {
      env[f] = _Lenses[f];
    }
  }
  return _Lenses;
}

module.exports = _Lenses;
if(typeof window == "object") {
	Lenses = _Lenses;
}

// next up folds and traverses...
