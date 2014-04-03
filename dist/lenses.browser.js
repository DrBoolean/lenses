(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./src/lenses');
},{"./src/lenses":31}],2:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = require('lodash._createwrapper');

/**
 * Creates a function which accepts one or more arguments of `func` that when
 * invoked either executes `func` returning its result, if all `func` arguments
 * have been provided, or returns a function that accepts one or more of the
 * remaining `func` arguments, and so on. The arity of `func` can be specified
 * if `func.length` is not sufficient.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var curried = _.curry(function(a, b, c) {
 *   console.log(a + b + c);
 * });
 *
 * curried(1)(2)(3);
 * // => 6
 *
 * curried(1, 2)(3);
 * // => 6
 *
 * curried(1, 2, 3);
 * // => 6
 */
function curry(func, arity) {
  arity = typeof arity == 'number' ? arity : (+arity || func.length);
  return createWrapper(func, 4, null, null, null, arity);
}

module.exports = curry;

},{"lodash._createwrapper":3}],3:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseBind = require('lodash._basebind'),
    baseCreateWrapper = require('lodash._basecreatewrapper'),
    isFunction = require('lodash.isfunction'),
    slice = require('lodash._slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push,
    unshift = arrayRef.unshift;

/**
 * Creates a function that, when called, either curries or invokes `func`
 * with an optional `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of method flags to compose.
 *  The bitmask may be composed of the following flags:
 *  1 - `_.bind`
 *  2 - `_.bindKey`
 *  4 - `_.curry`
 *  8 - `_.curry` (bound)
 *  16 - `_.partial`
 *  32 - `_.partialRight`
 * @param {Array} [partialArgs] An array of arguments to prepend to those
 *  provided to the new function.
 * @param {Array} [partialRightArgs] An array of arguments to append to those
 *  provided to the new function.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new function.
 */
function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      isPartial = bitmask & 16,
      isPartialRight = bitmask & 32;

  if (!isBindKey && !isFunction(func)) {
    throw new TypeError;
  }
  if (isPartial && !partialArgs.length) {
    bitmask &= ~16;
    isPartial = partialArgs = false;
  }
  if (isPartialRight && !partialRightArgs.length) {
    bitmask &= ~32;
    isPartialRight = partialRightArgs = false;
  }
  var bindData = func && func.__bindData__;
  if (bindData && bindData !== true) {
    // clone `bindData`
    bindData = slice(bindData);
    if (bindData[2]) {
      bindData[2] = slice(bindData[2]);
    }
    if (bindData[3]) {
      bindData[3] = slice(bindData[3]);
    }
    // set `thisBinding` is not previously bound
    if (isBind && !(bindData[1] & 1)) {
      bindData[4] = thisArg;
    }
    // set if previously bound but not currently (subsequent curried functions)
    if (!isBind && bindData[1] & 1) {
      bitmask |= 8;
    }
    // set curried arity if not yet set
    if (isCurry && !(bindData[1] & 4)) {
      bindData[5] = arity;
    }
    // append partial left arguments
    if (isPartial) {
      push.apply(bindData[2] || (bindData[2] = []), partialArgs);
    }
    // append partial right arguments
    if (isPartialRight) {
      unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
    }
    // merge flags
    bindData[1] |= bitmask;
    return createWrapper.apply(null, bindData);
  }
  // fast path for `_.bind`
  var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
  return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
}

module.exports = createWrapper;

},{"lodash._basebind":4,"lodash._basecreatewrapper":13,"lodash._slice":22,"lodash.isfunction":23}],4:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = require('lodash._basecreate'),
    isObject = require('lodash.isobject'),
    setBindData = require('lodash._setbinddata'),
    slice = require('lodash._slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `_.bind` that creates the bound function and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new bound function.
 */
function baseBind(bindData) {
  var func = bindData[0],
      partialArgs = bindData[2],
      thisArg = bindData[4];

  function bound() {
    // `Function#bind` spec
    // http://es5.github.io/#x15.3.4.5
    if (partialArgs) {
      // avoid `arguments` object deoptimizations by using `slice` instead
      // of `Array.prototype.slice.call` and not assigning `arguments` to a
      // variable as a ternary expression
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    // mimic the constructor's `return` behavior
    // http://es5.github.io/#x13.2.2
    if (this instanceof bound) {
      // ensure `new bound` is an instance of `func`
      var thisBinding = baseCreate(func.prototype),
          result = func.apply(thisBinding, args || arguments);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisArg, args || arguments);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseBind;

},{"lodash._basecreate":5,"lodash._setbinddata":8,"lodash._slice":22,"lodash.isobject":11}],5:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('lodash._isnative'),
    isObject = require('lodash.isobject'),
    noop = require('lodash.noop');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(prototype, properties) {
  return isObject(prototype) ? nativeCreate(prototype) : {};
}
// fallback for browsers without `Object.create`
if (!nativeCreate) {
  baseCreate = (function() {
    function Object() {}
    return function(prototype) {
      if (isObject(prototype)) {
        Object.prototype = prototype;
        var result = new Object;
        Object.prototype = null;
      }
      return result || global.Object();
    };
  }());
}

module.exports = baseCreate;

},{"lodash._isnative":6,"lodash.isobject":11,"lodash.noop":7}],6:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;

},{}],7:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A no-operation function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // no operation performed
}

