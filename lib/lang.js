/*
 * THIS FILE IS AUTO GENERATED from 'lib/lang.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "nu/stream", "parse/parse"], (function(require, exports, __o, parse) {
    "use strict";
    var times, betweenTimes, then, between, sepBy1, sepBy, sepEndBy1, sepEndBy, endBy1, endBy, chainl1, chainl, chainr1, chainr;
    var __o = __o,
        NIL = __o["end"],
        parse = parse,
        always = parse["always"],
        append = parse["append"],
        bind = parse["bind"],
        cons = parse["cons"],
        either = parse["either"],
        many = parse["many"],
        many1 = parse["many1"],
        next = parse["next"],
        optional = parse["optional"],
        ParserError = parse["ParserError"],
        rec = parse["rec"]; {
            var _end = always(NIL);
            var _optionalValueParser = optional.bind(null, NIL);
            (times = (function(n, p) {
                return ((n <= 0) ? _end : cons(p, times((n - 1), p)));
            }));
            (betweenTimes = (function() {
                {
                    var maxParser = (function(max, p) {
                        return ((max <= 0) ? _end : _optionalValueParser(cons(p, maxParser((max - 1), p))));
                    }); {
                        return (function(min, max, p) {
                            if ((max < min)) throw new(ParserError)("between max < min");

                            return append(times(min, p), maxParser((max - min), p));
                        });
                    }
                }
            })());
            (then = (function(p, q) {
                return bind(p, (function(x) {
                    return next(q, always(x));
                }));
            }));
            (between = (function(open, close, p) {
                return next(open, then(p, close));
            }));
            (sepBy1 = (function(sep, p) {
                return cons(p, many(next(sep, p)));
            }));
            (sepBy = (function(sep, p) {
                return optional(NIL, sepBy1(sep, p));
            }));
            (sepEndBy1 = (function(sep, p) {
                return rec((function(self) {
                    return cons(p, _optionalValueParser(next(sep, _optionalValueParser(self))));
                }));
            }));
            (sepEndBy = (function(sep, p) {
                return either(sepEndBy1(sep, p), next(optional(null, sep), always(NIL)));
            }));
            (endBy1 = (function(sep, p) {
                return many1(then(p, sep));
            }));
            (endBy = (function(sep, p) {
                return many(then(p, sep));
            }));
            (chainl1 = (function(op, p) {
                return bind(p, rec((function(self) {
                    return (function(x) {
                        return optional(x, bind(op, (function(f) {
                            return bind(p, (function(y) {
                                return self(f(x, y));
                            }));
                        })));
                    });
                })));
            }));
            (chainl = (function(op, x, p) {
                return optional(x, chainl1(op, p));
            }));
            (chainr1 = (function(op, p) {
                return rec((function(self) {
                    return bind(p, (function(x) {
                        return optional(x, bind(op, (function(f) {
                            return bind(self, (function(y) {
                                return always(f(x, y));
                            }));
                        })));
                    }));
                }));
            }));
            (chainr = (function(op, x, p) {
                return optional(x, chainr1(op, p));
            }));
    }
    (exports.times = times);
    (exports.betweenTimes = betweenTimes);
    (exports.then = then);
    (exports.between = between);
    (exports.sepBy1 = sepBy1);
    (exports.sepBy = sepBy);
    (exports.sepEndBy1 = sepEndBy1);
    (exports.sepEndBy = sepEndBy);
    (exports.endBy1 = endBy1);
    (exports.endBy = endBy);
    (exports.chainl1 = chainl1);
    (exports.chainl = chainl);
    (exports.chainr1 = chainr1);
    (exports.chainr = chainr);
}))