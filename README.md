# Bennu - Javascript Parser Combinator Library

## About
Bennu is a library based on [Parsec][Parsec] for creating [combinatory parsers][CombinatorialParsers].

Parser combinators allow complex parsers to be created from a set of simple
building blocks. Compared to other parsing techniques, combinatorial parsers
can be written more quickly and integrate better with the host language.

### Examples
* [parse-ecma][parse-ecma] - Combinatory parsers for lexing and parsing ECMAScript 5.1
* [khepri][khepri] - khepri combinatory lexers and parsers.
* [parse-re][parse-re] - ECMAScript regular expression grammar parser and engine
  using Bennu parser combinators.
* [parse-pn][parse-pn] - Very simple polish notation calculator.
* [parse-ecma-incremental][parse-ecma-incremental] - Demonstrates using unmodified
  parsers to incrementally lex ECMAScript.

# Using Bennu

### To clone ##
    git clone https://github.com/mattbierner/bennu bennu
    cd bennu
    git submodule update --init

### Dependencies
* [Nu][nu] 3.1.x - Small functional, lazy stream library.
* [Seshet][seshet] 0.1.x - Functional memoization utility.


## With Node
Install:

    npm install bennu

Use:

    var parse = require('bennu').parse;
    var text = require('bennu').text;
    
    
    var aOrB = parse.either(
        text.character('a'),
        text.character('b'));
        
    parse.run(aOrB, 'b'); // 'b'

## With AMD ##
Include any AMD style module loader and load Bennu:

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <script type="application/javascript" src="require.js"></script>
        <script type="application/javascript">
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
        </script>
    </body>

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

# Code #
Parse.js is written in Khepri. [Khepri][khepri] is an ECMAScript language
focused on functional programming that compiles to Javascript.
The `dist` directory contains the generated js library while the Khepri sources
are in `lib` directory.


[CombinatorialParsers]: http://en.wikipedia.org/wiki/Parser_combinator
[Parsatron]: https://github.com/youngnh/parsatron
[Parsec]: http://legacy.cs.uu.nl/daan/parsec.html
[parse-ecma]: https://github.com/mattbierner/parse-ecma
[parse-re]: https://github.com/mattbierner/parse-re
[parse-pn]: https://github.com/mattbierner/parse-pn
[parse-ecma-incremental]: https://github.com/mattbierner/parse-ecma-incremental
[khepri]: https://github.com/mattbierner/khepri
[nu]: https://github.com/mattbierner/nu
[seshet]: https://github.com/mattbierner/seshet
