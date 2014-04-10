/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse.kep'
 * DO NOT EDIT
*/
"use strict";
var stream = require("nu-stream")["stream"],
    NIL = stream["NIL"],
    first = stream["first"],
    isEmpty = stream["isEmpty"],
    rest = stream["rest"],
    foldl = stream["foldl"],
    reduceRight = stream["reduceRight"],
    foldr = stream["foldr"],
    seshat = require("seshet"),
    Tail, trampoline, ParserError, ParseError, MultipleError, UnknownError, UnexpectError, ExpectError, ParserState,
        Position, Parser, label, late, rec, unparser, always, never, bind, extract, getParserState, setParserState,
        modifyParserState, getState, setState, modifyState, getInput, setInput, getPosition, setPosition, fail, attempt,
        look, lookahead, next, sequences, sequencea, sequence, either, choices, choicea, choice, optional, expected,
        eager, binds, cons, append, enumerations, enumerationa, enumeration, many, many1, memo, token, anyToken, eof,
        empty, ap, concat, of, map, chain, exec, parseState, parseStream, parse, runState, runStream, run, testState,
        testStream, test, args = (function() {
            var args0 = arguments;
            return args0;
        }),
    constant = (function(x) {
        return (function() {
            return x;
        });
    });
(Tail = (function(p, state, m, cok, cerr, eok, eerr) {
    var self = this;
    (self.p = p);
    (self.state = state);
    (self.m = m);
    (self.cok = cok);
    (self.cerr = cerr);
    (self.eok = eok);
    (self.eerr = eerr);
}));
(trampoline = (function(f) {
    var value = f;
    while ((value instanceof Tail)) {
        (value = value.p(value.state, value.m, value.cok, value.cerr, value.eok, value.eerr));
    }
    return value;
}));
var Memoer = (function(memoer, frames) {
    var self = this;
    (self.memoer = memoer);
    (self.frames = frames);
});
(Memoer.empty = new(Memoer)(seshat.create((function(x, y) {
    return x.compare(y);
}), (function(x, y) {
    return ((x.id === y.id) && ((x.state === y.state) || (x.state && x.state.eq(y.state))));
})), NIL));
(Memoer.pushWindow = (function(m, lower) {
    return new(Memoer)(m.memoer, stream.cons(lower, m.frames));
}));
(Memoer.popWindow = (function(m) {
    var frames = m["frames"],
        r = rest(frames);
    return new(Memoer)((isEmpty(r) ? seshat.prune(m.memoer, first(frames)) : m.memoer), r);
}));
(Memoer.prune = (function(m, position) {
    return (isEmpty(m.frames) ? new(Memoer)(seshat.prune(m.memoer, position), m.frames) : m);
}));
(Memoer.lookup = (function(m, pos, id) {
    return seshat.lookup(m.memoer, pos, id);
}));
(Memoer.update = (function(m, pos, id, val) {
    return new(Memoer)(seshat.update(m.memoer, pos, id, val), m.frames);
}));
(Position = (function(i) {
    var self = this;
    (self.index = i);
}));
(Position.initial = new(Position)(0));
(Position.prototype.toString = (function() {
    var self = this;
    return ("" + self.index);
}));
(Position.prototype.increment = (function(_, _0) {
    var self = this;
    return new(Position)((self.index + 1));
}));
(Position.prototype.compare = (function(pos) {
    var self = this;
    return (self.index - pos.index);
}));
(ParserState = (function(input, position, userState) {
    var self = this;
    (self.input = input);
    (self.position = position);
    (self.userState = userState);
}));
(ParserState.prototype.eq = (function(other) {
    var self = this;
    return ((other && (self.input === other.input)) && (self.userState === other.userState));
}));
(ParserState.prototype.isEmpty = (function() {
    var self = this;
    return isEmpty(self.input);
}));
(ParserState.prototype.first = (function() {
    var self = this;
    return first(self.input);
}));
(ParserState.prototype.next = (function(x) {
    var self = this;
    if ((!self._next)) {
        var r = rest(self.input),
            s = new(ParserState)(r, self.position.increment(x, r), self.userState);
        (self._next = new(Parser)((function(_, m, cok) {
            return cok(x, s, m);
        })));
    }
    return self._next;
}));
(ParserState.prototype.setInput = (function(input) {
    var self = this;
    return new(ParserState)(input, self.position, self.userState);
}));
(ParserState.prototype.setPosition = (function(position) {
    var self = this;
    return new(ParserState)(self.input, position, self.userState);
}));
(ParserState.prototype.setUserState = (function(userState) {
    var self = this;
    return new(ParserState)(self.input, self.position, userState);
}));
(ParserError = (function(msg) {
    var self = this;
    (self.message = msg);
}));
(ParserError.prototype = new(Error)());
(ParserError.prototype.constructor = ParserError);
(ParserError.prototype.name = "ParserError");
(ParseError = (function(position, msg) {
    var self = this;
    (self.position = position);
    (self._msg = (msg || ""));
}));
(ParseError.prototype = new(Error)());
(ParseError.prototype.constructor = ParseError);
(ParseError.prototype.name = "ParseError");
(ParseError.prototype.toString = (function() {
    var self = this;
    return self.message;
}));
Object.defineProperties(ParseError.prototype, ({
    "message": ({
        "configurable": true,
        "get": (function() {
            var self = this;
            return ((("At " + self.position) + " ") + self.errorMessage);
        })
    }),
    "errorMessage": ({
        "configurable": true,
        "get": (function() {
            var self = this;
            return self._msg;
        })
    })
}));
(MultipleError = (function(position, errors) {
    var self = this;
    (self.position = position);
    (self.errors = (errors || []));
}));
(MultipleError.prototype = new(ParseError)());
(MultipleError.prototype.constructor = MultipleError);
(MultipleError.prototype.name = "MultipleError");
Object.defineProperty(MultipleError.prototype, "errorMessage", ({
    "get": (function() {
        var self = this;
        return (("[" + self.errors.map((function(x) {
                return x.message;
            }))
            .join(", ")) + "]");
    })
}));
var ChoiceError = (function(position, pErr, qErr) {
    var self = this;
    (self.position = position);
    (self._pErr = pErr);
    (self._qErr = qErr);
});
(ChoiceError.prototype = new(MultipleError)());
(ChoiceError.prototype.constructor = MultipleError);
(ChoiceError.prototype.name = "ChoiceError");
Object.defineProperty(ChoiceError.prototype, "errors", ({
    "get": (function() {
        var self = this;
        return [self._pErr].concat(self._qErr.errors);
    })
}));
(UnknownError = (function(position) {
    var self = this;
    (self.position = position);
}));
(UnknownError.prototype = new(ParseError)());
(UnknownError.prototype.constructor = UnknownError);
(UnknownError.prototype.name = "UnknownError");
Object.defineProperty(UnknownError.prototype, "errorMessage", ({
    "value": "unknown error"
}));
(UnexpectError = (function(position, unexpected) {
    var self = this;
    (self.position = position);
    (self.unexpected = unexpected);
}));
(UnexpectError.prototype = new(ParseError)());
(UnexpectError.prototype.constructor = UnexpectError);
(UnexpectError.prototype.name = "UnexpectError");
Object.defineProperty(UnexpectError.prototype, "errorMessage", ({
    "get": (function() {
        var self = this;
        return ("unexpected: " + self.unexpected);
    })
}));
(ExpectError = (function(position, expected, found) {
    var self = this;
    (self.position = position);
    (self.expected = expected);
    (self.found = found);
}));
(ExpectError.prototype = new(ParseError)());
(ExpectError.prototype.constructor = ExpectError);
(ExpectError.prototype.name = "ExpectError");
Object.defineProperty(ExpectError.prototype, "errorMessage", ({
    "get": (function() {
        var self = this;
        return (("expected: " + self.expected) + (self.found ? (" found: " + self.found) : ""));
    })
}));
(Parser = (function(n) {
    var self = this;
    (self.run = n);
}));
(unparser = (function(p, state, m, cok, cerr, eok, eerr) {
    return new(Tail)(p.run, state, m, cok, cerr, eok, eerr);
}));
(label = (function(name, p) {
    return (p.run.hasOwnProperty("displayName") ? label(name, new(Parser)((function(p0, state, m, cok, cerr,
        eok, eerr) {
        return unparser(p0, state, m, cok, cerr, eok, eerr);
    }))) : new(Parser)(Object.defineProperty(p.run, "displayName", ({
        "value": name,
        "writable": false
    }))));
}));
(late = (function(def) {
    var value;
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        (value = (value || def()));
        return unparser(value, state, m, cok, cerr, eok, eerr);
    }));
}));
(rec = (function(def) {
    var value = def(late((function() {
        return value;
    })));
    return value;
}));
(always = (function(x) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        return eok(x, state, m);
    }));
}));
(never = (function(x) {
    return new(Parser)((function(state, m, _, _0, _1, eerr) {
        return eerr(x, state, m);
    }));
}));
(bind = (function(p, f) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        return unparser(p, state, m, (function(x, state0, m0) {
            return unparser(f(x), state0, m0, cok, cerr, cok, cerr);
        }), cerr, (function(x, state0, m0) {
            return unparser(f(x), state0, m0, cok, cerr, eok, eerr);
        }), eerr);
    }));
}));
(modifyParserState = (function(f) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        var newState = f(state);
        return eok(newState, newState, m);
    }));
}));
(getParserState = label("Get Parser State", modifyParserState((function(x) {
    return x;
}))));
(setParserState = (function(s) {
    return modifyParserState(constant(s));
}));
(extract = (function(f) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        return eok(f(state), state, m);
    }));
}));
(modifyState = (function(f) {
    return modifyParserState((function(s) {
        return s.setUserState(f(s.userState));
    }));
}));
(getState = label("Get State", extract((function(s) {
    return s.userState;
}))));
(setState = (function(s) {
    return modifyState(constant(s));
}));
(getPosition = label("Get Position", extract((function(s) {
    return s.position;
}))));
(setPosition = (function(position) {
    return modifyParserState((function(s) {
        return s.setPosition(position);
    }));
}));
(getInput = label("Get Input", extract((function(s) {
    return s.input;
}))));
(setInput = (function(input) {
    return modifyParserState((function(s) {
        return s.setInput(input);
    }));
}));
var _binary = (function(p1, p2, f) {
    return bind(p1, (function(v1) {
        return bind(p2, (function(v2) {
            return f(v1, v2);
        }));
    }));
}),
    _fail = (function(e) {
        return bind(getPosition, (function(pos) {
            return never(e(pos));
        }));
    });
