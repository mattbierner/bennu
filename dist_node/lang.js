/*
 * THIS FILE IS AUTO GENERATED from 'lib/lang.kep'
 * DO NOT EDIT
*/"use strict";
var __o = require("nu-stream")["stream"],
    NIL = __o["NIL"],
    __o0 = require("nu-stream")["gen"],
    repeat = __o0["repeat"],
    __o1 = require("./parse"),
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
    times, atMostTimes, betweenTimes, then, between, sepBy1, sepBy, sepEndBy1, sepEndBy, endBy1, endBy, chainl1, chainl,
        chainr1, chainr, _end = always(NIL),
    _optionalValueParser = optional.bind(null, NIL);
(times = (function(f, g) {
    return (function() {
        return f(g.apply(null, arguments));
    });
})(enumerations, repeat));
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
(sepBy = (function(f, g) {
    return (function() {
        return f(g.apply(null, arguments));
    });
})(_optionalValueParser, sepBy1));
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
    return bind(p, (function chain(x) {
        return optional(x, bind(op, (function(f) {
            return bind(p, (function(y) {
                return chain(f(x, y));
            }));
        })));
    }));
}));
(chainl = (function(op, x, p) {
    return optional(x, chainl1(op, p));
}));
(chainr1 = (function(op, p) {
    return rec((function(self) {
        return bind(p, (function(x) {
            return optional(x, bind(op, (function(f) {
                return self.map((function(y) {
                    return f(x, y);
                }));
            })));
        }));
    }));
}));
(chainr = (function(op, x, p) {
    return optional(x, chainr1(op, p));
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