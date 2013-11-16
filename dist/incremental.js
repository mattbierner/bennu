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
        streamFrom = stream["from"],
        isEmpty = stream["isEmpty"],
        first = stream["first"],
        rest = stream["rest"],
        memoStream = stream["memoStream"];
    var Request = (function(chunk, k) {
        (this.chunk = chunk);
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
    Object.defineProperties(IncrementalState.prototype, ({
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
            (this._next = next(this.state.next(x), bind(getParserState, (function(innerState) {
                return (innerState.isEmpty() ? (function(_, m, cok) {
                    return new(Request)((chunk + 1), (function(i) {
                        return cok(x, new(IncrementalState)((chunk + 1), innerState.setInput(i)), m);
                    }));
                }) : (function() {
                    {
                        var state = new(IncrementalState)(chunk, innerState);
                        return (function(_, m, cok) {
                            return cok(x, state, m);
                        });
                    }
                })());
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
    var forceProvide = (function(r, c) {
        if (r.done) return r;

        var r2 = r.addChunk(c);
        var result = trampoline(r2.k(c));
        while (((result instanceof Request) && r2.hasChunk(result.chunk)))(result = trampoline(result.k(r2.getChunk(result.chunk))));

        return ((result instanceof Request) ? new(Session)(false, result.k, r2.chunks) : result);
    });
    (provide = (function(r, c) {
        return (isEmpty(c) ? r : forceProvide(r, c));
    }));
    (provideString = (function(r, input) {
        return provide(r, streamFrom(input));
    }));
    (finish = (function() {
        {
            var complete = (function(r) {
                return r.k();
            });
            return (function(r) {
                return complete(forceProvide(r, NIL));
            });
        }
    })());
    (parseIncState = (function(p, state, ok, err) {
        return (function() {
            {
                var pok = (function(x, s) {
                    return new(Session)(true, ok.bind(null, x, s));
                }),
                    perr = (function(x, s) {
                        return new(Session)(true, err.bind(null, x, s));
                    });
                return (state.isEmpty() ? new(Session)(false, (function(i) {
                    return parseState(p, new(IncrementalState)(0, state.setInput(i)), pok, perr);
                }), []) : provide(parseIncState(p, state.setInput(NIL), ok, err), state.input));
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
                });
            return (function(p, state) {
                return parseIncState(p, state, ok, err);
            });
        }
    })());
    (runInc = (function(p, ud) {
        return runIncState(p, new(ParserState)(NIL, Position.initial, ud));
    }));
    (runManyState = (function(p, state) {
        return (function() {
            {
                var manyP = optional(NIL, bind(p, (function(x, state, m) {
                    return always(memoStream(x, runState.bind(null, manyP, state, m)));
                })));
                return runState(manyP, state);
            }
        })();
    }));
    (runManyStream = (function(p, s, ud) {
        return runManyState(p, new(ParserState)(s, Position.initial, ud));
    }));
    (runMany = (function(p, input, ud) {
        return runManyStream(p, streamFrom(input), ud);
    }));
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