(fail = (function(msg) {
    var e = (msg ? ParseError : UnknownError);
    return _fail((function(pos) {
        return new(e)(pos, msg);
    }));
}));
(attempt = (function(p) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var peerr = (function(x, s, m0) {
            return eerr(x, s, Memoer.popWindow(m0));
        });
        return unparser(p, state, Memoer.pushWindow(m, state.position), (function(x, s, m0) {
            return cok(x, s, Memoer.popWindow(m0));
        }), peerr, (function(x, s, m0) {
            return eok(x, s, Memoer.popWindow(m0));
        }), peerr);
    }));
}));
(look = (function(p) {
    return _binary(getParserState, p, (function(state, x) {
        return next(setParserState(state), always(x));
    }));
}));
(lookahead = (function(p) {
    return _binary(getInput, getPosition, (function(input, pos) {
        return bind(p, (function(x) {
            return sequence(setPosition(pos), setInput(input), always(x));
        }));
    }));
}));
(next = (function(p, q) {
    return bind(p, constant(q));
}));
var f;
(sequences = reduceRight.bind(null, ((f = next), (function(x, y) {
    return f(y, x);
}))));
var x = stream.from,
    y = sequences;
(sequencea = (function(x0) {
    return y(x(x0));
}));
var x0 = args,
    y0 = sequencea;
