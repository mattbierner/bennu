/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/parse.kep'
 * DO NOT EDIT
*/
"use strict";
var stream = require("nu-stream")["stream"],
    seshat = require("seshet"),
    Tail, trampoline, ParserError, ParseError, MultipleError, UnknownError, UnexpectError, ExpectError, ParserState,
        Position, Parser, label, late, rec, unparser, always, of, never, bind, chain, map, ap, extract, getParserState,
        setParserState, modifyParserState, getState, setState, modifyState, getInput, setInput, getPosition,
        setPosition, fail, attempt, look, lookahead, next, sequences, sequencea, sequence, empty, either, concat,
        choices, choicea, choice, optional, expected, not, eager, binds, cons, append, enumerations, enumerationa,
        enumeration, many, many1, memo, token, anyToken, eof, exec, parseState, parseStream, parse, runState, runStream,
        run, testState, testStream, test, NIL = stream["NIL"],
    first = stream["first"],
    isEmpty = stream["isEmpty"],
    rest = stream["rest"],
    reduceRight = stream["reduceRight"],
    foldr = stream["foldr"],
    identity = (function(x) {
        return x;
    }),
    args = (function() {
        var args0 = arguments;
        return args0;
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
(ParserState.prototype.next = (function(tok) {
    var self = this;
    if ((!self._next)) {
        var r = rest(self.input),
            s = new(ParserState)(r, self.position.increment(tok, r), self.userState);
        (self._next = new(Parser)((function(_, m, cok) {
            return cok(tok, s, m);
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
    message: ({
        configurable: true,
        get: (function() {
            var self = this;
            return ((("At " + self.position) + " ") + self.errorMessage);
        })
    }),
    errorMessage: ({
        configurable: true,
        get: (function() {
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
    get: (function() {
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
    get: (function() {
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
    value: "unknown error"
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
    get: (function() {
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
    get: (function() {
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
    return (p.run.hasOwnProperty("displayName") ? label(name, new(Parser)((function(state, m, cok, cerr, eok,
        eerr) {
        return new(Tail)(p.run, state, m, cok, cerr, eok, eerr);
    }))) : new(Parser)(Object.defineProperty(p.run, "displayName", ({
        value: name,
        writable: false
    }))));
}));
(late = (function(def) {
    var value;
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        (value = (value || def()));
        var p = value;
        return new(Tail)(p.run, state, m, cok, cerr, eok, eerr);
    }));
}));
(rec = (function(def) {
    var value = def(late((function() {
        return value;
    })));
    return value;
}));
(Parser.prototype.of = (function(x) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        return eok(x, state, m);
    }));
}));
(Parser.of = Parser.prototype.of);
(of = Parser.of);
(always = of);
(never = (function(x) {
    return new(Parser)((function(state, m, _, _0, _1, eerr) {
        return eerr(x, state, m);
    }));
}));
(Parser.chain = (function(p, f) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var cok0 = (function(x, state0, m0) {
            var p0 = f(x);
            return new(Tail)(p0.run, state0, m0, cok, cerr, cok, cerr);
        }),
            eok0 = (function(x, state0, m0) {
                var p0 = f(x);
                return new(Tail)(p0.run, state0, m0, cok, cerr, eok, eerr);
            });
        return new(Tail)(p.run, state, m, cok0, cerr, eok0, eerr);
    }));
}));
(chain = Parser.chain);
(bind = chain);
(Parser.prototype.chain = (function(f) {
    var self = this;
    return chain(self, f);
}));
(Parser.prototype.map = (function(f) {
    var self = this;
    return chain(self, (function(z) {
        return of(f(z));
    }));
}));
(Parser.map = (function(f, p) {
    return p.map(f);
}));
(map = Parser.map);
(Parser.ap = (function(f, m) {
    return chain(f, (function(f0) {
        return m.map(f0);
    }));
}));
(ap = Parser.ap);
(Parser.prototype.ap = (function(m2) {
    var self = this;
    return ap(self, m2);
}));
(modifyParserState = (function(f) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        var newState = f(state);
        return eok(newState, newState, m);
    }));
}));
var p = new(Parser)((function(state, m, _, _0, eok, _1) {
    return eok(state, state, m);
}));
(getParserState = (p.run.hasOwnProperty("displayName") ? label("Get Parser State", new(Parser)((function(state, m, cok,
    cerr, eok, eerr) {
    return new(Tail)(p.run, state, m, cok, cerr, eok, eerr);
}))) : new(Parser)(Object.defineProperty(p.run, "displayName", ({
    value: "Get Parser State",
    writable: false
})))));
(setParserState = (function(z) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        return eok(z, z, m);
    }));
}));
(extract = (function(f) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        return eok(f(state), state, m);
    }));
}));
(modifyState = (function(f) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        var newState = state.setUserState(f(state.userState));
        return eok(newState, newState, m);
    }));
}));
var p0 = new(Parser)((function(state, m, _, _0, eok, _1) {
    return eok(state.userState, state, m);
}));
(getState = (p0.run.hasOwnProperty("displayName") ? label("Get State", new(Parser)((function(state, m, cok, cerr, eok,
    eerr) {
    return new(Tail)(p0.run, state, m, cok, cerr, eok, eerr);
}))) : new(Parser)(Object.defineProperty(p0.run, "displayName", ({
    value: "Get State",
    writable: false
})))));
(setState = (function(z) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        var newState = state.setUserState(z);
        return eok(newState, newState, m);
    }));
}));
var p1 = new(Parser)((function(state, m, _, _0, eok, _1) {
    return eok(state.position, state, m);
}));
(getPosition = (p1.run.hasOwnProperty("displayName") ? label("Get Position", new(Parser)((function(state, m, cok, cerr,
    eok, eerr) {
    return new(Tail)(p1.run, state, m, cok, cerr, eok, eerr);
}))) : new(Parser)(Object.defineProperty(p1.run, "displayName", ({
    value: "Get Position",
    writable: false
})))));
(setPosition = (function(position) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        var newState = state.setPosition(position);
        return eok(newState, newState, m);
    }));
}));
var p2 = new(Parser)((function(state, m, _, _0, eok, _1) {
    return eok(state.input, state, m);
}));
(getInput = (p2.run.hasOwnProperty("displayName") ? label("Get Input", new(Parser)((function(state, m, cok, cerr, eok,
    eerr) {
    return new(Tail)(p2.run, state, m, cok, cerr, eok, eerr);
}))) : new(Parser)(Object.defineProperty(p2.run, "displayName", ({
    value: "Get Input",
    writable: false
})))));
(setInput = (function(input) {
    return new(Parser)((function(state, m, _, _0, eok, _1) {
        var newState = state.setInput(input);
        return eok(newState, newState, m);
    }));
}));
(fail = (function(msg) {
    var e = (msg ? ParseError : UnknownError);
    return chain(getPosition, (function(z) {
        var x = new(e)(z, msg);
        return new(Parser)((function(state, m, _, _0, _1, eerr) {
            return eerr(x, state, m);
        }));
    }));
}));
(attempt = (function(p3) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var peerr = (function(x, s, m0) {
            return eerr(x, s, Memoer.popWindow(m0));
        }),
            m0 = Memoer.pushWindow(m, state.position),
            cok0 = (function(x, s, m1) {
                return cok(x, s, Memoer.popWindow(m1));
            }),
            eok0 = (function(x, s, m1) {
                return eok(x, s, Memoer.popWindow(m1));
            });
        return new(Tail)(p3.run, state, m0, cok0, peerr, eok0, peerr);
    }));
}));
(look = (function(p3) {
    return chain(getParserState, (function(v1) {
        return chain(p3, (function(v2) {
            return next(setParserState(v1), of(v2));
        }));
    }));
}));
(lookahead = (function(p3) {
    return chain(getInput, (function(v1) {
        return chain(getPosition, (function(v2) {
            return chain(p3, (function(x) {
                return sequence(new(Parser)((function(state, m, _, _0, eok, _1) {
                    var newState = state.setPosition(v2);
                    return eok(newState, newState, m);
                })), setInput(v1), of(x));
            }));
        }));
    }));
}));
(next = (function(p3, q) {
    return chain(p3, (function() {
        return q;
    }));
}));
(sequences = reduceRight.bind(null, (function(x, y) {
    return chain(y, (function() {
        return x;
    }));
})));
var x = stream.from;
(sequencea = (function(z) {
    return sequences(x(z));
}));
(sequence = (function() {
    var args0 = arguments;
    return sequencea(args.apply(null, args0));
}));
var e = (undefined ? ParseError : UnknownError);
(Parser.prototype.empty = chain(getPosition, (function(z) {
    var x0 = new(e)(z, undefined);
    return new(Parser)((function(state, m, _, _0, _1, eerr) {
        return eerr(x0, state, m);
    }));
})));
(Parser.empty = Parser.prototype.empty);
(empty = Parser.empty);
(Parser.concat = (function(p3, q) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var position = state["position"],
            peerr = (function(errFromP, _, mFromP) {
                var qeerr = (function(errFromQ, _0, mFromQ) {
                    return eerr(new(MultipleError)(position, [errFromP, errFromQ]), state,
                        mFromQ);
                });
                return new(Tail)(q.run, state, mFromP, cok, cerr, eok, qeerr);
            });
        return new(Tail)(p3.run, state, m, cok, cerr, eok, peerr);
    }));
}));
(concat = Parser.concat);
(either = concat);
(Parser.prototype.concat = (function(p3) {
    var self = this;
    return concat(self, p3);
}));
var x0;
(choices = foldr.bind(null, (function(x0, y) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var position = state["position"],
            peerr = (function(errFromP, _, mFromP) {
                var qeerr = (function(errFromQ, _0, mFromQ) {
                    return eerr(new(ChoiceError)(position, errFromP, errFromQ), state,
                        mFromQ);
                });
                return new(Tail)(x0.run, state, mFromP, cok, cerr, eok, qeerr);
            });
        return new(Tail)(y.run, state, m, cok, cerr, eok, peerr);
    }));
}), ((x0 = new(MultipleError)(null, [])), new(Parser)((function(state, m, _, _0, _1, eerr) {
    return eerr(x0, state, m);
})))));
var x1 = stream.from;
(choicea = (function(z) {
    return choices(x1(z));
}));
(choice = (function() {
    var args0 = arguments;
    return choicea(args.apply(null, args0));
}));
(optional = (function(x2, p3) {
    return (p3 ? concat(p3, of(x2)) : concat(x2, of(null)));
}));
(expected = (function(expect, p3) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var eerr0 = (function(x2, state0, m0) {
            return eerr(new(ExpectError)(state0.position, expect), state0, m0);
        });
        return new(Tail)(p3.run, state, m, cok, cerr, eok, eerr0);
    }));
}));
(not = (function(p3) {
    var p4 = concat(chain(new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var peerr = (function(x2, s, m0) {
            return eerr(x2, s, Memoer.popWindow(m0));
        }),
            m0 = Memoer.pushWindow(m, state.position),
            cok0 = (function(x2, s, m1) {
                return cok(x2, s, Memoer.popWindow(m1));
            }),
            eok0 = (function(x2, s, m1) {
                return eok(x2, s, Memoer.popWindow(m1));
            });
        return new(Tail)(p3.run, state, m0, cok0, peerr, eok0, peerr);
    })), (function(x2) {
        return chain(getPosition, (function(z) {
            var x3 = new(UnexpectError)(z, x2);
            return new(Parser)((function(state, m, _, _0, _1, eerr) {
                return eerr(x3, state, m);
            }));
        }));
    })), of(null));
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var peerr = (function(x2, s, m0) {
            return eerr(x2, s, Memoer.popWindow(m0));
        }),
            m0 = Memoer.pushWindow(m, state.position),
            cok0 = (function(x2, s, m1) {
                return cok(x2, s, Memoer.popWindow(m1));
            }),
            eok0 = (function(x2, s, m1) {
                return eok(x2, s, Memoer.popWindow(m1));
            });
        return new(Tail)(p4.run, state, m0, cok0, peerr, eok0, peerr);
    }));
}));
(eager = map.bind(null, stream.toArray));
(binds = (function(p3, f) {
    return chain(eager(p3), (function(x2) {
        return f.apply(undefined, x2);
    }));
}));
var f = stream.cons;
(cons = (function(p10, p20) {
    return chain(p10, (function(x2) {
        return map((function(y) {
            return f(x2, y);
        }), p20);
    }));
}));
var f0 = stream.append;
(append = (function(p10, p20) {
    return chain(p10, (function(x2) {
        return map((function(y) {
            return f0(x2, y);
        }), p20);
    }));
}));
(enumerations = foldr.bind(null, (function(x2, y) {
    return cons(y, x2);
}), of(NIL)));
var x2 = stream.from;
(enumerationa = (function(z) {
    return enumerations(x2(z));
}));
(enumeration = (function() {
    var args0 = arguments;
    return enumerationa(args.apply(null, args0));
}));
var err = new(ParserError)("Many parser applied to parser that accepts an empty string"),
    manyError = (function() {
        throw err;
    });
