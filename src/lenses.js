var Id = require('pointfree-fantasy/instances/identity')
	, Identity = Id.Identity
	, runIdentity = Id.runIdentity
	, Constant = require('pointfree-fantasy/instances/const')
	, Const = Constant.Const
	, getConst = Constant.getConst
	, Pf = require('pointfree-fantasy')
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
          _clone(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    }

//+ _insertStr :: Int -> String -> String -> String
  , _insertStr = function (idx, rep, str) {
  	  return str.substr(0,idx) + rep + str.substr(idx+1);
		}

//+ arrayLens :: Int -> Lens
  , arrayLens = function(n, f, xs) {
			var ys = xs.slice(0);
			return fmap(function(x) { ys.splice(n, 1, x); return ys; }, f(xs[n]));
  	}

//+ stringLens :: Int -> Lens
  , stringLens = function(n, f, xs) {
			return fmap(function(x) { return _insertStr(n, x, xs); }, f(xs[n]));
  	}

//+ _makeNLens :: Int -> Lens
	, _makeNLens = function(n) {
			return curry(function(f, xs) {
				return (typeof xs === 'string') ? stringLens(n, f, xs) : arrayLens(n, f, xs);
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
			}, {
				_num : _makeNLens
			});
		}

//+ set :: (a -> Identity	b) -> s -> Identity t -> b -> s -> t
	, set = curry(function(lens, val, x) {
			return over(lens, _K(val), x);
		})

//+ view :: (a -> Const	r) -> s -> Const r -> s -> a
	, view = curry(function(lens, x) {
			return compose(getConst, lens(Const))(x);
		})

//+ over :: (a -> Identity b) -> s -> Identity t -> b -> s -> t
	, over = curry(function(lens, f, x) {
			return compose(runIdentity, lens(compose(Identity,f)))(x);
		})

//+ mapped :: (a -> Identity b) -> s -> Identity t
	, mapped = curry(function(f, x) {
		  return Identity(fmap(compose(runIdentity, f), x));
		})
	;

var _Lenses = { makeLenses: makeLenses
						  , set: set
						  , view: view
						  , over: over
						  , mapped: mapped
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