(sequence = (function() {
    return y0(x0.apply(null, arguments));
}));
(either = (function(p, q) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var position = state["position"],
            peerr = (function(errFromP, _, mFromP) {
                var qeerr = (function(errFromQ, _0, mFromQ) {
                    return eerr(new(MultipleError)(position, [errFromP, errFromQ]), state,
                        mFromQ);
                });
                return unparser(q, state, mFromP, cok, cerr, eok, qeerr);
            });
        return unparser(p, state, m, cok, cerr, eok, peerr);
    }));
}));
(choices = foldr.bind(null, (function(x1, y1) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var position = state["position"],
            peerr = (function(errFromP, _, mFromP) {
                var qeerr = (function(errFromQ, _0, mFromQ) {
                    return eerr(new(ChoiceError)(position, errFromP, errFromQ), state,
                        mFromQ);
                });
                return unparser(x1, state, mFromP, cok, cerr, eok, qeerr);
            });
        return unparser(y1, state, m, cok, cerr, eok, peerr);
    }));
}), never(new(MultipleError)(null, []))));
var x1 = stream.from,
    y1 = choices;
(choicea = (function(x2) {
    return y1(x1(x2));
}));
var x2 = args,
    y2 = choicea;
(choice = (function() {
    return y2(x2.apply(null, arguments));
}));
(optional = (function(x3, p) {
    return (p ? either(p, always(x3)) : either(x3, always(null)));
}));
(expected = (function(expect, p) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        return unparser(p, state, m, cok, cerr, eok, (function(x3, state0, m0) {
            return eerr(new(ExpectError)(state0.position, expect), state0, m0);
        }));
    }));
}));
(Parser.map = (function(f0, p) {
    var y3;
    return bind(p, ((y3 = always), (function(x3) {
        return y3(f0(x3));
    })));
}));
(map = Parser.map);
(Parser.prototype.map = (function(f0) {
    var self = this;
    return map(f0, self);
}));
(Parser.ap = (function(f0, m) {
    return bind(f0, (function(f1) {
        return m.map(f1);
    }));
}));
(ap = Parser.ap);
(Parser.prototype.ap = (function(m2) {
    var self = this;
    return ap(self, m2);
}));
(Parser.chain = bind);
(chain = Parser.chain);
(Parser.prototype.chain = (function(f0) {
    var self = this;
    return chain(self, f0);
}));
(Parser.prototype.of = always);
(Parser.of = Parser.prototype.of);
(of = Parser.of);
(Parser.prototype.empty = fail());
(Parser.empty = Parser.prototype.empty);
(empty = Parser.empty);
(Parser.concat = either);
(concat = Parser.concat);
(Parser.prototype.concat = (function(p) {
    var self = this;
    return concat(self, p);
}));
(eager = map.bind(null, stream.toArray));
(binds = (function(p, f0) {
    return bind(eager(p), (function(x3) {
        return f0.apply(undefined, x3);
    }));
}));
var f0 = stream.cons;
(cons = (function(p1, p2) {
    return bind(p1, (function(x3) {
        return map((function(y3) {
            return f0(x3, y3);
        }), p2);
    }));
}));
var f1 = stream.append;
(append = (function(p1, p2) {
    return bind(p1, (function(x3) {
        return map((function(y3) {
            return f1(x3, y3);
        }), p2);
    }));
}));
var f2;
(enumerations = foldr.bind(null, ((f2 = cons), (function(x3, y3) {
    return f2(y3, x3);
})), always(NIL)));
var x3 = stream.from,
    y3 = enumerations;
