/*
 * THIS FILE IS AUTO GENERATED from 'lib/incremental.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "nu/stream"], (function(require, exports, __o, stream) {
    "use strict";
    var provide, provideString, finish, parseState, parse, runManyState, runManyStream, runMany;
    var __o = __o,
        always = __o["always"],
        bind = __o["bind"],
        getParserState = __o["getParserState"],
        exec = __o["exec"],
        Memoer = __o["Memoer"],
        next = __o["next"],
        optional = __o["optional"],
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
            var Resumable = (function(done, state, k, chunks) {
                (this.done = done);
                (this.state = state);
                (this.k = k);
                (this.chunks = chunks);
            });
            (Resumable.prototype.addChunk = (function(c) {
                return new(Resumable)(this.done, this.state, this.k, this.chunks.concat(c));
            }));
            (Resumable.prototype.hasChunk = (function(c) {
                return (c < this.chunks.length);
            }));
            (Resumable.prototype.getChunk = (function(c) {
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
                    var self = this;
                    if (isEmpty(rest(this.state.input))) {
                        return bind(next(self.state.next(x), getParserState), (function(s) {
                            return (function(_, m, cok) {
                                return new(Request)((chunk + 1), s, (function(i) {
                                    return cok(x, new(IncrementalState)((chunk + 1), s.setInput(i)), m);
                                }));
                            });
                        }));
                    }

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
                var result = trampoline(r2.k(r2.state.setInput(c)));
                while ((result instanceof Request)) {
                    if (!r2.hasChunk(result.chunk)) return new(Resumable)(false, result.state, (function(x) {
                        return result.k(x.input);
                    }), r2.chunks);

                    (result = trampoline(result.k(r2.getChunk(result.chunk))));
                }

                return result;
            }));
            (provideString = (function(r, input) {
                return provide(r, stream.from(input));
            }));
            (finish = (function(r) {
                return (!r.done ? finish(trampoline(r.k(r.state))) : r.k(r.state));
            }));
            (parseState = (function(p, state) {
                return new(Resumable)(false, new(IncrementalState)(0, state), (function(s) {
                    return (function() {
                        {
                            var ok = (function(x, s) {
                                return new(Resumable)(true, s, (function() {
                                    return x;
                                }));
                            }),
                                err = (function(x, s) {
                                    return new(Resumable)(true, s, (function() {
                                        throw x;
                                    }));
                                }); {
                                    return exec(p, s, Memoer.empty, ok, err, ok, err);
                            }
                        }
                    })();
                }), []);
            }));
            (parse = (function(p, ud) {
                return parseState(p, new(ParserState)(NIL, Position.initial, ud));
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
    (exports.parseState = parseState);
    (exports.parse = parse);
    (exports.runManyState = runManyState);
    (exports.runManyStream = runManyStream);
    (exports.runMany = runMany);
}))