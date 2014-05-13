/*
 * THIS FILE IS AUTO GENERATED from 'lib/lang.kep'
 * DO NOT EDIT
*/define(["require", "exports", "nu-stream/stream", "nu-stream/gen", "./parse"], (function(require, exports, __o, __o0,
    __o1) {
    "use strict";
    var times, atMostTimes, betweenTimes, then, between, sepBy1, sepBy, sepEndBy1, sepEndBy, endBy1, endBy,
            chainl1, chainl, chainr1, chainr, NIL = __o["NIL"],
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
        _end = always(NIL),
        _optionalValueParser = optional.bind(null, NIL);
    (times = (function() {
        var args = arguments;
        return enumerations(repeat.apply(null, args));
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
    var x = sepBy1,
        y = _optionalValueParser;
    (sepBy = (function() {
        var args = arguments;
        return y(x.apply(null, args));
    }));
    (sepEndBy1 = (function(sep, p) {
        return rec((function(self) {
            return cons(p, _optionalValueParser(next(sep, _optionalValueParser(self))));
        }));
    }));
    (sepEndBy = (function(sep, p) {
        return either(sepEndBy1(sep, p), next(optional(sep), _end));
    }));
    (endBy1 = (function(sep, p) {
        return many1(then(p, sep));
    }));
    (endBy = (function(sep, p) {
        return many(then(p, sep));
    }));
    (chainl1 = (function(op, p) {
        return bind(p, (function chain(x0) {
            return optional(x0, bind(op, (function(f) {
                return bind(p, (function(y0) {
                    return chain(f(x0, y0));
                }));
            })));
        }));
    }));
    (chainl = (function(op, x0, p) {
        return optional(x0, chainl1(op, p));
    }));
    (chainr1 = (function(op, p) {
        return rec((function(self) {
            return bind(p, (function(x0) {
                return optional(x0, bind(op, (function(f) {
                    return self.map((function(y0) {
                        return f(x0, y0);
                    }));
                })));
            }));
        }));
    }));
    (chainr = (function(op, x0, p) {
        return optional(x0, chainr1(op, p));
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