(enumerationa = (function(x4) {
    return y3(x3(x4));
}));
var x4 = args,
    y4 = enumerationa;
(enumeration = (function() {
    return y4(x4.apply(null, arguments));
}));
var _optionalValueParser = optional.bind(null, NIL),
    err = new(ParserError)("Many parser applied to a parser that accepts an empty string"),
    manyError = (function() {
        throw err;
    });
(many = (function(p) {
    var safeP = new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        return unparser(p, state, m, cok, cerr, manyError, eerr);
    }));
    return rec((function(self) {
        return _optionalValueParser(cons(safeP, self));
    }));
}));
(many1 = (function(p) {
    return cons(p, many(p));
}));
(memo = (function(p) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var position = state["position"],
            key = ({
                "id": p,
                "state": state
            }),
            entry = Memoer.lookup(m, position, key);
        if (entry) {
            var type = entry[0],
                x5 = entry[1],
                s = entry[2];
            switch (type) {
                case "cok":
                    return cok(x5, s, m);
                case "ceerr":
                    return cerr(x5, s, m);
                case "eok":
                    return eok(x5, s, m);
                case "eerr":
                    return eerr(x5, s, m);
            }
        }
        return unparser(p, state, m, (function(x6, pstate, pm) {
            return cok(x6, pstate, Memoer.update(pm, position, key, ["cok", x6, pstate]));
        }), (function(x6, pstate, pm) {
            return cerr(x6, pstate, Memoer.update(pm, position, key, ["cerr", x6, pstate]));
        }), (function(x6, pstate, pm) {
            return eok(x6, pstate, Memoer.update(pm, position, key, ["eok", x6, pstate]));
        }), (function(x6, pstate, pm) {
            return eerr(x6, pstate, Memoer.update(pm, position, key, ["eerr", x6, pstate]));
        }));
    }));
}));
var defaultErr = (function(pos, tok) {
    return new(UnexpectError)(pos, ((tok === null) ? "end of input" : tok));
});
(token = (function(consume, onErr) {
    var errorHandler = (onErr || defaultErr);
    return new(Parser)((function(s, m, cok, cerr, eok, eerr) {
        var tok, pcok;
        return (s.isEmpty() ? eerr(errorHandler(s.position, null), s, m) : ((tok = s.first()), (consume(
            tok) ? ((pcok = (function(x5, s0, m0) {
            return cok(x5, s0, Memoer.prune(m0, s0.position));
        })), unparser(s.next(tok), s, m, pcok, cerr, pcok, cerr)) : eerr(errorHandler(s.position,
            tok), s, m))));
    }));
}));
(anyToken = label("Any Token", token((function() {
    return true;
}))));
var end;
(eof = label("EOF", ((end = always(null)), bind(getParserState, (function(s) {
    return (s.isEmpty() ? end : _fail((function(pos) {
        return new(ExpectError)(pos, "end of input", s.first());
    })));
})))));
var x5 = unparser,
    y5 = trampoline;
