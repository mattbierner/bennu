/*
 * THIS FILE IS AUTO GENERATED from 'lib/incremental.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "nu/stream"], (function(require, exports, __o, stream) {
    "use strict";
    var provide, provideString, finish, parseIncState, parseInc, runIncState, runInc, runManyState, runManyStream, runMany;
    var __o = __o,
        always = __o["always"],
        bind = __o["bind"],
        getParserState = __o["getParserState"],
        Memoer = __o["Memoer"],
        next = __o["next"],
        optional = __o["optional"],
        parseState = __o["parseState"],
        ParserState = __o["ParserState"],
        Position = __o["Position"],
        runState = __o["runState"],
        trampoline = __o["trampoline"],
        stream = stream,
        NIL = stream["end"],
        isEmpty = stream["isEmpty"],
        first = stream["first"],
        rest = stream["rest"]; {
            var Request = (function(chunk, state, k) {
                (this.chunk = chunk);
                (this.state = state);
                (this.k = k);
            });
            var Session = (function(done, k, chunks) {
                (this.done = done);
                (this.k = k);
                (this.chunks = chunks);
            });
            (Session.prototype.addChunk = (function(c) {
                return new(Session)(this.done, this.k, this.chunks.concat(c));
            }));
            (Session.prototype.hasChunk = (function(c) {
                return (c < this.chunks.length);
            }));
            (Session.prototype.getChunk = (function(c) {
                return this.chunks[c];
            }));
            var IncrementalState = (function(chunk, state) {
                (this.chunk = chunk);
                (this.state = state);
            });
            Object.defineProperties(IncrementalState, ({
                "input": ({
                    "get": (function() {
                        return this.state.input;
                    })
                }),
                "position": ({
                    "get": (function() {
                        return this.state.position;
                    })
                }),
                "userState": ({
                    "get": (function() {
                        return this.state.userState;
                    })
                })
            }));
            (IncrementalState.prototype.eq = (function(other) {
                return ((other && (other.chunk === this.chunk)) && other.state.eq(other.state));
            }));
            (IncrementalState.prototype.isEmpty = (function() {
                return this.state.isEmpty();
            }));
            (IncrementalState.prototype.first = (function() {
                return this.state.first();
            }));
            (IncrementalState.prototype.next = (function(x) {
                if (!this._next) {
                    var chunk = this.chunk;
                    if (isEmpty(rest(this.state.input))) {
                        (this._next = next(this.state.next(x), bind(getParserState, (function(innerState) {
                            return (function(_, m, cok) {
                                return new(Request)((chunk + 1), innerState, (function(i) {
                                    return cok(x, new(IncrementalState)((chunk + 1), innerState.setInput(i)), m);
                                }));
                            });
                        }))));
                    } else {
                        (this._next = next(this.state.next(x), bind(getParserState, (function(innerState) {
                            return (function() {
                                {
                                    var state = new(IncrementalState)(chunk, innerState); {
                                        return (function(_, m, cok) {
                                            return cok(x, state, m);
                                        });
                                    }
                                }
                            })();
                        }))));
                    }

                }

                return this._next;
            }));
            (IncrementalState.prototype.setInput = (function(input) {
                return new(IncrementalState)(this.chunk, this.state.setInput(input));
            }));
            (IncrementalState.prototype.setPosition = (function(position) {
                return new(IncrementalState)(this.chunk, this.state.setPosition(position));
            }));
            (IncrementalState.prototype.setUserState = (function(userState) {
                return new(IncrementalState)(this.chunk, this.state.setUserState(userState));
            }));
            (provide = (function(r, c) {
                if (r.done) return r;

                var r2 = r.addChunk(c);
                var result = trampoline(r2.k(c));
                while ((result instanceof Request)) {
                    if (!r2.hasChunk(result.chunk)) return new(Session)(false, (function(x) {
                        return result.k(x);
                    }), r2.chunks);

                    (result = trampoline(result.k(r2.getChunk(result.chunk))));
                }

                return result;
            }));
            (provideString = (function(r, input) {
                return provide(r, stream.from(input));
            }));
            (finish = (function(r) {
                return (r.done ? r.k() : finish(trampoline(r.k(NIL))));
            }));
            (parseIncState = (function(p, state, ok, err) {
                return (function() {
                    {
                        var pok = (function(x, s) {
                            return new(Session)(true, ok.bind(null, x, s));
                        }),
                            perr = (function(x, s) {
                                return new(Session)(true, err.bind(null, x, s));
                            }); {
                                return (state.isEmpty() ? new(Session)(false, (function(s) {
                                    return parseState(p, new(IncrementalState)(0, state.setInput(s)), pok, perr);
                                }), []) : provide(parseIncState(p, state.setInput(NIL), ok, err), state.input));
                        }
                    }
                })();
            }));
            (parseInc = (function(p, ud, ok, err) {
                return parseIncState(p, new(ParserState)(NIL, Position.initial, ud), ok, err);
            }));
            (runIncState = (function() {
                {
                    var ok = (function(x) {
                        return x;
                    }),
                        err = (function(x) {
                            throw x;
                        }); {
                            return (function(p, state) {
                                return parseIncState(p, state, ok, err);
                            });
                    }
                }
            })());
            (runInc = (function(p, ud) {
                return runIncState(p, new(ParserState)(NIL, Position.initial, ud));
            }));
            (runManyState = (function(p, state) {
                return (function() {
                    {
                        var manyP = optional(NIL, bind(p, (function(x, state, m) {
                            return always(stream.memoStream(x, runState.bind(null, manyP, state, m)));
                        }))); {
                            return runState(manyP, state);
                        }
                    }
                })();
            }));
            (runManyStream = (function(p, s, ud) {
                return runManyState(p, new(ParserState)(s, Position.initial, ud));
            }));
            (runMany = (function(p, input, ud) {
                return runManyStream(p, stream.from(input), ud);
            }));
    }
    (exports.provide = provide);
    (exports.provideString = provideString);
    (exports.finish = finish);
    (exports.parseIncState = parseIncState);
    (exports.parseInc = parseInc);
    (exports.runIncState = runIncState);
    (exports.runInc = runInc);
    (exports.runManyState = runManyState);
    (exports.runManyStream = runManyStream);
    (exports.runMany = runMany);
}))