/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "nu-stream/stream", "seshet"], (function(require, exports, stream, seshat) {
    "use strict";
    var NIL = stream["NIL"],
        first = stream["first"],
        isEmpty = stream["isEmpty"],
        rest = stream["rest"],
        foldl = stream["foldl"],
        reduceRight = stream["reduceRight"],
        foldr = stream["foldr"],
        Tail, trampoline, ParserError, ParseError, MultipleError, UnknownError, UnexpectError, ExpectError,
            ParserState, Position, rec, Parser, RecParser, always, never, bind, eof, extract, getParserState,
            setParserState, modifyParserState, getState, setState, modifyState, getInput, setInput, getPosition,
            setPosition, fail, attempt, look, lookahead, next, sequences, sequencea, sequence, either, choices,
            choicea, choice, optional, expected, eager, binds, cons, append, enumerations, enumerationa,
            enumeration, many, many1, token, anyToken, memo, Memoer, exec, parseState, parseStream, parse,
            runState, runStream, run, testState, testStream, test, map = Function.prototype.call.bind(Array.prototype
                .map),
        identity = (function(x) {
            return x;
        }),
        args = (function() {
            var args = arguments;
            return args;
        }),
        constant = (function(x) {
            return (function() {
                return x;
            });
        }),
        throwConstant = (function(err) {
            return (function() {
                throw err;
            });
        }),
        flip = (function(f) {
            return (function(x, y) {
                return f(y, x);
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
        while ((value instanceof Tail))(value = value.p(value.state, value.m, value.cok, value.cerr,
            value.eok, value.eerr));
        return value;
    }));
    (Memoer = (function(memoer, frames) {
        var self = this;
        (self.memoer = memoer);
        (self.frames = frames);
    }));
    (Memoer.empty = new(Memoer)(seshat.create((function(x, y) {
        return x.compare(y);
    }), (function(x, y) {
        return ((x.id === y.id) && ((x.state === y.state) || (x.state && x.state.eq(y.state))));
    })), NIL));
    (Memoer.pushWindow = (function(m, lower) {
        return new(Memoer)(m.memoer, stream.cons(lower, m.frames));
    }));
    (Memoer.popWindow = (function(m) {
        var frames = m["frames"];
        return (function() {
            var r = rest(frames);
            return new(Memoer)((isEmpty(r) ? seshat.prune(m.memoer, first(frames)) : m.memoer), r);
        })();
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
            (self._next = (function(_, m, cok) {
                return cok(x, s, m);
            }));
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
        (self._msg = msg);
    }));
    (ParseError.prototype = new(Error)());
    (ParseError.prototype.constructor = ParseError);
    (ParseError.prototype.name = "ParseError");
    (ParseError.prototype.toString = (function() {
        var self = this;
        return ((self.name + ": ") + self.message);
    }));
    Object.defineProperties(ParseError.prototype, ({
        "message": ({
            "configurable": true,
            "get": (function() {
                var self = this;
                return ((("At position:" + self.position) + " ") + self.errorMessage);
            })
        }),
        "errorMessage": ({
            "configurable": true,
            "get": (function() {
                var self = this;
                return ((self._msg === undefined) ? "" : self._msg);
            })
        })
    }));
    (MultipleError = (function(position, errors) {
        var self = this;
        ParseError.call(self, position);
        (self.errors = (errors || []));
    }));
    (MultipleError.prototype = new(ParseError)());
    (MultipleError.prototype.constructor = MultipleError);
    (MultipleError.prototype.name = "MultipleError");
    Object.defineProperty(MultipleError.prototype, "errorMessage", ({
        "get": (function() {
            var self = this;
            return (("[" + map(self.errors, (function(x) {
                    return x.message;
                }))
                .join(", ")) + "]");
        })
    }));
    var ChoiceError = (function(position, pErr, qErr) {
        var self = this;
        ParseError.call(self, position);
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
        ParseError.call(self, position);
    }));
    (UnknownError.prototype = new(ParseError)());
    (UnknownError.prototype.constructor = UnknownError);
    (UnknownError.prototype.name = "UnknownError");
    Object.defineProperty(UnknownError.prototype, "errorMessage", ({
        "value": "unknown error"
    }));
    (UnexpectError = (function(position, unexpected) {
        var self = this;
        ParseError.call(self, position);
        (self.unexpected = unexpected);
    }));
    (UnexpectError.prototype = new(ParseError)());
    (UnexpectError.prototype.constructor = UnexpectError);
    (UnexpectError.prototype.name = "UnexpectError");
    Object.defineProperty(UnexpectError.prototype, "errorMessage", ({
        "get": (function() {
            var self = this;
            return ("Unexpected:" + self.unexpected);
        })
    }));
    (ExpectError = (function(position, expected, found) {
        var self = this;
        ParseError.call(self, position);
        (self.expected = expected);
        (self.found = found);
    }));
    (ExpectError.prototype = new(ParseError)());
    (ExpectError.prototype.constructor = ExpectError);
    (ExpectError.prototype.name = "ExpectError");
    Object.defineProperty(ExpectError.prototype, "errorMessage", ({
        "get": (function() {
            var self = this;
            return (("Expected:" + self.expected) + (self.found ? (" Found:" + self.found) : ""));
        })
    }));
    (rec = (function(def) {
        var value = def((function() {
            var args = arguments;
            return value.apply(undefined, args);
        }));
        return value;
    }));
    (Parser = (function(name, p) {
        return (p.hasOwnProperty("displayName") ? Parser(name, (function() {
            var args = arguments;
            return p.apply(undefined, args);
        })) : Object.defineProperty(p, "displayName", ({
            "value": name,
            "writable": false
        })));
    }));
    (RecParser = (function(name, p) {
        return Parser(name, rec(p));
    }));
    (always = (function(x) {
        return (function ALWAYS(state, m, _, _0, eok, _1) {
            return eok(x, state, m);
        });
    }));
    (never = (function(x) {
        return (function NEVER(state, m, _, _0, _1, eerr) {
            return eerr(x, state, m);
        });
    }));
    (bind = (function(p, f) {
        return (function BIND(state, m, cok, cerr, eok, eerr) {
            return new(Tail)(p, state, m, (function(x, state, m) {
                return new(Tail)(f(x), state, m, cok, cerr, cok, cerr);
            }), cerr, (function(x, state, m) {
                return new(Tail)(f(x), state, m, cok, cerr, eok, eerr);
            }), eerr);
        });
    }));
    (modifyParserState = (function(f) {
        return (function MODIFY_PARSER_STATE(state, m, _, _0, eok, _1) {
            return (function() {
                var newState = f(state);
                return eok(newState, newState, m);
            })();
        });
    }));
    (getParserState = Parser("Get Parser State", modifyParserState(identity)));
    (setParserState = (function(s) {
        return modifyParserState(constant(s));
    }));
    (extract = (function(f) {
        return (function EXTRACT(state, m, _, _0, eok, _1) {
            return eok(f(state), state, m);
        });
    }));
    (modifyState = (function(f) {
        return modifyParserState((function(state) {
            return state.setUserState(f(state.userState));
        }));
    }));
    (getState = Parser("Get State", extract((function(s) {
        return s.userState;
    }))));
    (setState = (function(s) {
        return modifyState(constant(s));
    }));
    (getPosition = Parser("Get Position", extract((function(s) {
        return s.position;
    }))));
    (setPosition = (function(position) {
        return modifyParserState((function(s) {
            return s.setPosition(position);
        }));
    }));
    (getInput = Parser("Get Input", extract((function(s) {
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
        return (function() {
            var e = (msg ? ParseError : UnknownError);
            return _fail((function(pos) {
                return new(e)(pos, msg);
            }));
        })();
    }));
    (eof = Parser("EOF", (function() {
        var end = always(NIL);
        return bind(getParserState, (function(s) {
            return (s.isEmpty() ? end : _fail((function(pos) {
                return new(ExpectError)(pos, "end of input", s.first());
            })));
        }));
    })()));
    (attempt = (function(p) {
        return (function ATTEMPT(state, m, cok, cerr, eok, eerr) {
            return (function() {
                var peerr = (function(x, s, m) {
                    return eerr(x, s, Memoer.popWindow(m));
                });
                return new(Tail)(p, state, Memoer.pushWindow(m, state.position), (function(x, s,
                    m) {
                    return cok(x, s, Memoer.popWindow(m));
                }), peerr, (function(x, s, m) {
                    return eok(x, s, Memoer.popWindow(m));
                }), peerr);
            })();
        });
    }));
    var cnothing = (function(p) {
        return (function LOOK(state, m, cok, cerr, eok, eerr) {
            return new(Tail)(p, state, m, eok, cerr, eok, eerr);
        });
    });
    (look = (function(p) {
        return cnothing(bind(getParserState, (function(state) {
            return bind(p, (function(x) {
                return next(setParserState(state), always(x));
            }));
        })));
    }));
    (lookahead = (function(p) {
        return cnothing(_binary(getInput, getPosition, (function(input, pos) {
            return bind(p, (function(x) {
                return sequence(setPosition(pos), setInput(input), always(x));
            }));
        })));
    }));
    (next = (function(p, q) {
        return bind(p, constant(q));
    }));
    (sequences = reduceRight.bind(null, flip(next)));
    (sequencea = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(sequences, stream.from));
    (sequence = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(sequencea, args));
    var _either = (function(e) {
        return (function(p, q) {
            return (function EITHER(state, m, cok, cerr, eok, eerr) {
                var position = state["position"];
                return (function() {
                    var peerr = (function(errFromP, _, mFromP) {
                        return (function() {
                            var qeerr = (function(errFromQ, _, mFromQ) {
                                return eerr(e(position, errFromP, errFromQ), state,
                                    mFromQ);
                            });
                            return new(Tail)(q, state, mFromP, cok, cerr, eok, qeerr);
                        })();
                    });
                    return new(Tail)(p, state, m, cok, cerr, eok, peerr);
                })();
            });
        });
    });
    (either = _either((function(pos, pErr, qErr) {
        return new(MultipleError)(pos, [pErr, qErr]);
    })));
    (choices = foldr.bind(null, flip(_either((function(pos, pErr, qErr) {
        return new(ChoiceError)(pos, pErr, qErr);
    }))), bind(getPosition, (function(pos) {
        return never(new(MultipleError)(pos, []));
    }))));
    (choicea = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(choices, stream.from));
    (choice = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(choicea, args));
    (optional = (function(x, p) {
        return either(p, always(x));
    }));
    (expected = (function(expect, p) {
        return (function EXPECTED(state, m, cok, cerr, eok, eerr) {
            return p(state, m, cok, cerr, eok, (function(x, state, m) {
                return eerr(new(ExpectError)(state.position, expect), state, m);
            }));
        });
    }));
    var _end = always(NIL),
        _optionalValueParser = optional.bind(null, NIL),
        _joinParser = (function(joiner) {
            return (function(p1, p2) {
                return bind(p1, (function(v1) {
                    return bind(p2, (function(v2) {
                        return always(joiner(v1, v2));
                    }));
                }));
            });
        }),
        toArray = (function(x) {
            return always(stream.toArray(x));
        });
    (eager = (function(p) {
        return bind(p, toArray);
    }));
    (binds = (function(p, f) {
        return bind(eager(p), (function(x) {
            return f.apply(undefined, x);
        }));
    }));
    (cons = _joinParser(stream.cons));
    (append = _joinParser(stream.append));
    (enumerations = foldr.bind(null, flip(cons), _end));
    (enumerationa = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(enumerations, stream.from));
    (enumeration = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(enumerationa, args));
    var manyError = throwConstant(new(ParserError)(
        "Many parser applied to a parser that accepts an empty string"));
    (many = (function(p) {
        return (function() {
            var safeP = (function(state, m, cok, cerr, eok, eerr) {
                return new(Tail)(p, state, m, cok, cerr, manyError, eerr);
            });
            return rec((function(self) {
                return _optionalValueParser(cons(safeP, self));
            }));
        })();
    }));
    (many1 = (function(p) {
        return cons(p, many(p));
    }));
    var defaultErr = (function(pos, tok) {
        return new(UnexpectError)(pos, ((tok === null) ? "end of input" : tok));
    });
    (token = (function(consume, onErr) {
        return (function() {
            var errorHandler = (onErr || defaultErr);
            return (function TOKEN(state, m, cok, cerr, eok, eerr) {
                var position = state["position"];
                if (state.isEmpty()) {
                    return eerr(errorHandler(position, null), state, m);
                } else {
                    var tok = state.first();
                    if (consume(tok)) {
                        var pcok = (function(x, s, m) {
                            var position = s["position"];
                            return cok(x, s, Memoer.prune(m, position));
                        });
                        return new(Tail)(state.next(tok), state, m, pcok, cerr, pcok, cerr);
                    }
                    return eerr(errorHandler(position, tok), state, m);
                }
            });
        })();
    }));
    (anyToken = Parser("Any Token", token(constant(true))));
    (memo = (function(p) {
        return (function(state, m, cok, cerr, eok, eerr) {
            var position = state["position"],
                key = ({
                    "id": p,
                    "state": state
                }),
                entry = Memoer.lookup(m, position, key);
            if (entry) {
                switch (entry[0]) {
                    case "cok":
                        return cok(entry[1], entry[2], m);
                    case "ceerr":
                        return cerr(entry[1], entry[2], m);
                    case "eok":
                        return eok(entry[1], entry[2], m);
                    case "eerr":
                        return eerr(entry[1], entry[2], m);
                }
            }
            return new(Tail)(p, state, m, (function(x, pstate, pm) {
                return cok(x, pstate, Memoer.update(pm, position, key, ["cok", x, pstate]));
            }), (function(x, pstate, pm) {
                return cerr(x, pstate, Memoer.update(pm, position, key, ["cerr", x, pstate]));
            }), (function(x, pstate, pm) {
                return eok(x, pstate, Memoer.update(pm, position, key, ["eok", x, pstate]));
            }), (function(x, pstate, pm) {
                return eerr(x, pstate, Memoer.update(pm, position, key, ["eerr", x, pstate]));
            }));
        });
    }));
    (exec = (function(p, state, m, cok, cerr, eok, eerr) {
        return trampoline(p(state, m, cok, cerr, eok, eerr));
    }));
    (parseState = (function(p, state, ok, err) {
        return exec(p, state, Memoer.empty, ok, err, ok, err);
    }));
    (parseStream = (function(p, s, ud, ok, err) {
        return parseState(p, new(ParserState)(s, Position.initial, ud), ok, err);
    }));
    (parse = (function(p, input, ud, ok, err) {
        return parseStream(p, stream.from(input), ud, ok, err);
    }));
    var ok = identity,
        err = (function(x) {
            throw x;
        });
    (runState = (function(p, state) {
        return parseState(p, state, ok, err);
    }));
    (runStream = (function(p, s, ud) {
        return runState(p, new(ParserState)(s, Position.initial, ud));
    }));
    (run = (function(p, input, ud) {
        return runStream(p, stream.from(input), ud);
    }));
    var ok0 = constant(true),
        err0 = constant(false);
    (testState = (function(p, state) {
        return parseState(p, state, ok0, err0);
    }));
    (testStream = (function(p, s, ud) {
        return testState(p, new(ParserState)(s, Position.initial, ud));
    }));
    (test = (function(p, input, ud) {
        return testStream(p, stream.from(input), ud);
    }));
    (exports.Tail = Tail);
    (exports.trampoline = trampoline);
    (exports.ParserError = ParserError);
    (exports.ParseError = ParseError);
    (exports.MultipleError = MultipleError);
    (exports.UnknownError = UnknownError);
    (exports.UnexpectError = UnexpectError);
    (exports.ExpectError = ExpectError);
    (exports.ParserState = ParserState);
    (exports.Position = Position);
    (exports.rec = rec);
    (exports.Parser = Parser);
    (exports.RecParser = RecParser);
    (exports.always = always);
    (exports.never = never);
    (exports.bind = bind);
    (exports.eof = eof);
    (exports.extract = extract);
    (exports.getParserState = getParserState);
    (exports.setParserState = setParserState);
    (exports.modifyParserState = modifyParserState);
    (exports.getState = getState);
    (exports.setState = setState);
    (exports.modifyState = modifyState);
    (exports.getInput = getInput);
    (exports.setInput = setInput);
    (exports.getPosition = getPosition);
    (exports.setPosition = setPosition);
    (exports.fail = fail);
    (exports.attempt = attempt);
    (exports.look = look);
    (exports.lookahead = lookahead);
    (exports.next = next);
    (exports.sequences = sequences);
    (exports.sequencea = sequencea);
    (exports.sequence = sequence);
    (exports.either = either);
    (exports.choices = choices);
    (exports.choicea = choicea);
    (exports.choice = choice);
    (exports.optional = optional);
    (exports.expected = expected);
    (exports.eager = eager);
    (exports.binds = binds);
    (exports.cons = cons);
    (exports.append = append);
    (exports.enumerations = enumerations);
    (exports.enumerationa = enumerationa);
    (exports.enumeration = enumeration);
    (exports.many = many);
    (exports.many1 = many1);
    (exports.token = token);
    (exports.anyToken = anyToken);
    (exports.memo = memo);
    (exports.Memoer = Memoer);
    (exports.exec = exec);
    (exports.parseState = parseState);
    (exports.parseStream = parseStream);
    (exports.parse = parse);
    (exports.runState = runState);
    (exports.runStream = runStream);
    (exports.run = run);
    (exports.testState = testState);
    (exports.testStream = testStream);
    (exports.test = test);
}));