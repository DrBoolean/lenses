var Identity = require('fantasy-identities')
	, Constant = require('pointfree-fantasy/instances/const')
	, Const = Constant.Const
	, getConst = Constant.getConst
	, Pf = require('pointfree-fantasy')
	, compose = Pf.compose
	, map = Pf.map
	, traverse = Pf.traverse
	, _ = require('lodash')
  , curry = _.curry
	, cloneDeep = _.cloneDeep
	;

/*
* type Lens s t a b = ∀f. Functor f => (a -> f b) -> s -> f t
* type Setter s t a b = (a -> Identity b) -> s -> Identity t
* type Getting r s t a b = (a -> Const r b) -> s -> Const r t
* type Getter s a = ∀r. (a -> Const r a) -> s -> Const r s
* type Traversal s t a b = ∀f. Applicative f => (a -> f b) -> s -> f t
* type Fold s a = ∀m. Monoid m => (a -> Const m a) -> s -> Const m s
*/

/* The K Combinator: given x, return a function of one argument that will always return x.
   We will use this to define set in terms of over.
*/
//+ _K :: a -> (_ -> a)
var _K = function(x) { return function(y) { return x; } }


/* Extracts the value from the Id type
*/
//+ runIdentity :: Identity a -> a
var runIdentity = function(i){ return i.x; }

/* Return an array in which the key'th element of xs has been replaced by rep.
*/
//+ _arraySplice :: Int -> Object -> Array -> Array
  , _arraySplice = function(key, rep, xs) {
      var ys = xs.slice(0);
      ys.splice(key, 1, rep);
      return ys;
    }

/* Return an object in which the property indexed by key in obj has been replaced by rep.
*/
//+ _objectSplice :: String -> Object -> Object -> Object
  , _objectSplice = function(key, rep, obj) {
      var new_obj = cloneDeep(obj);
      new_obj[key] = rep;
      return new_obj;
    }

/* Creates a lens for the n'th index in the array
*/
//+ arrayLens :: Int -> (a -> f b) -> [a] -> [b]    || Int -> Lens [a] b a b
  , arrayLens = curry(function(key, f, xs) {
			return map(function(rep) { return _arraySplice(key, rep, xs); }, f(xs[key]));
  	})

/* Creates a lens for a specified key in an object
*/
//+ objectLens :: String -> (a -> b) -> {String: a} -> Lens
  , objectLens = curry(function(key, f, xs) {
			return map(function(rep) { return _objectSplice(key, rep, xs); }, f(xs[key]));
  	})

/* Return an object (suppose it's called obj) in which each property obj.key
/* where "key" is a string from the passed-in array
*/
//+ makeLenses :: [String] -> {String: Lens}
	, makeLenses = function(keys) {
			return keys.reduce(function(acc, key) {
				acc[key] = objectLens(key);
				return acc;
			}, { num : arrayLens });
		}

//+ set :: Setter s t a b -> b -> s -> t
	, set = curry(function(lens, val, x) {
			return over(lens, _K(val), x);
		})

//+ view :: Getting a s t a b -> s -> a
	, view = curry(function(lens, x) {
			return compose(getConst, lens(Const))(x);
		})

//+ over :: Setter s t a b -> (a -> b) -> s -> t
	, over = curry(function(lens, f, x) {
			return compose(runIdentity, lens(compose(Identity,f)))(x);
		})

/*
 * map, but as a lens. Squinting at the setter you can see the parts to construct map's signature
 * over(mapped) == map :: Functor f => (a -> b) -> f a -> f b
 *
 * This can compose with other lenses so, for example, you can do something like this:
 * 
 * var L = makeLenses(['name'])
 * var user = {name: Some("bob")}
 * var mapped_name = compose(L.name, mapped) // remember lenses compose left to right
 * over(L.name, toUpperCase, user) // {name: Some("BOB")}
 */
//+ mapped :: Functor f => Setter (f a) (f b) a b
	, mapped = curry(function(f, x) {
		  return Identity(map(compose(runIdentity, f), x));
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
