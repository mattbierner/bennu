/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/lang.kep'
 * DO NOT EDIT
*/
"use strict";
var __o = require("nu-stream")["stream"],
    __o0 = require("nu-stream")["gen"],
    __o1 = require("./parse"),
    times, atMostTimes, betweenTimes, then, between, sepBy1, sepBy, sepEndBy1, sepEndBy, endBy1, endBy, chainl1, chainl,
        chainr1, chainr, NIL = __o["NIL"],
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
    var args, n;
    return append(((args = [min, p]), enumerations(repeat.apply(null, args))), ((n = (max - min)), ((n <= 0) ?
        _end : _optionalValueParser(cons(p, late((function() {
            return atMostTimes((n - 1), p);
        })))))));
}));
(then = (function(p, q) {
    return bind(p, (function(x) {
        return next(q, always(x));
    }));
}));
(between = (function(open, close, p) {
    return next(open, bind(p, (function(x) {
        return next(close, always(x));
    })));
}));
(sepBy1 = (function(sep, p) {
    return cons(p, many(next(sep, p)));
}));
(sepBy = (function() {
    var args = arguments;
    return _optionalValueParser(sepBy1.apply(null, args));
}));
(sepEndBy1 = (function(sep, p) {
    return rec((function(self) {
        return cons(p, _optionalValueParser(next(sep, _optionalValueParser(self))));
    }));
}));
(sepEndBy = (function(sep, p) {
    return either(rec((function(self) {
        return cons(p, _optionalValueParser(next(sep, _optionalValueParser(self))));
    })), next(optional(sep), _end));
}));
(endBy1 = (function(sep, p) {
    return many1(bind(p, (function(x) {
        return next(sep, always(x));
    })));
}));
(endBy = (function(sep, p) {
    return many(bind(p, (function(x) {
        return next(sep, always(x));
    })));
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
    return optional(x, bind(p, (function chain(x0) {
        return optional(x0, bind(op, (function(f) {
            return bind(p, (function(y) {
                return chain(f(x0, y));
            }));
        })));
    })));
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
    return optional(x, rec((function(self) {
        return bind(p, (function(x0) {
            return optional(x0, bind(op, (function(f) {
                return self.map((function(y) {
                    return f(x0, y);
                }));
            })));
        }));
    })));
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