module.exports = noop;

},{}],8:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('lodash._isnative'),
    noop = require('lodash.noop');

/** Used as the property descriptor for `__bindData__` */
var descriptor = {
  'configurable': false,
  'enumerable': false,
  'value': null,
  'writable': false
};

/** Used to set meta data on functions */
var defineProperty = (function() {
  // IE 8 only accepts DOM elements
  try {
    var o = {},
        func = isNative(func = Object.defineProperty) && func,
        result = func(o, o, o) && func;
  } catch(e) { }
  return result;
}());

/**
 * Sets `this` binding data on a given function.
 *
 * @private
 * @param {Function} func The function to set data on.
 * @param {Array} value The data array to set.
 */
var setBindData = !defineProperty ? noop : function(func, value) {
  descriptor.value = value;
  defineProperty(func, '__bindData__', descriptor);
};

module.exports = setBindData;

},{"lodash._isnative":9,"lodash.noop":10}],9:[function(require,module,exports){
module.exports=require(6)
},{}],10:[function(require,module,exports){
module.exports=require(7)
},{}],11:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('lodash._objecttypes');

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;

},{"lodash._objecttypes":12}],12:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;

},{}],13:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = require('lodash._basecreate'),
    isObject = require('lodash.isobject'),
    setBindData = require('lodash._setbinddata'),
    slice = require('lodash._slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `createWrapper` that creates the wrapper and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new function.
 */
function baseCreateWrapper(bindData) {
  var func = bindData[0],
      bitmask = bindData[1],
      partialArgs = bindData[2],
      partialRightArgs = bindData[3],
      thisArg = bindData[4],
      arity = bindData[5];

  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      key = func;

  function bound() {
    var thisBinding = isBind ? thisArg : this;
    if (partialArgs) {
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    if (partialRightArgs || isCurry) {
      args || (args = slice(arguments));
      if (partialRightArgs) {
        push.apply(args, partialRightArgs);
      }
      if (isCurry && args.length < arity) {
        bitmask |= 16 & ~32;
        return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
      }
    }
    args || (args = arguments);
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (this instanceof bound) {
      thisBinding = baseCreate(func.prototype);
      var result = func.apply(thisBinding, args);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisBinding, args);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseCreateWrapper;

},{"lodash._basecreate":14,"lodash._setbinddata":17,"lodash._slice":22,"lodash.isobject":20}],14:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"lodash._isnative":15,"lodash.isobject":20,"lodash.noop":16}],15:[function(require,module,exports){
module.exports=require(6)
},{}],16:[function(require,module,exports){
module.exports=require(7)
},{}],17:[function(require,module,exports){
module.exports=require(8)
},{"lodash._isnative":18,"lodash.noop":19}],18:[function(require,module,exports){
module.exports=require(6)
},{}],19:[function(require,module,exports){
module.exports=require(7)
},{}],20:[function(require,module,exports){
module.exports=require(11)
},{"lodash._objecttypes":21}],21:[function(require,module,exports){
module.exports=require(12)
},{}],22:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Slices the `collection` from the `start` index up to, but not including,
 * the `end` index.
 *
 * Note: This function is used instead of `Array#slice` to support node lists
 * in IE < 9 and to ensure dense arrays are returned.
 *
 * @private
 * @param {Array|Object|string} collection The collection to slice.
 * @param {number} start The start index.
 * @param {number} end The end index.
 * @returns {Array} Returns the new array.
 */
function slice(array, start, end) {
  start || (start = 0);
  if (typeof end == 'undefined') {
    end = array ? array.length : 0;
  }
  var index = -1,
      length = end - start || 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = array[start + index];
  }
  return result;
}