(exec = (function() {
    return y5(x5.apply(null, arguments));
}));
(parseState = (function(p, state, ok, err0) {
    return exec(p, state, Memoer.empty, ok, err0, ok, err0);
}));
(parseStream = (function(p, s, ud, ok, err0) {
    return parseState(p, new(ParserState)(s, Position.initial, ud), ok, err0);
}));
(parse = (function(p, input, ud, ok, err0) {
    return parseStream(p, stream.from(input), ud, ok, err0);
}));
var ok = (function(x6) {
    return x6;
}),
    err0 = (function(x6) {
        throw x6;
    });
(runState = (function(p, state) {
    return parseState(p, state, ok, err0);
}));
(runStream = (function(p, s, ud) {
    return runState(p, new(ParserState)(s, Position.initial, ud));
}));
(run = (function(p, input, ud) {
    return runStream(p, stream.from(input), ud);
}));
var ok0 = (function() {
    return true;
}),
    err1 = (function() {
        return false;
    });
(testState = (function(p, state) {
    return parseState(p, state, ok0, err1);
}));
(testStream = (function(p, s, ud) {
    return testState(p, new(ParserState)(s, Position.initial, ud));
}));
(test = (function(p, input, ud) {
    return testStream(p, stream.from(input), ud);
}));
(exports["Tail"] = Tail);
(exports["trampoline"] = trampoline);
(exports["ParserError"] = ParserError);
(exports["ParseError"] = ParseError);
(exports["MultipleError"] = MultipleError);
(exports["UnknownError"] = UnknownError);
(exports["UnexpectError"] = UnexpectError);
(exports["ExpectError"] = ExpectError);
(exports["ParserState"] = ParserState);
(exports["Position"] = Position);
(exports["Parser"] = Parser);
(exports["label"] = label);
(exports["late"] = late);
(exports["rec"] = rec);
(exports["unparser"] = unparser);
(exports["always"] = always);
(exports["never"] = never);
(exports["bind"] = bind);
(exports["extract"] = extract);
(exports["getParserState"] = getParserState);
(exports["setParserState"] = setParserState);
(exports["modifyParserState"] = modifyParserState);
(exports["getState"] = getState);
(exports["setState"] = setState);
(exports["modifyState"] = modifyState);
(exports["getInput"] = getInput);
(exports["setInput"] = setInput);
(exports["getPosition"] = getPosition);
(exports["setPosition"] = setPosition);
(exports["fail"] = fail);
(exports["attempt"] = attempt);
(exports["look"] = look);
(exports["lookahead"] = lookahead);
(exports["next"] = next);
(exports["sequences"] = sequences);
(exports["sequencea"] = sequencea);
(exports["sequence"] = sequence);
(exports["either"] = either);
(exports["choices"] = choices);
(exports["choicea"] = choicea);
(exports["choice"] = choice);
(exports["optional"] = optional);
(exports["expected"] = expected);
(exports["eager"] = eager);
(exports["binds"] = binds);
(exports["cons"] = cons);
(exports["append"] = append);
(exports["enumerations"] = enumerations);
(exports["enumerationa"] = enumerationa);
(exports["enumeration"] = enumeration);
(exports["many"] = many);
(exports["many1"] = many1);
(exports["memo"] = memo);
(exports["token"] = token);
(exports["anyToken"] = anyToken);
(exports["eof"] = eof);
(exports["empty"] = empty);
(exports["ap"] = ap);
(exports["concat"] = concat);
(exports["of"] = of);
(exports["map"] = map);
(exports["chain"] = chain);
(exports["exec"] = exec);
(exports["parseState"] = parseState);
(exports["parseStream"] = parseStream);
(exports["parse"] = parse);
(exports["runState"] = runState);
(exports["runStream"] = runStream);
(exports["run"] = run);
(exports["testState"] = testState);
(exports["testStream"] = testStream);
(exports["test"] = test);