# next-init [![Build Status](https://travis-ci.org/ragingwind/next-init.svg?branch=master)](https://travis-ci.org/ragingwind/next-init)

>

## Install

```
$ npm install next-init
```

## Usage

```js
const nextInit = require('next-init');

nextInit('unicorns');
//=> 'unicorns & rainbows'
```


## API

### nextInit(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## CLI

```
$ npm install --global next-init
```

```
$ next-init --help

  Usage
    next-init [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ next-init
    unicorns & rainbows
    $ next-init ponies
    ponies & rainbows
```


## License

MIT © [Jimmy Moon](https://github.com/ragingwind)
