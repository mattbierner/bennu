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

## Dependencies ##
parse.js depends on [stream.js][stream] internally and also uses stream.js 
objects in the API.

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
                    'stream': './dependencies/stream/lib/stream'
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

### lib/parse_string - 'parse/parse_string' ###
Parsers for working specifically with strings.

### lib/parse_eager - 'parse/parse_eager' ###
Redefines iterative core parsers to return regular Javascript arrays instead
of streams.


[CombinatorialParsers]: http://en.wikipedia.org/wiki/Parser_combinator
[Parsatron]: https://github.com/youngnh/parsatron
[Parsec]: http://legacy.cs.uu.nl/daan/parsec.html
[parseecma]: https://github.com/mattbierner/parse-ecma
[stream]: https://github.com/mattbierner/stream.js
