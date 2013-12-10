# parse.js - Combinatorial Parser Javascript Library #

## About ##
parse.js is a library for creating [combinatorial parsers][CombinatorialParsers] in Javascript. 
It is based on Nate Young's [Parsatron][Parsatron] which in turn is based on
[Parsec][Parsec].

Combinatorial parsers allow complex parsers to be created from a set of simple
building blocks. Compared to other parsing techniques, combinatorial parsers
can be written more quickly and integrate better with the host language.

### Examples
* [parse-ecma][parse-ecma] - Combinatory parsers for lexing and parsing ECMAScript 5.1
* [khepri][khepri] - khepri combinatory lexers and parsers.
* [parse-re][parse-re] - ECMAScript regular expression grammar parser and engine
  using parse.js parser combinators.
* [parse-pn][parse-pn] - Very simple polish notation calculator.
* [parse-ecma-incremental][parse-ecma-incremental] - Demonstrates using unmodified
  parsers to incrementally lex ECMAScript.

# Using parse.js #

### To clone ##
    git clone https://github.com/mattbierner/parse.js parse
    cd parse
    git submodule update --init

## Dependencies
* [Nu][nu] 3.0.X - Small functional, lazy stream library.
* [Seshat][seshat] 0.0.X - Functional memoization utility.

## With AMD ##
Include any AMD style module loader and load parse:

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <script type="application/javascript" src="require.js"></script>
        <script type="application/javascript">
            requirejs.config({
                paths: {
                    'parse': './dist',
                    'nu': './dependencies/nu/dist',
                    'seshat': './dependencies/seshat/lib/seshat'
                }
            });
            require(['parse/parse'], function(parse) {
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
[seshat]: https://github.com/mattbierner/seshat
