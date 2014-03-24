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

/* The K Combinator: given x, return a function of one argument that will always return x.
/* We will use this to define set in terms of over.
*/
//+ _K :: a -> (_ -> a)
var _K = function(x) { return function(y) { return x; } }

/* Deep-copy properties from source to destination, replacing any values found in identical paths,
/* and leaving untouched any values found at paths that don't exist in the source object.
/* This function mutates the destination object!
*/
	// stolen from http://stackoverflow.com/questions/11299284/javascript-deep-copying-object
  , _merge = function(destination, source) {
      for (var property in source) {
        if (typeof source[property] === "object" && source[property] !== null && destination[property]) {
          _merge(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    }

  , clone = function(obj) {
      return _merge({}, obj);
    }

/* Return an array in which the key'th element of xs has been replaced by rep.
*/
//+ _arraySplice :: Int -> Object -> Array -> Array
  , _arraySplice = function(key, rep, xs) {
      var ys = xs.slice(0);
      ys.splice(key, 1, rep);
      return ys;
    }

/* Return a string in which the key'th character of str has been replaced by rep.
/* (No check is done to ensure that rep is only a single character.)
*/
//+ _stringSplice :: Int -> String -> String -> String
  , _stringSplice = function(key, rep, str) {
  	  return str.substr(0,key) + rep + str.substr(key+1);
		}

/* Return an object in which the property indexed by key in obj has been replaced by rep.
*/
//+ _objectSplice :: String -> Object -> Object -> Object
  , _objectSplice = function(key, rep, obj) {
      var new_obj = clone(obj);
      new_obj[key] = rep;
      return new_obj;
    }

//+ arrayLens :: Int -> Lens
  , arrayLens = function(key, f, xs) {
			return fmap(function(rep) { return _arraySplice(key, rep, xs); }, f(xs[key]));
  	}

//+ stringLens :: Int -> Lens
  , stringLens = function(key, f, xs) {
			return fmap(function(rep) { return _stringSplice(key, rep, xs); }, f(xs[key]));
  	}

//+ objectLens :: String -> Lens
  , objectLens = function(key, f, xs) {
			return fmap(function(rep) { return _objectSplice(key, rep, xs); }, f(xs[key]));
  	}

//+ _intIndexedLens :: Int -> Lens
	, _intIndexedLens = function(n) {
			return curry(function(f, xs) {
				return (typeof xs === 'string') ? stringLens(n, f, xs) : arrayLens(n, f, xs);
			});
		}

//+ _stringIndexedLens :: String -> Lens
	, _stringIndexedLens = function(key) {
			return curry(function(f, x) {
        return objectLens(key, f, x);
			});
		}

  , _IntLenses = (function() {
      var list = [];
      for (var i = 0; i < 1000; i++) {
        list[i] = _intIndexedLens(i);
      }
      return list;
    })()

/* Return an object (suppose it's called obj) in which each property obj.key
/* where "key" is a string from the passed-in array, or obj[key] where key is an integer,
/* is a lens for that key.
*/
//+ makeLenses :: [String] -> {String: Lens}
	, makeLenses = function(keys) {
			return keys.reduce(function(acc, key) {
				acc[key] = _stringIndexedLens(key);
				return acc;
			}, _IntLenses);
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
