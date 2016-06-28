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

## Usage

```js
const builder = require('sql-filter');

const filterOptions = {
  adapter: 'postgresql',
  operator: '=',
  placeholder: '$?'
};

const userSearchFilter = builder('{ username, first_name, last_name }', filterOptions);

filterOptions.operator = 'ILIKE';

const inventorySearchFilter = builder('properties[].{ name, value }', filterOptions);


// userSearchFilter.toString()
// -> 'username = $? OR first_name = $? OR last_name = $?'
// inventorySearchFilter.toString()
// -> 'properties IS NOT NULL AND EXISTS (SELECT * FROM json_array_elements(properties) AS _properties WHERE _properties->>\'name\' ILIKE $?::TEXT OR _properties->>\'value\' ILIKE $?::TEXT)''

let query1 = db.query('SELECT * FROM users WHERE ' + userSearchFilter.apply('John'));
query1.on('row', function (row) {
  console.log('* User', row);
});

let query2 = db.query('SELECT * FROM inventory_vw WHERE ' + inventorySearchFilter('%pvc%'))
query2.on('row', function (row) {
  console.log('* Inventory', row);
});

```

**NOTE**: this module does not guarantee that the given fields exists, and only
help generating queries.

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
