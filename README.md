# SQL Filter

[![npm version](https://badge.fury.io/js/sql-filter.svg)](https://badge.fury.io/js/sql-filter)
[![Build Status](https://travis-ci.org/yanickrochon/sql-filter.svg?branch=master)](https://travis-ci.org/yanickrochon/sql-filter)
[![Coverage Status](https://coveralls.io/repos/github/yanickrochon/sql-filter/badge.svg?branch=master)](https://coveralls.io/github/yanickrochon/sql-filter?branch=master)

Create simple to complex SQL filters using glob-like patterns.

## Dislaimer

This module is still in development, and the first major version should be
released soon! While the generated queries should be optimal, more tests are
required against various data types and structures.


## Install

`npm i sql-filter --save`

## Database Adapters

* **PostreSQL**
* **MySQL** *(Not implemented. Contribution welcome!)*
* *more?*

## Usage

```js
const builder = require('sql-filter');

const filterOptions = {
  // build a PostreSQL query (this is the default value)
  adapter: 'postgresql',
  // when no operator is specified, use this operator
  // (this is the default value)
  operator: '='
};

const userSearchFilter = builder('{ username, first_name, last_name }', filterOptions);
const inventorySearchFilter = builder('properties[].{ name(ILIKE,1), value(>=,2) }', filterOptions);

// userSearchFilter.toString()
// -> 'username = @1 OR first_name = @1 OR last_name = @1'
// inventorySearchFilter.toString()
// -> 'properties IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(properties) AS _properties WHERE _properties->>\'name\' ILIKE @1::TEXT OR _properties->>\'value\' >= @2::TEXT)'

let query1 = db.query('SELECT * FROM users WHERE ' + userSearchFilter.apply('John'));
query1.on('row', function (row) {
  console.log('* User', row);
});

let query2 = db.query('SELECT * FROM inventory_vw WHERE ' + inventorySearchFilter.apply('%pvc%', 3))
query2.on('row', function (row) {
  console.log('* Inventory', row);
});
```

**NOTE**: this module does not guarantee that the given fields exists, and only
help generating queries.


## Syntax

### fields

Fields, or column names, are represented as is. For example, generating a filter
to search for a given user :

```js
const userById = builder('id');
const query = 'SELECT * FROM users' +
              ' WHERE ' + userById.apply(123);
```

Naturally, filters may be re-used.

```js
const userById = builder('id');
const query = 'SELECT * FROM users' +
              ' WHERE ' + userById.apply(123) +
                 ' OR ' + userById.apply(456);
```

When aggregating data across tables, using functions to return JSON data types,
or even when a table needs to filter from a JSON column type, searching deep
within these structures may be combersome otherwise.

```js
const issuesByOwner = builder('user.username');
// fetch from a VIEW which aggregates from users
const query = 'SELECT * FROM issues_vw' +
              ' WHERE ' + issuesByOwner.apply('john.smith@email.com');
```

### Arrays

Like for fields, arrays allow looking inside an enumeration. Useful when searching
JSON arrays.

```js
const recipesByIngredient = builder('ingredients[].name');
const query = 'SELECT * FROM recipees' +
              ' WHERE ' + recipesByIngredient.apply('avocado');
```

Arrays can be nested just fine, too!

```js
const recipesByIngregidentsInStep = builder('steps[].ingredients[].name');
const query = 'SELECT * FROM recipees' +
              ' WHERE ' + recipesByIngregidentsInStep.apply('avocado');
```

### Branching

Instead of repeating patterns, why not specify everything into a single one?

```js
// search username OR first_name OR last_name
const userByStringOR = builder('{username,first_name,last_name}');
const queryOR = 'SELECT * FROM users' +
                ' WHERE ' + userByStringOR.apply('Bob');
// search username AND first_name AND last_name
const userByStringAND = builder('{{username,first_name,last_name}}');
const queryAND = 'SELECT * FROM users ' +
                 ' WHERE ' + userByStringAND.apply('Joe');
```

### Field Operator

By default, field operators may be specified as an option argument of the builder
function.

```js
const filter = builder('a', { operator: 'LIKE'});
const query = 'SELECT * FROM tbl WHERE ' + filter.apply('%foo%');
```

Or it may be specified directly in the pattern.

```js
const filter = builder('a(LIKE)');
const query = 'SELECT * FROM tbl WHERE ' + filter.apply('%foo%');
```

### Field Arguments

To supply more than one values in the filter, the value order may be specified
after specifying an operator.

```js
const filter = builder('{{username(LIKE,1),status(=,2)}}');
const query = 'SELECT * FROM users WHERE ' + filter.apply('%john%', true);
```

## BUilder options

### Adapter

*TODO*

### Default Operator

*TODO*

### Field Name wrapper

*TODO*

### Value wrapper

*TODO*


## Adapters

### Custom Operator Management

For complex filters, where built-in operators are simply not enough, it may be
required to register a new one, to evaluate fields in a customized way. For
example :

```js
const adapter = require('sql-filter/adapter/postgresql');

adapter.registerOperatorHandler('custom', function (field, oper, args, argSuffix, options) {
  return 'customFunction(' + options.fieldWrapper(field) + ',' + args.map(options.valueWrapper).join(',') + ') = true';
});
```

**Note**: when an operator follows the pattern `predicate operator predicate`, it
is not necessary to register a new handler as the default handler will correctly
display any such operator.


## Contribution

All contributions welcome! Every PR **must** be accompanied by their associated
unit tests!


## License

The MIT License (MIT)

Copyright (c) 2015 Mind2Soft <yanick.rochon@mind2soft.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
