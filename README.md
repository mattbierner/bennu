# parse.js - Combinatorial Parser Javascript Library #

## About ##
parse.js is a library for creating [combinatorial parsers][CombinatorialParsers] in Javascript. 
It is based on Nate Young's [Parsatron][Parsatron] which in turn is based on
[Parsec][Parsec].

Combinatorial parsers allow complex parsers to be created from a set of simple
building blocks. Compared to other parsing techniques, combinatorial parsers
can be written more quickly and integrate better with the host language.

## Examples ##
* [parse-ecma][parseecma] - Combinatory parsers for lexing and parsing ECMAScript 5.

## To clone ##
    git clone https://github.com/mattbierner/parse.js parse
    cd parse
    git submodule update --init --recursive


# Using parse.js #

## Dependencies
* [Nu][nu] - Small functional, lazy stream library.
* [Seshat][seshat] - Functional memoization utility.

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
                    'parse': './lib',
                    'nu': './dependencies/nu/lib',
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

### lib/parse - 'parse/parse' ###
Core functionality. Defines core parsers and data structures for creating and
running parsers.

### lib/text - 'parse/text' ###
Parsers for working specifically with text.

### lib/lang - 'parse/lang' ###
Combinatory parsers for ordering parsers, like found in a language.

# Code #
parse.js is written in Javascript / Khepri. [Khepri][khepri] is a ECMAScript subset
that, among other things, adds a shorted lambda function syntax. It is also
implemented using parse.js. Besides lambda functions, Khepri files (*.kep) are
pretty much plain old Javascript.

For now, both the .js and .kep versions of source code will be kept in 'lib/',
but only Khepri sources will be developed and Javascript files will be
generated from it.



[CombinatorialParsers]: http://en.wikipedia.org/wiki/Parser_combinator
[Parsatron]: https://github.com/youngnh/parsatron
[Parsec]: http://legacy.cs.uu.nl/daan/parsec.html
[parseecma]: https://github.com/mattbierner/parse-ecma
[khepri]: https://github.com/mattbierner/khepri
[nu]: https://github.com/mattbierner/nu