module.exports = slice;

},{}],23:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;

},{}],24:[function(require,module,exports){
var curry = require('lodash.curry');
var _flatten = function(xs) {
  return xs.reduce(function(a,b){return a.concat(b);}, []);
};

var _fmap = function(f) {
  var xs = this;
  return xs.map(function(x) { return f(x); }); //avoid index
};

Object.defineProperty(Array.prototype, 'fmap',{
    value: _fmap,
    writable: true,
    configurable: true,
    enumerable: false
});

var _empty = function() { return []; };

Object.defineProperty(Array.prototype, 'empty',{
    value: _empty,
    writable: true,
    configurable: true,
    enumerable: false
});

var _chain = function(f) { return _flatten(this.fmap(f)); };

Object.defineProperty(Array.prototype, 'chain',{
    value: _chain,
    writable: true,
    configurable: true,
    enumerable: false
});

var _of = function(x) { return [x]; };

Object.defineProperty(Array.prototype, 'of',{
    value: _of,
    writable: true,
    configurable: true,
    enumerable: false
});

var _ap = function(a2) {
  var a1 = this;
  return _flatten(a1.map(function(f){
    return a2.map(function(a){ return f(a); })
  }));
};

Object.defineProperty(Array.prototype, 'ap',{
    value: _ap,
    writable: true,
    configurable: true,
    enumerable: false
});

var _traverse = function(f) {
  var xs = this;
  var cons_f = function(ys, x){
    var z = f(x).map(curry(function(x,y){ return y.concat(x); }));
    ys = ys || z.of([]);
    return z.ap(ys);
  }
  return xs.reduce(cons_f, null);
};

Object.defineProperty(Array.prototype, 'traverse',{
    value: _traverse,
    writable: true,
    configurable: true,
    enumerable: false
});

var _foldl = function(f, acc) {
  return this.reduce(f, acc);
}

Object.defineProperty(Array.prototype, 'foldl',{
    value: _foldl,
    writable: true,
    configurable: true,
    enumerable: false
});


},{"lodash.curry":2}],25:[function(require,module,exports){
var Constructor = require('../util').Constructor;

var Const = Constructor(function(val) {
	this.val = val;
});

var getConst = function(c) { return c.val; };

Const.prototype.map = function(f) {
	return Const(this.val);
};

// is const a monoid?

// only if x is a monoid
Const.prototype.of = function(x) {
	return Const(empty(x));
};

Const.prototype.ap = function(c2) {
	return Const(mappend(this.val, c2.val));
};

// const is not a monad

module.exports = {Const: Const, getConst: getConst}

},{"../util":30}],26:[function(require,module,exports){
var _K = function(x) { return function(y) { return x; } };

var _fmap = function(g) {
  var f = this;
  return function(x) { return g(f(x)) };
};

Object.defineProperty(Function.prototype, 'fmap',{
    value: _fmap,
    writable: true,
    configurable: true,
    enumerable: false
});

var _concat = function(g) {
  var f = this;
  return function() {
    return f.apply(this, arguments).concat(g.apply(this, arguments))
  }
};

Object.defineProperty(Function.prototype, 'concat',{
    value: _concat,
    writable: true,
    configurable: true,
    enumerable: false
});

var _empty = function() {
  return _K({ concat: function(g) { return g.empty().concat(g); } });
};

Object.defineProperty(Function.prototype, 'empty',{
    value: _empty,
    writable: true,
    configurable: true,
    enumerable: false
});

var _chain = function(g) {
  var f = this;
  return function(x) {
    return g(f(x), x);
  };
};

Object.defineProperty(Function.prototype, 'chain',{
    value: _chain,
    writable: true,
    configurable: true,
    enumerable: false
});

var _of = _K;

Object.defineProperty(Function.prototype, 'of',{
    value: _of,
    writable: true,
    configurable: true,
    enumerable: false
});

var _ap = function(g) {
  var f = this;
  return function(x) {
    return f(x)(g(x));
  }
};

Object.defineProperty(Function.prototype, 'ap',{
    value: _ap,
    writable: true,
    configurable: true,
    enumerable: false
});

},{}],27:[function(require,module,exports){
var Constructor = require('../util').Constructor;

var Id = Constructor(function(a) {
	this.value = a;
});

Id.prototype.concat = function(b) {
	return new Id(concat(this.value, b.value));
};

var runIdentity = function(i) { return i.value; };

Id.prototype.empty = function() {
	return new Id(empty(this.value));
};

Id.prototype.map = function(f) {
	return new Id(f(this.value));
};

Id.prototype.ap = function(b) {
	return new Id(this.value(b.value));
};

Id.prototype.chain = function(f) {
	return f(this.value);
};

Id.prototype.of = function(a) {
	return new Id(a);
};

module.exports = {Identity: Id, runIdentity: runIdentity};

},{"../util":30}],28:[function(require,module,exports){
var _empty = function() { return ""; };

Object.defineProperty(String.prototype, 'empty',{
    value: _empty,
    writable: true,
    configurable: true,
    enumerable: false
});

},{}],29:[function(require,module,exports){
var curry = require('lodash.curry');

var BUILT_INS = { 'array': require('./instances/array')
                , 'function': require('./instances/function')
                , 'string': require('./instances/string')
                }

var _groupsOf = curry(function(n, xs) {
  if(!xs.length) return [];
  return [xs.slice(0, n)].concat(_groupsOf(n, xs.slice(n, xs.length)));
});

var _compose = curry(function(f,g,x) { return f(g(x)) });

var I = function(x){ return x; }

// f . g . h == compose(f, g, h)
var toAssociativeCommaInfix = function(fn) {
  return function() {
    var fns = [].slice.call(arguments)
    return function() {
      return _groupsOf(2, fns).reverse().map(function(g) {      
        return (g.length > 1) ? fn.apply(this,g) : g[0];
      }).reduce(function(x, f) {
        return [f.apply(f,x)];
      }, arguments)[0];
    };    
  };
};

var compose = toAssociativeCommaInfix(_compose);


var Pointy = {};

var id = function(x) { return x; }

var fmap = curry(function(f, u) {
  return (u.fmap && u.fmap(f)) || u.map(f);
});

var of = curry(function(f, a) {
  return a.of(f);
});

var ap = curry(function(a1, a2) {
  return a1.ap(a2);
});

var liftA2 = curry(function(f, x, y) {
  return fmap(f,x).ap(y);
});

var liftA3 = curry(function(f, x, y, z) {
  return fmap(f, x).ap(y).ap(z);
});

var chain = curry(function(mv, f) {
  return mv.chain(f);
});

var mjoin = function(mmv) {
	return chain(mmv, id);
};

var concat = curry(function(x, y) {
  return x.concat(y);
});

var empty = function(x) {
  return x.empty();
};

var mappend = function(x,y) {
  console.log('x', x, 'y', y);
  return concat(x,y)
};

var mconcat = function(xs) {
	if(!xs[0]) return xs;
  var e = empty(xs[0]);
  return xs.reduce(mappend, e);
};

var sequenceA = curry(function(fctr) {
  return fctr.traverse(id);
});

var traverse = curry(function(f, fctr) {
  return compose(sequenceA, fmap(f))(fctr);
});

var foldMap = curry(function(f, fldable) {
  return fldable.foldl(function(acc, x) {
    var r = f(x)
    acc = acc || r.empty();
    return acc.concat(r);
  })
});

var fold = foldMap(I)

var toList = function(x) {
  return x.foldl(function(acc, y) {
    return [y].concat(acc);
  }, []);
};

var expose = function(env) {
  var f;
  for (f in Pointy) {
    if (f !== 'expose' && Pointy.hasOwnProperty(f)) {
      env[f] = Pointy[f];
    }
  }
}

Pointy.id = id;
Pointy.compose = compose;
Pointy.fmap = fmap;
Pointy.of = of;
Pointy.ap = ap;
Pointy.liftA2 = liftA2;
Pointy.liftA3 = liftA3;
Pointy.chain = chain;
Pointy.mbind = chain;
Pointy.mjoin = mjoin;
Pointy.empty = empty;
Pointy.mempty = empty;
Pointy.concat = concat;
Pointy.mappend = mappend;
Pointy.mconcat = mconcat;
Pointy.sequenceA = sequenceA;
Pointy.traverse = traverse;
Pointy.foldMap = foldMap;
Pointy.fold = fold;
Pointy.toList = toList;
Pointy.expose = expose;


module.exports = Pointy;

if(typeof window == "object") {
  PointFree = Pointy;
}

},{"./instances/array":24,"./instances/function":26,"./instances/string":28,"lodash.curry":2}],30:[function(require,module,exports){
"use strict";

var Constructor = function(f) {
  var x = function(){
    if(!(this instanceof x)){
      var inst = new x();
      f.apply(inst, arguments);
      return inst;
    }
    f.apply(this, arguments);
  };

  return x;
};
exports.Constructor = Constructor;
var makeType = function(f) {
  f = f || function(v){ this.val = v; }
  return Constructor(f);
};
exports.makeType = makeType;

var subClass = function(superclass, constructr) {
  var x = makeType();
  x.prototype = new superclass();
  x.prototype.constructor=constructr; 
  return x;
}
exports.subClass = subClass;

var K = function(x){return function(){return x;};};
exports.K = K;var I = function(x){return x;};
exports.I = I;
},{}],31:[function(require,module,exports){
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
      for (var i = 0; i < 10; i++) {
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

},{"lodash.curry":2,"pointfree-fantasy":29,"pointfree-fantasy/instances/const":25,"pointfree-fantasy/instances/identity":27}]},{},[1])