/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse_lang.kep'
 * DO NOT EDIT
*/
;
define(["nu/stream", "parse/parse"], function(stream, parse) {
    "use strict";
    var _end = parse.always(stream.end);
    var _optionalValueParser = parse.optional.bind(undefined, stream.end);
    var times = function(n, p) {
        return ((n <= 0) ? _end : parse.cons(p, times((n - 1), p)));
    }
    ;
    var betweenTimes = function(maxParser) {
        return function(min, max, p) {
            if ((max < min)){
                throw new parse.ParserError("between max < min");
            }
            
            return parse.append(times(min, p), maxParser((max - min), p));
        }
        ;
    }
    (function maxParser(max, p) {
        return ((max <= 0) ? _end : _optionalValueParser(parse.cons(p, maxParser((max - 1), p))));
    }
    );
    var then = function(p, q) {
        return parse.bind(p, function(x) {
            return parse.next(q, parse.always(x));
        }
        );
    }
    ;
    var between = function(open, close, p) {
        return parse.next(open, then(p, close));
    }
    ;
    var sepBy1 = function(sep, p) {
        return parse.cons(p, parse.many(parse.next(sep, p)));
    }
    ;
    var sepBy = function(sep, p) {
        return parse.optional(stream.end, sepBy1(sep, p));
    }
    ;
    var sepEndBy1 = function(sep, p) {
        return parse.rec(function(self) {
            return parse.cons(p, _optionalValueParser(parse.next(sep, _optionalValueParser(self))));
        }
        );
    }
    ;
    var sepEndBy = function(sep, p) {
        return parse.either(sepEndBy1(sep, p), parse.next(parse.optional(null, sep), parse.always(stream.end)));
    }
    ;
    var endBy1 = function(sep, p) {
        return parse.many1(then(p, sep));
    }
    ;
    var endBy = function(sep, p) {
        return parse.many(then(p, sep));
    }
    ;
    var chainl1 = function(op, p) {
        return parse.bind(p, parse.rec(function(self) {
            return function(x) {
                return parse.optional(x, parse.bind(op, function(f) {
                    return parse.bind(p, function(y) {
                        return self(f(x, y));
                    }
                    );
                }
                ));
            }
            ;
        }
        ));
    }
    ;
    var chainl = function(op, x, p) {
        return parse.optional(x, chainl1(op, p));
    }
    ;
    var chainr1 = function(op, p) {
        return parse.rec(function(self) {
            return parse.bind(p, function(x) {
                return parse.optional(x, parse.bind(op, function(f) {
                    return parse.bind(self, function(y) {
                        return parse.always(f(x, y));
                    }
                    );
                }
                ));
            }
            );
        }
        );
    }
    ;
    var chainr = function(op, x, p) {
        return parse.optional(x, chainr1(op, p));
    }
    ;
    return ({
        "times": times,
        "betweenTimes": betweenTimes,
        "then": then,
        "between": between,
        "sepBy1": sepBy1,
        "sepBy": sepBy,
        "sepEndBy1": sepEndBy1,
        "sepEndBy": sepEndBy,
        "endBy1": endBy1,
        "endBy": endBy,
        "chainl1": chainl1,
        "chainl": chainl,
        "chainr1": chainr1,
        "chainr": chainr
    });
}
);
