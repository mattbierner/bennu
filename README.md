# parse.js - Combinatorial Parser Javascript Library #

## About ##
parse.js is a library for creating [combinatorial parsers][CombinatorialParsers] in Javascript. 
It is based on Nate Young's [Parsatron][Parsatron] which in turn is based on
[Parsec][Parsec]. 

Combinatorial parsers allow complex parsers to be created from a set of simple
building blocks. Compared to other parsing techniques, combinatorial parsers
can be written more quickly and integrate better with the host language.

parse.js parsers are regular Javascript functions. A set of common parsers is
include. Here is a polish notation parser:

    // Note: this example is simplified to only support single digit positive
    //     integers.
    var op = parse.choice(
        parse.char('+'),
        parse.char('-'),
        parse.char('*'),
        parse.char('/')
    );
    var num = parse.digit();
    var expr = parse.next(op, parse.times(2, parse.choice(num, expr)));
    
    var pn = parse.next(parse.many(expr), parse.eof());
    
    // Tokenize the input
    var tok = parse.either(
        parse.next(parse.space(), tok),
        parse.either(op, num)
    );
    
    parse.run(pn, parse.run(parse.many1(tok), "+ 3 + 4 8"));


# Using parse.js #
parse.js can be used either as an AMD style module or in the global scope.

## With AMD ##
Include any AMD style module loader and load parse:

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <script type="application/javascript" src="require.js"></script>
        <script type="application/javascript">
            require(['parse'], function(parse) {
                ...
            });
        </script>
    </body>

## Global ##
Include parse.js file directly and use 'parse' global.

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <script type="application/javascript" src="parse.js"></script>
        <script type="application/javascript">
            ...
        </script>
    </body>


[CombinatorialParsers]: http://en.wikipedia.org/wiki/Parser_combinator
[Parsatron]: https://github.com/youngnh/parsatron
[Parsec]: http://legacy.cs.uu.nl/daan/parsec.html