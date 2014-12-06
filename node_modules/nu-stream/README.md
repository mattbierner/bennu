# Nu - Small Lazy Stream Javascript Library #

A small library for working with lazy streams in Javascript.

## Install

### Node
Node generated files live in `dist_node/`

```
$ npm install nu-stream
```

See http://mattbierner.github.io/nu/ for more info and API.

### AMD
AMD generated files live in `dist/`

```
requirejs.config({
    paths: {
        'nu-stream': 'dist'
    }
});

require([
    'nu-stream/stream'],
function(stream) {
    ...
});
```


## Documentation
[Complete documentation][docs]

### Modules
Nu consists of four modules. Only 'stream', the main module, is required.
Other modules can be loaded as needed.

#### nu-stream::stream
Core functionality. Stream creation and basic operations.

#### nu-stream::quantifier
Quantification operations on streams.

#### nu-stream::gen
Generating streams.

#### nu-stream::select
Selecting subsections of streams.



# Code
Nu is written in Khepri. [Khepri][khepri] is an ECMAScript language
that compiles to Javascript. The `dist` directory contains the generated js library
while the Khepri source is in `lib` directory.


[khepri]: https://github.com/mattbierner/khepri
[docs]: https://github.com/mattbierner/nu/wiki/API