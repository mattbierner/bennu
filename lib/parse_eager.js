/**
 * @fileOverview Eager version of iterative stream based parsers.
 */
(function(define){

define(['parse/parse', 'stream'], function(parse, stream) {
"use strict";

/* Helpers
 ******************************************************************************/
var compose = function(f, g) {
    return function(/*...*/) {
        return f(g.apply(undefined, arguments));
    };
};


var toArrayParser = function(p) {
    return parse.bind(p, function(v) {
        return parse.always(stream.toArray(v));
    });
};

/**
 * Same as bind but calls apply on 'f' using results of 'p'. 
 */
var bindaParser = function(p, f) {
    return bindParser(p, function(s) {
        return f.apply(undefined, s);
    });
};

/* Export
 ******************************************************************************/
return {
    'bindaParser': bindaParser,
    
    'sequence': compose(toArrayParser, parse.sequence),
    'many': compose(toArrayParser, parse.many),
    'many1': compose(toArrayParser, parse.many1),
    'times': compose(toArrayParser, parse.times),
    'betweenTimes': compose(toArrayParser, parse.betweenTimes),
    
    'sepBy1': compose(toArrayParser, parse.sepBy1),
    'sepBy': compose(toArrayParser, parse.sepBy)
};

});

}(
    typeof define !== 'undefined' ? define : function(factory) { parse = factory(); }
));