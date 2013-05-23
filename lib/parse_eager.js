/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse_eager.kep'
 * DO NOT EDIT
*/
define(["parse/parse", "nu/stream"], function(parse, stream) {
    "use strict";
    var compose = function(f, g) {
        return function() {
            return f(g.apply(undefined, arguments));
        }
        ;
    }
    ;
    var toArrayParser = function(toArray) {
        return function(p) {
            return parse.bind(p, toArray);
        }
        ;
    }
    (function(x) {
        return parse.always(stream.toArray(x));
    }
    );
    return ({
        "sequence": compose(toArrayParser, parse.sequence),
        "many": compose(toArrayParser, parse.many),
        "many1": compose(toArrayParser, parse.many1),
        "times": compose(toArrayParser, parse.times),
        "betweenTimes": compose(toArrayParser, parse.betweenTimes),
        "sepBy1": compose(toArrayParser, parse.sepBy1),
        "sepBy": compose(toArrayParser, parse.sepBy)
    });
}
);
