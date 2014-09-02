lenses.js
=========

Functional lenses that compose and stuff


```js
require('./src/lenses').expose(global);
var compose = require('pointfree-fantasy').compose;

// setup an easy test fn
var toUpperCase = function(x) { return x.toUpperCase(); };

// here's the data structure
var user = {name: "Bob", addresses: [{street: '99 Maple', zip: 94004, type: 'home'}, {street: '2302 Powell', zip: 94001, type: 'work'}]}

// make some lenses
var L = makeLenses(['name', 'addresses', 'street']);

// compose the lenses
var secondAddressesStreet = compose(L.addresses, L._num(2), L.street)

// mess with the user
over(secondAddressesStreet, toUpperCase, user) // { name: 'Bob', addresses: [ { street: '99 Maple', zip: 94004, type: 'home' }, { street: '2302 POWELL', zip: 94001, type: 'work' } ] }

view(L.name, user) // 'Bob'

set(L.name, 'Kelly', user) // {name: "Kelly", addresses: [{street: '99 Maple', zip: 94004, type: 'home'}, {street: '2302 Powell', zip: 94001, type: 'work'}]}
```


ROADMAP:

- add traverses and folds
- more combinators
- prisms
- this list is getting long...

