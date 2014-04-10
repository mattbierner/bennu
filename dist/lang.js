/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lang.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "nu-stream/stream", "nu-stream/gen", "./parse"], (function(require, exports, __o, __o0,
    __o1) {
    "use strict";
    var NIL = __o["NIL"],
        repeat = __o0["repeat"],
        append = __o1["append"],
        always = __o1["always"],
        bind = __o1["bind"],
        cons = __o1["cons"],
        either = __o1["either"],
        enumerations = __o1["enumerations"],
        late = __o1["late"],
        many = __o1["many"],
        many1 = __o1["many1"],
        next = __o1["next"],
        optional = __o1["optional"],
        ParserError = __o1["ParserError"],
        rec = __o1["rec"],
        times, atMostTimes, betweenTimes, then, between, sepBy1, sepBy, sepEndBy1, sepEndBy, endBy1, endBy,
            chainl1, chainl, chainr1, chainr, _end = always(NIL),
        _optionalValueParser = optional.bind(null, NIL),
        x = repeat,
        y = enumerations;
    (times = (function() {
        return y(x.apply(null, arguments));
    }));
    (atMostTimes = (function(n, p) {
        return ((n <= 0) ? _end : _optionalValueParser(cons(p, late((function() {
            return atMostTimes((n - 1), p);
        })))));
    }));
    (betweenTimes = (function(min, max, p) {
        if ((max < min)) throw new(ParserError)("between max < min");
        return append(times(min, p), atMostTimes((max - min), p));
    }));
    (then = (function(p, q) {
        return bind(p, (function(x0) {
            return next(q, always(x0));
        }));
    }));
    (between = (function(open, close, p) {
        return next(open, then(p, close));
    }));
    (sepBy1 = (function(sep, p) {
        return cons(p, many(next(sep, p)));
    }));
    var x0 = sepBy1,
        y0 = _optionalValueParser;
    (sepBy = (function() {
        return y0(x0.apply(null, arguments));
    }));
    (sepEndBy1 = (function(sep, p) {
        return rec((function(self) {
            return cons(p, _optionalValueParser(next(sep, _optionalValueParser(self))));
        }));
    }));
    (sepEndBy = (function(sep, p) {
        return either(sepEndBy1(sep, p), next(optional(null, sep), _end));
    }));
    (endBy1 = (function(sep, p) {
        return many1(then(p, sep));
    }));
    (endBy = (function(sep, p) {
        return many(then(p, sep));
    }));
    (chainl1 = (function(op, p) {
        return bind(p, (function chain(x1) {
            return optional(x1, bind(op, (function(f) {
                return bind(p, (function(y1) {
                    return chain(f(x1, y1));
                }));
            })));
        }));
    }));
    (chainl = (function(op, x1, p) {
        return optional(x1, chainl1(op, p));
    }));
    (chainr1 = (function(op, p) {
        return rec((function(self) {
            return bind(p, (function(x1) {
                return optional(x1, bind(op, (function(f) {
                    return self.map((function(y1) {
                        return f(x1, y1);
                    }));
                })));
            }));
        }));
    }));
    (chainr = (function(op, x1, p) {
        return optional(x1, chainr1(op, p));
    }));
    (exports["times"] = times);
    (exports["atMostTimes"] = atMostTimes);
    (exports["betweenTimes"] = betweenTimes);
    (exports["then"] = then);
    (exports["between"] = between);
    (exports["sepBy1"] = sepBy1);
    (exports["sepBy"] = sepBy);
    (exports["sepEndBy1"] = sepEndBy1);
    (exports["sepEndBy"] = sepEndBy);
    (exports["endBy1"] = endBy1);
    (exports["endBy"] = endBy);
    (exports["chainl1"] = chainl1);
    (exports["chainl"] = chainl);
    (exports["chainr1"] = chainr1);
    (exports["chainr"] = chainr);
}));