(many = (function(p3) {
    var safeP = new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        return new(Tail)(p3.run, state, m, cok, cerr, manyError, eerr);
    }));
    return rec((function(self) {
        var p4 = cons(safeP, self);
        return (p4 ? concat(p4, of(NIL)) : concat(NIL, of(null)));
    }));
}));
(many1 = (function(p3) {
    return cons(p3, many(p3));
}));
(memo = (function(p3) {
    return new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var position = state["position"],
            key = ({
                id: p3,
                state: state
            }),
            entry = Memoer.lookup(m, position, key);
        if (entry) {
            var type = entry[0],
                x3 = entry[1],
                s = entry[2];
            switch (type) {
                case "cok":
                    return cok(x3, s, m);
                case "ceerr":
                    return cerr(x3, s, m);
                case "eok":
                    return eok(x3, s, m);
                case "eerr":
                    return eerr(x3, s, m);
            }
        }
        var cok0 = (function(x4, pstate, pm) {
            return cok(x4, pstate, Memoer.update(pm, position, key, ["cok", x4, pstate]));
        }),
            cerr0 = (function(x4, pstate, pm) {
                return cerr(x4, pstate, Memoer.update(pm, position, key, ["cerr", x4, pstate]));
            }),
            eok0 = (function(x4, pstate, pm) {
                return eok(x4, pstate, Memoer.update(pm, position, key, ["eok", x4, pstate]));
            }),
            eerr0 = (function(x4, pstate, pm) {
                return eerr(x4, pstate, Memoer.update(pm, position, key, ["eerr", x4, pstate]));
            });
        return new(Tail)(p3.run, state, m, cok0, cerr0, eok0, eerr0);
    }));
}));
var defaultErr = (function(pos, tok) {
    return new(UnexpectError)(pos, ((tok === null) ? "end of input" : tok));
});
(token = (function(consume, onErr) {
    var errorHandler = (onErr || defaultErr);
    return new(Parser)((function(s, m, cok, cerr, eok, eerr) {
        var tok, pcok, p3;
        return (s.isEmpty() ? eerr(errorHandler(s.position, null), s, m) : ((tok = s.first()), (consume(
            tok) ? ((pcok = (function(x3, s0, m0) {
            return cok(x3, s0, Memoer.prune(m0, s0.position));
        })), (p3 = s.next(tok)), new(Tail)(p3.run, s, m, pcok, cerr, pcok, cerr)) : eerr(
            errorHandler(s.position, tok), s, m))));
    }));
}));
var p3 = token((function() {
    return true;
}));
(anyToken = (p3.run.hasOwnProperty("displayName") ? label("Any Token", new(Parser)((function(state, m, cok, cerr, eok,
    eerr) {
    return new(Tail)(p3.run, state, m, cok, cerr, eok, eerr);
}))) : new(Parser)(Object.defineProperty(p3.run, "displayName", ({
    value: "Any Token",
    writable: false
})))));
var p4 = concat(chain(new(Parser)((function(state, m, cok, cerr, eok, eerr) {
    var peerr = (function(x3, s, m0) {
        return eerr(x3, s, Memoer.popWindow(m0));
    }),
        m0 = Memoer.pushWindow(m, state.position),
        cok0 = (function(x3, s, m1) {
            return cok(x3, s, Memoer.popWindow(m1));
        }),
        eok0 = (function(x3, s, m1) {
            return eok(x3, s, Memoer.popWindow(m1));
        });
    return new(Tail)(anyToken.run, state, m0, cok0, peerr, eok0, peerr);
})), (function(x3) {
    return chain(getPosition, (function(z) {
        var x4 = new(UnexpectError)(z, x3);
        return new(Parser)((function(state, m, _, _0, _1, eerr) {
            return eerr(x4, state, m);
        }));
    }));
})), of(null)),
    p5 = new(Parser)((function(state, m, cok, cerr, eok, eerr) {
        var peerr = (function(x3, s, m0) {
            return eerr(x3, s, Memoer.popWindow(m0));
        }),
            m0 = Memoer.pushWindow(m, state.position),
            cok0 = (function(x3, s, m1) {
                return cok(x3, s, Memoer.popWindow(m1));
            }),
            eok0 = (function(x3, s, m1) {
                return eok(x3, s, Memoer.popWindow(m1));
            });
        return new(Tail)(p4.run, state, m0, cok0, peerr, eok0, peerr);
    }));
