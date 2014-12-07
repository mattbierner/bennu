<div >
    <img alt="Bennu" src="http://bennu-js.com/resources/bennu.svg" width="300px" align="center"/>
</div>

<h1 align="center">Javascript Parser Combinator Library</h1>

## About
Bennu is a Javascript parser combinator library based on [Parsec][Parsec].

Parser combinators allow complex parsers to be created from a set of simple
building blocks. Compared to other parsing techniques, combinatorial parsers
can be written more quickly and integrate better with the host language.

```javascript
// Very simple Brainfuck Bennuu parser in Khepri

var op := oneOf '><+-.,';

var other := many <| noneOf "><+-.,[]"; // Brainfuck ignores any other characters

var block := \body ->
    between(character '[', character ']',
        body);

var program := rec\self -> // allows referencing `program` in parse definition.
    next(
        other,                   // consume non BF chars at start,
        eager <| sepEndBy(other, // and between instructions and ending program
            either(
                op,
                block self)));
```

Bennu provides many [Parsec][parsec] parser combinators. Bennu also provides
functionality like memoization and running unmodified parser combinations incrementally..


### Links
* [Documentation][documentation]

### Examples

* [parse-pn][parse-pn] - Very simple polish notation calculator.
* [parse-ecma][parse-ecma] - Combinatory parsers for lexing and parsing ECMAScript 5.1
* [khepri][khepri] - Khepri language lexers and parsers.
* [parse-re][parse-re] - ECMAScript regular expression grammar parser and engine
  using Bennu parser combinators.
* [parse-ecma-incremental][parse-ecma-incremental] - Demonstrates using unmodified
  parsers to incrementally lex ECMAScript.


# Using Bennu

### To clone ##
    git clone https://github.com/mattbierner/bennu bennu
    cd bennu
    git submodule update --init

## With Node

    $ npm install bennu

Use:

    var parse = require('bennu').parse;
    var text = require('bennu').text;
    
    
    var aOrB = parse.either(
        text.character('a'),
        text.character('b'));
    
    parse.run(aOrB, 'b'); // 'b'

## With AMD ##
Include any AMD style module loader and load Bennu:

    requirejs.config({
        paths: {
            'bennu': './dist',
            'nu-stream': './dependencies/nu/dist',
            'seshet': './dependencies/seshet/lib/seshet'
        }
    });
    require(['bennu/parse'], function(parse) {
        ...
    });


## Modules ##
All files live in the top level 'parse' module.

### lib/parse - 'parse/parse'
Core functionality. Defines core parsers and data structures for creating and
running parsers.

### lib/text - 'parse/text'
Parsers for working specifically with text.

### lib/lang - 'parse/lang'
Combinatory parsers for ordering parsers, like found in a language.

### lib/incremental - 'parse/incremental'
Running parsers incrementally.


## Fantasy Land
<a href="https://github.com/fantasyland/fantasy-land">
    <img src="https://raw.github.com/fantasyland/fantasy-land/master/logo.png" align="right" width="82px" height="82px" alt="Fantasy Land logo" />
</a>

Bennu parsers implement [Fantasy Land's][fs] monad, applicative, monoid and chain interfaces.

This can be used to directly `.`  chain parsers instead of nested function calls:

```
var p = digit
     .chain(\x ->
          always(parseInt(x)))
    .chain(\x->
        always(x + 5))
    .chain(\x->
        always(x / 2));

run(p, '3'); // 4
```


# Code #
Parse.js is written in Khepri. [Khepri][khepri] is an ECMAScript language
focused on functional programming that compiles to Javascript.
The `dist` directory contains the generated js library while the Khepri sources
are in `lib` directory.

[documentation]: https://github.com/mattbierner/bennu/wiki
[CombinatorialParsers]: http://en.wikipedia.org/wiki/Parser_combinator
[Parsatron]: https://github.com/youngnh/parsatron
[Parsec]: http://legacy.cs.uu.nl/daan/parsec.html
[parse-ecma]: https://github.com/mattbierner/parse-ecma
[parse-re]: https://github.com/mattbierner/parse-re
[parse-pn]: https://github.com/mattbierner/parse-pn
[parse-ecma-incremental]: https://github.com/mattbierner/parse-ecma-incremental
[khepri]: https://github.com/mattbierner/khepri
[seshet]: https://github.com/mattbierner/seshet
