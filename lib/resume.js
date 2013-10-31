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
        choicea = __o["choicea"],
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
            var State = (function(input, chunk, position, ud) {
                (this.input = input);
                (this.chunk = chunk);
                (this.position = position);
                (this.userState = ud);
            });
            (State.prototype.eq = (function(other) {
                return ((other && (this.input === other.input)) && (this.userState === other.userState));
            }));
            (State.prototype.isEmpty = (function() {
                return isEmpty(this.input);
            }));
            (State.prototype.first = (function() {
                return first(this.input);
            }));
            (State.prototype.next = (function(x) {
                if (!this._next) {
                    var chunk = this.chunk;
                    var s = new(State)(rest(this.input), chunk, this.position.increment(x), this.userState);
                    if (isEmpty(rest(this.input))) {
                        var s0 = new(State)(rest(this.input), (chunk + 1), this.position.increment(x), this.userState);
                        return (function(_, m, cok) {
                            return new(Request)((chunk + 1), s0, (function(s) {
                                return cok(x, s, m);
                            }));
                        });
                    }

                    (this._next = (function(_, m, cok) {
                        return cok(x, s, m);
                    }));
                }

                return this._next;
            }));
            (State.prototype.setInput = (function(input) {
                return new(State)(input, this.chunk, this.position, this.userState);
            }));
            (State.prototype.setPosition = (function(position) {
                return new(State)(this.input, this.chunk, position, this.userState);
            }));
            (State.prototype.setUserState = (function(userState) {
                return new(State)(this.input, this.chunk, this.position, userState);
            }));
            (provide = (function(r, c) {
                if (r.done) return r;

                var r2 = r.addChunk(c);
                var result = trampoline(r2.k(r2.state.setInput(c)));
                while ((result instanceof Request)) {
                    if ((result.chunk >= r2.chunks.length)) return new(Resumable)(false, r2.chunk, result.state, result.k, r2.chunks);

                    (result = trampoline(result.k(result.state.setInput(r2.chunks[result.chunk]))));
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
                return new(Resumable)(false, 0, state, (function(s) {
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
                return parseState(p, new(State)(NIL, 0, Position.initial, ud));
            }));
    }
    (exports.provide = provide);
    (exports.provideString = provideString);
    (exports.finish = finish);
    (exports.parseState = parseState);
    (exports.parse = parse);
}))