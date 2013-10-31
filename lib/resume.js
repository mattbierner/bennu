/*
 * THIS FILE IS AUTO GENERATED from 'lib/resume.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "nu/stream"], (function(require, exports, __o, stream) {
    "use strict";
    var provide, provideString, finish, parseState, parse;
    var __o = __o,
        always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        choicea = __o["choicea"],
        getParserState = __o["getParserState"],
        exec = __o["exec"],
        ExpectError = __o["ExpectError"],
        Memoer = __o["Memoer"],
        next = __o["next"],
        Parser = __o["Parser"],
        ParserState = __o["ParserState"],
        Position = __o["Position"],
        token = __o["token"],
        stream = stream,
        NIL = stream["end"],
        isEmpty = stream["isEmpty"],
        first = stream["first"],
        rest = stream["rest"]; {
            var trampoline = (function(f) {
                var value = f;
                while ((value && value._next))(value = value[0].apply(undefined, value[1]));

                return value;
            });
            var Request = (function(chunk, state, k) {
                (this.chunk = chunk);
                (this.state = state);
                (this.k = k);
            });
            var Resumable = (function(done, chunk, state, k, chunks) {
                (this.done = done);
                (this.chunk = chunk);
                (this.state = state);
                (this.k = k);
                (this.chunks = chunks);
            });
            (Resumable.prototype.addChunk = (function(c) {
                return new(Resumable)(this.done, (this.chunk + 1), this.state, this.k, this.chunks.concat(c));
            }));
            var ResumableState = (function(chunk, state) {
                (this.chunk = chunk);
                (this.state = state);
            });
            Object.defineProperties(ResumableState, ({
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
            (ResumableState.prototype.eq = (function(other) {
                return ((other && (other.chunk === this.chunk)) && other.state.eq(other.state));
            }));
            (ResumableState.prototype.isEmpty = (function() {
                return this.state.isEmpty();
            }));
            (ResumableState.prototype.first = (function() {
                return this.state.first();
            }));
            (ResumableState.prototype.next = (function(x) {
                if (!this._next) {
                    var chunk = this.chunk;
                    var self = this;
                    if (isEmpty(rest(this.state.input))) {
                        return bind(next(self.state.next(x), getParserState), (function(s) {
                            return (function(_, m, cok) {
                                return new(Request)((chunk + 1), s, (function(i) {
                                    return cok(x, new(ResumableState)((chunk + 1), s.setInput(i)), m);
                                }));
                            });
                        }));
                    }

                    (this._next = bind(next(self.state.next(x), getParserState), (function(s) {
                        return (function(_, m, cok) {
                            return cok(x, new(ResumableState)(chunk, s), m);
                        });
                    })));
                }

                return this._next;
            }));
            (ResumableState.prototype.setInput = (function(input) {
                return new(ResumableState)(this.chunk, this.state.setInput(input));
            }));
            (ResumableState.prototype.setPosition = (function(position) {
                return new(ResumableState)(this.chunk, this.state.setPosition(position));
            }));
            (ResumableState.prototype.setUserState = (function(userState) {
                return new(ResumableState)(this.chunk, this.state.setUserState(userState));
            }));
            (provide = (function(r, c) {
                if (r.done) return r;

                var r2 = r.addChunk(c);
                var result = trampoline(r2.k(r2.state.setInput(c)));
                while ((result instanceof Request)) {
                    if ((result.chunk >= r2.chunks.length)) return new(Resumable)(false, r2.chunk, result.state, (function(x) {
                        return result.k(x.input);
                    }), r2.chunks);

                    (result = trampoline(result.k(r2.chunks[result.chunk])));
                }

                return result;
            }));
            (provideString = (function(r, s) {
                return provide(r, stream.from(s));
            }));
            (finish = (function(r) {
                return (!r.done ? finish(trampoline(r.k(r.state))) : r.k(r.state));
            }));
            (parseState = (function(p, state) {
                return new(Resumable)(false, 0, new(ResumableState)(0, state), (function(s) {
                    return (function() {
                        {
                            var ok = (function(x, s) {
                                return new(Resumable)(true, -1, s, (function() {
                                    return x;
                                }));
                            }),
                                err = (function(x, s) {
                                    return new(Resumable)(true, -1, s, (function() {
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
    }
    (exports.provide = provide);
    (exports.provideString = provideString);
    (exports.finish = finish);
    (exports.parseState = parseState);
    (exports.parse = parse);
}))