(eof = (p5.run.hasOwnProperty("displayName") ? label("EOF", new(Parser)((function(state, m, cok, cerr, eok, eerr) {
    return new(Tail)(p5.run, state, m, cok, cerr, eok, eerr);
}))) : new(Parser)(Object.defineProperty(p5.run, "displayName", ({
    value: "EOF",
    writable: false
})))));
(exec = (function() {
    var args0 = arguments;
    return trampoline(unparser.apply(null, args0));
}));
(parseState = (function(p6, state, ok, err0) {
    return exec(p6, state, Memoer.empty, ok, err0, ok, err0);
}));
(parseStream = (function(p6, s, ud, ok, err0) {
    var state = new(ParserState)(s, Position.initial, ud);
    return exec(p6, state, Memoer.empty, ok, err0, ok, err0);
}));
(parse = (function(p6, input, ud, ok, err0) {
    var s = stream.from(input),
        state = new(ParserState)(s, Position.initial, ud);
    return exec(p6, state, Memoer.empty, ok, err0, ok, err0);
}));
var err0 = (function(x3) {
    throw x3;
});
(runState = (function(p6, state) {
    return exec(p6, state, Memoer.empty, identity, err0, identity, err0);
}));
(runStream = (function(p6, s, ud) {
    return runState(p6, new(ParserState)(s, Position.initial, ud));
}));
(run = (function(p6, input, ud) {
    var s = stream.from(input);
    return runState(p6, new(ParserState)(s, Position.initial, ud));
}));
var ok = (function() {
    return true;
}),
    err1 = (function() {
        return false;
    });
(testState = (function(p6, state) {
    return exec(p6, state, Memoer.empty, ok, err1, ok, err1);
}));
(testStream = (function(p6, s, ud) {
    return testState(p6, new(ParserState)(s, Position.initial, ud));
}));
(test = (function(p6, input, ud) {
    var s = stream.from(input);
    return testState(p6, new(ParserState)(s, Position.initial, ud));
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
(exports["of"] = of);
(exports["never"] = never);
(exports["bind"] = bind);
(exports["chain"] = chain);
(exports["map"] = map);
(exports["ap"] = ap);
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
(exports["empty"] = empty);
(exports["either"] = either);
(exports["concat"] = concat);
(exports["choices"] = choices);
(exports["choicea"] = choicea);
(exports["choice"] = choice);
(exports["optional"] = optional);
(exports["expected"] = expected);
(exports["not"] = not);
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