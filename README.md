lenses.js
=========

Functional lenses that compose and stuff


```js
var Lenses = require('./src/lenses').expose(global)
  , assert = require("assert")
  , compose = require('./src/lib/pointfree').compose
  ;

// for demo purposes
var toUpperCase = function(x) { return x.toUpperCase(); };

var user = {name: "Bob", addresses: [{street: '99 Maple', zip: 94004, type: 'home'}, {street: '2302 Powell', zip: 94001, type: 'work'}]}

var L = makeLenses(['name', 'addresses', 'street']);

var secondAddressesStreet = compose(L.addresses, _2, L.street)

over(secondAddressesStreet, toUpperCase, user) // { name: 'Bob', addresses: [ { street: '99 Maple', zip: 94004, type: 'home' }, { street: '2302 POWELL', zip: 94001, type: 'work' } ] }

view(L.name, user) // 'Bob'

set(L.name, 'Kelly', user) // {name: "Kelly", addresses: [{street: '99 Maple', zip: 94004, type: 'home'}, {street: '2302 Powell', zip: 94001, type: 'work'}]}
```
