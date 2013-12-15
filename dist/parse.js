/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "nu/stream", "seshat"], (function(require, exports, stream, seshat) {
    "use strict";
    var Tail, trampoline, ParserError, ParseError, MultipleError, UnknownError, UnexpectError, ExpectError,
            ParserState, Position, rec, Parser, RecParser, always, never, bind, eof, extract, getParserState,
            setParserState, modifyParserState, getState, setState, modifyState, getInput, setInput, getPosition,
            setPosition, fail, attempt, look, lookahead, next, sequences, sequencea, sequence, either, choices,
            choicea, choice, optional, expected, eager, binds, cons, append, enumerations, enumerationa,
            enumeration, many, many1, token, anyToken, memo, Memoer, exec, parseState, parseStream, parse,
            runState, runStream, run, testState, testStream, test;
    var stream = stream,
        stream = stream,
        NIL = stream["NIL"],
        first = stream["first"],
        isEmpty = stream["isEmpty"],
        rest = stream["rest"],
        foldl = stream["foldl"],
        reduceRight = stream["reduceRight"],
        foldr = stream["foldr"],
        seshat = seshat;
    var map = Function.prototype.call.bind(Array.prototype.map);
    var identity = (function(x) {
        return x;
    });
    var args = (function() {
        var args = arguments;
        return args;
    });
    var constant = (function(x) {
        return (function() {
            return x;
        });
    });
    var throwConstant = (function(err) {
        return (function() {
            throw err;
        });
    });
    var flip = (function(f) {
        return (function(x, y) {
            return f(y, x);
        });
    });
    var uniqueParserId = Math.random;
    (Tail = (function(p, state, m, cok, cerr, eok, eerr) {
        (this.p = p);
        (this.state = state);
        (this.m = m);
        (this.cok = cok);
        (this.cerr = cerr);
        (this.eok = eok);
        (this.eerr = eerr);
    }));
    (trampoline = (function(f) {
        var value = f;
        while ((value instanceof Tail))(value = value.p(value.state, value.m, value.cok, value.cerr,
            value.eok, value.eerr));
        return value;
    }));
    (Memoer = (function(memoer, frames) {
        (this.memoer = memoer);
        (this.frames = frames);
    }));
    (Memoer.empty = new(Memoer)(seshat.create((function(x, y) {
        return x.compare(y);
    }), (function(x, y) {
        return ((x.id === y.id) && ((x.state === y.state) || (x.state && x.state.eq(y.state))));
    })), []));
    (Memoer.pushWindow = (function(m, lower) {
        return new(Memoer)(m.memoer, [lower].concat(m.frames));
    }));
    (Memoer.popWindow = (function(m) {
        return new(Memoer)(((m.frames.length === 1) ? seshat.prune(m.memoer, m.frames[0]) : m.memoer),
            m.frames.slice(1));
    }));
    (Memoer.lookup = (function(m, pos, id) {
        return seshat.lookup(m.memoer, pos, id);
    }));
    (Memoer.update = (function(m, pos, id, val) {
        return new(Memoer)(seshat.update(m.memoer, pos, id, val), m.frames);
    }));
    (Position = (function(i) {
        (this.index = i);
    }));
    (Position.initial = new(Position)(0));
    (Position.prototype.toString = (function() {
        return ("" + this.index);
    }));
    (Position.prototype.increment = (function(tok) {
        return new(Position)((this.index + 1));
    }));
    (Position.prototype.compare = (function(pos) {
        return (this.index - pos.index);
    }));
    (ParserState = (function(input, position, userState) {
        (this.input = input);
        (this.position = position);
        (this.userState = userState);
    }));
    (ParserState.prototype.eq = (function(other) {
        return ((other && (this.input === other.input)) && (this.userState === other.userState));
    }));
    (ParserState.prototype.isEmpty = (function() {
        return isEmpty(this.input);
    }));
    (ParserState.prototype.first = (function() {
        return first(this.input);
    }));
    (ParserState.prototype.next = (function(x) {
        if (!this._next) {
            var s = new(ParserState)(rest(this.input), this.position.increment(x), this.userState);
            (this._next = (function(_, m, cok) {
                return cok(x, s, m);
            }));
        }
        return this._next;
    }));
    (ParserState.prototype.setInput = (function(input) {
        return new(ParserState)(input, this.position, this.userState);
    }));
    (ParserState.prototype.setPosition = (function(position) {
        return new(ParserState)(this.input, position, this.userState);
    }));
    (ParserState.prototype.setUserState = (function(userState) {
        return new(ParserState)(this.input, this.position, userState);
    }));
    (ParserError = (function(msg) {
        (this.message = msg);
    }));
    (ParserError.prototype = new(Error)());
    (ParserError.prototype.constructor = ParserError);
    (ParserError.prototype.name = "ParserError");
    (ParseError = (function(position, msg) {
        (this.position = position);
        (this._msg = msg);
    }));
    (ParseError.prototype = new(Error)());
    (ParseError.prototype.constructor = ParseError);
    (ParseError.prototype.name = "ParseError");
    (ParseError.prototype.toString = (function() {
        return ((this.name + ": ") + this.message);
    }));
    Object.defineProperties(ParseError.prototype, ({
        "message": ({
            "configurable": true,
            "get": (function() {
                return ((("At position:" + this.position) + " ") + this.errorMessage);
            })
        }),
        "errorMessage": ({
            "configurable": true,
            "get": (function() {
                return ((this._msg === undefined) ? "" : this._msg);
            })
        })
    }));
    (MultipleError = (function(position, errors) {
        ParseError.call(this, position);
        (this.errors = (errors || []));
    }));
    (MultipleError.prototype = new(ParseError)());
    (MultipleError.prototype.constructor = MultipleError);
    (MultipleError.prototype.name = "MultipleError");
    Object.defineProperty(MultipleError.prototype, "errorMessage", ({
        "get": (function() {
            return (("[" + map(this.errors, (function(x) {
                    return x.message;
                }))
                .join(", ")) + "]");
        })
    }));
    var ChoiceError = (function(position, pErr, qErr) {
        ParseError.call(this, position);
        (this._pErr = pErr);
        (this._qErr = qErr);
    });
    (ChoiceError.prototype = new(MultipleError)());
    (ChoiceError.prototype.constructor = MultipleError);
    (ChoiceError.prototype.name = "ChoiceError");
    Object.defineProperty(ChoiceError.prototype, "errors", ({
        "get": (function() {
            return [this._pErr].concat(this._qErr.errors);
        })
    }));
    (UnknownError = (function(position) {
        ParseError.call(this, position);
    }));
    (UnknownError.prototype = new(ParseError)());
    (UnknownError.prototype.constructor = UnknownError);
    (UnknownError.prototype.name = "UnknownError");
    Object.defineProperty(UnknownError.prototype, "errorMessage", ({
        "value": "unknown error"
    }));
    (UnexpectError = (function(position, unexpected) {
        ParseError.call(this, position);
        (this.unexpected = unexpected);
    }));
    (UnexpectError.prototype = new(ParseError)());
    (UnexpectError.prototype.constructor = UnexpectError);
    (UnexpectError.prototype.name = "UnexpectError");
    Object.defineProperty(UnexpectError.prototype, "errorMessage", ({
        "get": (function() {
            return ("Unexpected:" + this.unexpected);
        })
    }));
    (ExpectError = (function(position, expected, found) {
        ParseError.call(this, position);
        (this.expected = expected);
        (this.found = found);
    }));
    (ExpectError.prototype = new(ParseError)());
    (ExpectError.prototype.constructor = ExpectError);
    (ExpectError.prototype.name = "ExpectError");
    Object.defineProperty(ExpectError.prototype, "errorMessage", ({
        "get": (function() {
            return (("Expected:" + this.expected) + (this.found ? (" Found:" + this.found) : ""));
        })
    }));
    (rec = (function(def) {
        var value = def((function() {
            var args = arguments;
            return value.apply(this, args);
        }));
        return value;
    }));
    (Parser = (function(name, impl) {
        return (impl.hasOwnProperty("parserId") ? Parser(name, (function() {
            var args = arguments;
            return impl.apply(this, args);
        })) : Object.defineProperties(impl, ({
            "displayName": ({
                "value": name,
                "writable": false
            }),
            "parserId": ({
                "value": uniqueParserId(),
                "writable": false
            })
        })));
    }));
    (RecParser = (function(name, body) {
        return Parser(name, rec(body));
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
                return f(x)(state, m, cok, cerr, cok, cerr);
            }), cerr, (function(x, state, m) {
                return f(x)(state, m, cok, cerr, eok, eerr);
            }), eerr);
        });
    }));
    (modifyParserState = (function(f) {
        return (function MODIFY_PARSER_STATE(state, m, _, _0, eok, _1) {
            var newState = f(state);
            return eok(newState, newState, m);
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
    });
    var _fail = (function(e) {
        return bind(getPosition, (function(pos) {
            return never(e(pos));
        }));
    });
    (fail = (function(msg) {
        return (function() {
            {
                var e = (msg ? ParseError : UnknownError);
                return _fail((function(pos) {
                    return new(e)(pos, msg);
                }));
            }
        })
            .call(this);
    }));
    (eof = Parser("EOF", (function() {
            {
                var end = always(NIL);
                return bind(getParserState, (function(s) {
                    return (s.isEmpty() ? end : _fail((function(pos) {
                        return new(ExpectError)(pos, "end of input", s.first());
                    })));
                }));
            }
        })
        .call(this)));
    (attempt = (function(p) {
        return (function ATTEMPT(state, m, cok, cerr, eok, eerr) {
            var peerr = (function(x, s, m) {
                return eerr(x, s, Memoer.popWindow(m));
            });
            return new(Tail)(p, state, Memoer.pushWindow(m, state.position), (function(x, s, m) {
                return cok(x, s, Memoer.popWindow(m));
            }), peerr, (function(x, s, m) {
                return eok(x, s, Memoer.popWindow(m));
            }), peerr);
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
                var state = state,
                    position = state["position"];
                var peerr = (function(errFromP, _, mFromP) {
                    var qeerr = (function(errFromQ, _, mFromQ) {
                        return eerr(e(position, errFromP, errFromQ), state, mFromQ);
                    });
                    return new(Tail)(q, state, mFromP, cok, cerr, eok, qeerr);
                });
                return new(Tail)(p, state, m, cok, cerr, eok, peerr);
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
    var _end = always(NIL);
    var _optionalValueParser = optional.bind(null, NIL);
    var _joinParser = (function(joiner) {
        return (function(p1, p2) {
            return bind(p1, (function(v1) {
                return bind(p2, (function(v2) {
                    return always(joiner(v1, v2));
                }));
            }));
        });
    });
    (eager = (function() {
            {
                var toArray = (function(x) {
                    return always(stream.toArray(x));
                });
                return (function(p) {
                    return bind(p, toArray);
                });
            }
        })
        .call(this));
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
    (many = (function() {
            {
                var manyError = throwConstant(new(ParserError)(
                    "Many parser applied to a parser that accepts an empty string"));
                return (function(p) {
                    return (function() {
                        {
                            var safeP = (function(state, m, cok, cerr, eok, eerr) {
                                return new(Tail)(p, state, m, cok, cerr, manyError, eerr);
                            });
                            return rec((function(self) {
                                return _optionalValueParser(cons(safeP, self));
                            }));
                        }
                    })
                        .call(this);
                });
            }
        })
        .call(this));
    (many1 = (function(p) {
        return cons(p, many(p));
    }));
    (token = (function() {
            {
                var defaultErr = (function(pos, tok) {
                    return new(UnexpectError)(pos, ((tok === null) ? "end of input" : tok));
                });
                return (function(consume, onErr) {
                    return (function() {
                        {
                            var errorHandler = (onErr || defaultErr);
                            return (function TOKEN(state, m, cok, cerr, eok, eerr) {
                                var state = state,
                                    position = state["position"];
                                if (state.isEmpty()) {
                                    return eerr(errorHandler(position, null), state, m);
                                } else {
                                    var tok = state.first();
                                    return (consume(tok) ? new(Tail)(state.next(tok), state, m,
                                        cok, cerr, cok, cerr) : eerr(errorHandler(position,
                                        tok), state, m));
                                }
                            });
                        }
                    })
                        .call(this);
                });
            }
        })
        .call(this));
    (anyToken = Parser("Any Token", token(constant(true))));
    (memo = (function(p) {
        return (function() {
            {
                var id = (p.parserId || uniqueParserId());
                return (function(state, m, cok, cerr, eok, eerr) {
                    var state = state,
                        position = state["position"];
                    var key = ({
                        "id": id,
                        "state": state
                    });
                    var entry = Memoer.lookup(m, position, key);
                    if (entry) return new(Tail)(entry, state, m, cok, cerr, eok, eerr);
                    return new(Tail)(p, state, m, (function(x, pstate, pm) {
                        return cok(x, pstate, Memoer.update(pm, position, key, (
                            function(_, m, cok, _0, _1, _2) {
                                return cok(x, pstate, m);
                            })));
                    }), (function(x, pstate, pm) {
                        return cerr(x, pstate, Memoer.update(pm, position, key, (
                            function(_, m, _0, cerr, _1, _2) {
                                return cerr(x, pstate, m);
                            })));
                    }), (function(x, pstate, pm) {
                        return eok(x, pstate, Memoer.update(pm, position, key, (
                            function(_, m, _0, _1, eok, _2) {
                                return eok(x, pstate, m);
                            })));
                    }), (function(x, pstate, pm) {
                        return eerr(x, pstate, Memoer.update(pm, position, key, (
                            function(_, m, _0, _1, _2, eerr) {
                                return eerr(x, pstate, m);
                            })));
                    }));
                });
            }
        })
            .call(this);
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
    (runState = (function() {
            {
                var ok = (function(x) {
                    return x;
                }),
                    err = (function(x) {
                        throw x;
                    });
                return (function(p, state) {
                    return parseState(p, state, ok, err);
                });
            }
        })
        .call(this));
    (runStream = (function(p, s, ud) {
        return runState(p, new(ParserState)(s, Position.initial, ud));
    }));
    (run = (function(p, input, ud) {
        return runStream(p, stream.from(input), ud);
    }));
    (testState = (function() {
            {
                var ok = constant(true),
                    err = constant(false);
                return (function(p, state) {
                    return parseState(p, state, ok, err);
                });
            }
        })
        .call(this));
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
}))