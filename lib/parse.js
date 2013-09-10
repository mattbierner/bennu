/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse.kep'
 * DO NOT EDIT
*/
;
define(["nu/stream", "seshat"], function(stream, seshat) {
    "use strict";
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);
    var curry = function(f) {
        return f.bind.apply(f, arguments);
    }
    ;
    var identity = function(x) {
        return x;
    }
    ;
    var constant = function(x) {
        return function() {
            return x;
        }
        ;
    }
    ;
    var throwConstant = function(err) {
        return function() {
            throw err;
        }
        ;
    }
    ;
    var eq = function(x, y) {
        return (x === y);
    }
    ;
    var uniqueParserId = Math.random;
    var cont = function(f, args) {
        var c = [f, args];
        (c._next = true);
        return c;
    }
    ;
    var trampoline = function(f) {
        var value = f;
        while((value && value._next))(value = value[0].apply(undefined, value[1]));
        
        return value;
    }
    ;
    var Memoer = function(memoer, frames) {
        (this.memoer = memoer);
        (this.frames = frames);
    }
    ;
    (Memoer.create = function(compare) {
        return new Memoer(seshat.create(compare), []);
    }
    );
    (Memoer.pushWindow = function(m, lower) {
        return new Memoer(m.memoer, [lower].concat(m.frames));
    }
    );
    (Memoer.popWindow = function(m) {
        return new Memoer(((m.frames.length === 1) ? seshat.prune(m.memoer, m.frames[0]) : m.memoer), m.frames.slice(1));
    }
    );
    (Memoer.lookup = function(m, pos, id) {
        return seshat.lookup(m.memoer, pos, id);
    }
    );
    (Memoer.update = function(m, pos, id, val) {
        return new Memoer(seshat.update(m.memoer, pos, id, val), m.frames);
    }
    );
    var Position = function(i) {
        (this.index = i);
    }
    ;
    (Position.initial = new Position(0));
    (Position.prototype.toString = function() {
        return ("" + this.index);
    }
    );
    (Position.prototype.increment = function(tok) {
        return new Position((this.index + 1));
    }
    );
    (Position.prototype.compare = function(pos) {
        return (this.index - pos.index);
    }
    );
    var ParserState = function(input, position, userState) {
        (this.input = input);
        (this.position = position);
        (this.userState = userState);
    }
    ;
    (ParserState.prototype.next = function(tok) {
        if (! this._next){
            (this._next = new ParserState(stream.rest(this.input), this.position.increment(tok), this.userState));
        }
        
        return this._next;
    }
    );
    (ParserState.prototype.setInput = function(input) {
        return new ParserState(input, this.position, this.userState);
    }
    );
    (ParserState.prototype.setPosition = function(position) {
        return new ParserState(this.input, position, this.userState);
    }
    );
    (ParserState.prototype.setUserState = function(userState) {
        return new ParserState(this.input, this.position, userState);
    }
    );
    var ParserError = function(msg) {
        (this.message = msg);
    }
    ;
    (ParserError.prototype = new Error());
    (ParserError.prototype.constructor = ParserError);
    (ParserError.prototype.name = "ParserError");
    var ParseError = function(position, msg) {
        (this.position = position);
        (this._msg = msg);
    }
    ;
    (ParseError.prototype = new Error());
    (ParseError.prototype.constructor = ParseError);
    (ParseError.prototype.name = "ParseError");
    Object.defineProperties(ParseError.prototype, ({
        "message": ({
            "configurable": true,
            "get": function() {
                return ((("At position:" + this.position) + " ") + this.errorMessage);
            }
            
        }),
        "errorMessage": ({
            "configurable": true,
            "get": function() {
                return ((this._msg === undefined) ? "" : this._msg);
            }
            
        })
    }));
    var MultipleError = function(position, errors) {
        ParseError.call(this, position);
        (this.errors = (errors || []));
    }
    ;
    (MultipleError.prototype = new ParseError());
    (MultipleError.prototype.constructor = MultipleError);
    (MultipleError.prototype.name = "MultipleError");
    Object.defineProperty(MultipleError.prototype, "errorMessage", ({
        "get": function() {
            return (("[" + map(this.errors, function(x) {
                return x.message;
            }
            ).join(", ")) + "]");
        }
        
    }));
    var ChoiceError = function(position, pErr, qErr) {
        ParseError.call(this, position);
        (this._pErr = pErr);
        (this._qErr = qErr);
    }
    ;
    (ChoiceError.prototype = new MultipleError());
    (ChoiceError.prototype.constructor = MultipleError);
    (ChoiceError.prototype.name = "ChoiceError");
    Object.defineProperty(ChoiceError.prototype, "errors", ({
        "get": function() {
            return [this._pErr].concat(this._qErr.errors);
        }
        
    }));
    var UnknownError = function(position) {
        ParseError.call(this, position);
    }
    ;
    (UnknownError.prototype = new ParseError());
    (UnknownError.prototype.constructor = UnknownError);
    (UnknownError.prototype.name = "UnknownError");
    Object.defineProperty(UnknownError.prototype, "errorMessage", ({
        "value": "unknown error"
    }));
    var UnexpectError = function(position, unexpected) {
        ParseError.call(this, position);
        (this.unexpected = unexpected);
    }
    ;
    (UnexpectError.prototype = new ParseError());
    (UnexpectError.prototype.constructor = UnexpectError);
    (UnexpectError.prototype.name = "UnexpectError");
    Object.defineProperty(UnexpectError.prototype, "errorMessage", ({
        "get": function() {
            return ("Unexpected:" + this.unexpected);
        }
        
    }));
    var ExpectError = function(position, expected, found) {
        ParseError.call(this, position);
        (this.expected = expected);
        (this.found = found);
    }
    ;
    (ExpectError.prototype = new ParseError());
    (ExpectError.prototype.constructor = ExpectError);
    (ExpectError.prototype.name = "ExpectError");
    Object.defineProperty(ExpectError.prototype, "errorMessage", ({
        "get": function() {
            return (("Expected:" + this.expected) + (this.found ? (" Found:" + this.found) : ""));
        }
        
    }));
    var rec = function(def) {
        var value = def(function() {
            return value.apply(this, arguments);
        }
        );
        return value;
    }
    ;
    var Parser = function(name, impl) {
        return (impl.hasOwnProperty("parserId") ? Parser(name, function() {
            return impl.apply(this, arguments);
        }
        ) : Object.defineProperties(impl, ({
            "displayName": ({
                "value": name,
                "writable": false
            }),
            "parserId": ({
                "value": uniqueParserId(),
                "writable": false
            })
        })));
    }
    ;
    var RecParser = function(name, body) {
        return Parser(name, rec(body));
    }
    ;
    var always = function(x) {
        return function ALWAYS_PARSER(state, m, cok, cerr, eok) {
            return eok(x, state, m);
        }
        ;
    }
    ;
    var never = function(x) {
        return function NEVER_PARSER(state, m, cok, cerr, eok, eerr) {
            return eerr(x, state, m);
        }
        ;
    }
    ;
    var bind = function(p, f) {
        return function BIND_PARSER(state, m, cok, cerr, eok, eerr) {
            return cont(p, [state, m, function(x, state, m) {
                return cont(f(x, state, m), [state, m, cok, cerr, cok, cerr]);
            }
            , cerr, function(x, state, m) {
                return cont(f(x, state, m), [state, m, cok, cerr, eok, eerr]);
            }
            , eerr]);
        }
        ;
    }
    ;
    var modifyParserState = function(f) {
        return function MODIFY_PARSER_STATE(state, m, cok, cerr, eok) {
            var newState = f(state);
            return eok(newState, newState, m);
        }
        ;
    }
    ;
    var getParserState = Parser("Get Parser State", modifyParserState(identity));
    var setParserState = function(s) {
        return modifyParserState(constant(s));
    }
    ;
    var extract = function(f) {
        return function EXTRACT(state, m, cok, cerr, eok) {
            return eok(f(state), state, m);
        }
        ;
    }
    ;
    var modifyState = function(f) {
        return modifyParserState(function(state) {
            return state.setUserState(f(state.userState));
        }
        );
    }
    ;
    var getState = Parser("Get State", extract(function(s) {
        return s.userState;
    }
    ));
    var setState = function(s) {
        return modifyState(constant(s));
    }
    ;
    var getPosition = Parser("Get Position", extract(function(s) {
        return s.position;
    }
    ));
    var setPosition = function(position) {
        return modifyParserState(function(s) {
            return s.setPosition(position);
        }
        );
    }
    ;
    var getInput = Parser("Get Input", extract(function(s) {
        return s.input;
    }
    ));
    var setInput = function(input) {
        return modifyParserState(function(s) {
            return s.setInput(input);
        }
        );
    }
    ;
    var _fail = function(e) {
        return bind(getPosition, function(pos) {
            return never(e(pos));
        }
        );
    }
    ;
    var fail = function(msg) {
        return function(e) {
            return _fail(function(pos) {
                return new e(pos, msg);
            }
            );
        }
        ((msg ? ParseError : UnknownError));
    }
    ;
    var eof = function(end) {
        return Parser("EOF", bind(getInput, function(input) {
            return (stream.isEmpty(input) ? end : _fail(function(pos) {
                return new ExpectError(pos, "end of input", stream.first(input));
            }
            ));
        }
        ));
    }
    (always(stream.end));
    var attempt = function(p) {
        return function ATTEMPT_PARSER(state, m, cok, cerr, eok, eerr) {
            return cont(p, [state, Memoer.pushWindow(m, state.position), function(x, s, m) {
                return cok(x, s, Memoer.popWindow(m));
            }
            , function(x, s, m) {
                return eerr(x, s, Memoer.popWindow(m));
            }
            , function(x, s, m) {
                return eok(x, s, Memoer.popWindow(m));
            }
            , function(x, s, m) {
                return eerr(x, s, Memoer.popWindow(m));
            }
            ]);
        }
        ;
    }
    ;
    var lookahead = function(p) {
        return function LOOKAHEAD_PARSER(state, m, cok, cerr, eok, eerr) {
            var ok = function(item, _, m) {
                return eok(item, state, m);
            }
            ;
            return cont(p, [state, m, ok, cerr, eok, eerr]);
        }
        ;
    }
    ;
    var next = function(p, q) {
        return bind(p, constant(q));
    }
    ;
    var sequencea = function(reducer) {
        return function(arr) {
            return reduceRight(arr, reducer);
        }
        ;
    }
    (function reducer(p, q) {
        return next(q, p);
    }
    );
    var sequence = function() {
        return sequencea(arguments);
    }
    ;
    var _either = function(e) {
        return function(p, q) {
            return function EITHER_PARSER(state, m, cok, cerr, eok, eerr) {
                var pos = state.position;
                var peerr = function(errFromP, _, mFromP) {
                    var qeerr = function(errFromQ, _, mFromQ) {
                        return eerr(e(pos, errFromP, errFromQ), state, mFromQ);
                    }
                    ;
                    return cont(q, [state, mFromP, cok, cerr, eok, qeerr]);
                }
                ;
                return cont(p, [state, m, cok, cerr, eok, peerr]);
            }
            ;
        }
        ;
    }
    ;
    var either = _either(function(pos, pErr, qErr) {
        return new MultipleError(pos, [pErr, qErr]);
    }
    );
    var choicea = function(either) {
        return function(reducer) {
            return function(end) {
                return function(arr) {
                    if (! arr.length)throw new ParserError("choice called no parsers");
                    
                    return reduceRight(arr, reducer, end);
                }
                ;
            }
            (bind(getPosition, function(pos) {
                return never(new MultipleError(pos, []));
            }
            ));
        }
        (function reducer(p, c) {
            return either(c, p);
        }
        );
    }
    (_either(function(pos, pErr, qErr) {
        return new ChoiceError(pos, pErr, qErr);
    }
    ));
    var choice = function() {
        return choicea(arguments);
    }
    ;
    var optional = function(x, p) {
        return either(p, always(x));
    }
    ;
    var expected = function(expect, p) {
        return function EXPECTED_PARSER(state, m, cok, cerr, eok, eerr) {
            return p(state, m, cok, cerr, eok, function(x, state, m) {
                return eerr(new ExpectError(state.position, expect), state, m);
            }
            );
        }
        ;
    }
    ;
    var _end = always(stream.end);
    var _optionalValueParser = curry(optional, stream.end);
    var _joinParser = function(joiner) {
        return function(p1, p2) {
            return bind(p1, function(v1) {
                return bind(p2, function(v2) {
                    return always(joiner(v1, v2));
                }
                );
            }
            );
        }
        ;
    }
    ;
    var eager = function(toArray) {
        return function(p) {
            return bind(p, toArray);
        }
        ;
    }
    (function toArray(x) {
        return always(stream.toArray(x));
    }
    );
    var binds = function(p, f) {
        return bind(eager(p), function(x) {
            return f.apply(undefined, x);
        }
        );
    }
    ;
    var cons = _joinParser(stream.cons);
    var append = _joinParser(stream.append);
    var enumerationa = function(reducer) {
        return function(arr) {
            return reduceRight(arr, reducer, _end);
        }
        ;
    }
    (function reducer(p, q) {
        return cons(q, p);
    }
    );
    var enumeration = function() {
        return enumerationa(arguments);
    }
    ;
    var many = function(manyError) {
        return function MANY_PARSER(p) {
            var safeP = function(state, m, cok, cerr, eok, eerr) {
                return cont(p, [state, m, cok, cerr, manyError, eerr]);
            }
            ;
            return rec(function(self) {
                return _optionalValueParser(cons(safeP, self));
            }
            );
        }
        ;
    }
    (throwConstant(new ParserError("Many parser applied to a parser that accepts an empty string")));
    var many1 = function(p) {
        return cons(p, many(p));
    }
    ;
    var token = function(defaultErr) {
        return function(consume, onErr) {
            var errorHandler = (onErr || defaultErr);
            return function TOKEN_PARSER(state, m, cok, cerr, eok, eerr) {
                var pos = state["position"],input = state["input"];
                if (! input){
                    return eerr(errorHandler(pos, null), state, m);
                }
                else {
                    var tok = stream.first(input);
                    return (consume(tok) ? cok(tok, state.next(tok), m) : eerr(errorHandler(pos, tok), state, m));
                }
                
            }
            ;
        }
        ;
    }
    (function defaultErr(pos, tok) {
        return new UnexpectError(pos, ((tok === null) ? "end of input" : tok));
    }
    );
    var anyToken = Parser("Any Token", token(constant(true)));
    var memo = function(p) {
        return function(id) {
            return function(state, m, cok, cerr, eok, eerr) {
                var pos = state["position"];
                var entry = Memoer.lookup(m, pos, id);
                if (entry)return cont(entry, [state, m, cok, cerr, eok, eerr]);
                
                return cont(p, [state, m, function(x, pstate, pm) {
                    return cok(x, pstate, Memoer.update(pm, pos, id, function(_, m, cok) {
                        return cok(x, pstate, m);
                    }
                    ));
                }
                , function(x, pstate, pm) {
                    return cerr(x, pstate, Memoer.update(pm, pos, id, function(_, m, cok, cerr) {
                        return cerr(x, pstate, m);
                    }
                    ));
                }
                , function(x, pstate, pm) {
                    return eok(x, pstate, Memoer.update(pm, pos, id, function(_, m, cok, cerr, eok) {
                        return eok(x, pstate, m);
                    }
                    ));
                }
                , function(x, pstate, pm) {
                    return eerr(x, pstate, Memoer.update(pm, pos, id, function(_, m, cok, cerr, eok, eerr) {
                        return eerr(x, pstate, m);
                    }
                    ));
                }
                ]);
            }
            ;
        }
        ((p.parserId || uniqueParserId()));
    }
    ;
    var exec = function(p, state, m, cok, cerr, eok, eerr) {
        return trampoline(p(state, m, cok, cerr, eok, eerr))();
    }
    ;
    var _perform = function(p, state, ok, err) {
        return exec(p, state, Memoer.create(function(p1, p2) {
            return p1.compare(p2);
        }
        ), ok, err, ok, err);
    }
    ;
    var perform = function(p, state, ok, err) {
        return _perform(p, state, function(x) {
            return function() {
                return ok(x);
            }
            ;
        }
        , function(x) {
            return function() {
                return err(x);
            }
            ;
        }
        );
    }
    ;
    var runState = function(p, state) {
        return _perform(p, state, constant, throwConstant);
    }
    ;
    var runStream = function(p, s, ud) {
        return runState(p, new ParserState(s, Position.initial, ud));
    }
    ;
    var run = function(p, input, ud) {
        return runStream(p, stream.from(input), ud);
    }
    ;
    var runManyState = function(p, state) {
        var manyP = _optionalValueParser(bind(p, function(x, state, m) {
            return always(stream.memoStream(x, curry(runState, manyP, state, m)));
        }
        ));
        return runState(manyP, state);
    }
    ;
    var runManyStream = function(p, s, ud) {
        return runManyState(p, new ParserState(s, Position.initial, ud));
    }
    ;
    var runMany = function(p, input, ud) {
        return runManyStream(p, stream.from(input), ud);
    }
    ;
    var testState = function(ok) {
        return function(err) {
            return function(p, state) {
                return _perform(p, state, ok, err);
            }
            ;
        }
        (constant(constant(false)));
    }
    (constant(constant(true)));
    var testStream = function(p, s, ud) {
        return testState(p, new ParserState(s, Position.initial, ud));
    }
    ;
    var test = function(p, input, ud) {
        return testStream(p, stream.from(input), ud);
    }
    ;
    return ({
        "ParserError": ParserError,
        "ParseError": ParseError,
        "MultipleError": MultipleError,
        "UnknownError": UnknownError,
        "UnexpectError": UnexpectError,
        "ExpectError": ExpectError,
        "ParserState": ParserState,
        "Position": Position,
        "rec": rec,
        "Parser": Parser,
        "RecParser": RecParser,
        "always": always,
        "never": never,
        "bind": bind,
        "eof": eof,
        "extract": extract,
        "getParserState": getParserState,
        "setParserState": setParserState,
        "modifyParserState": modifyParserState,
        "getState": getState,
        "setState": setState,
        "modifyState": modifyState,
        "getInput": getInput,
        "setInput": setInput,
        "getPosition": getPosition,
        "setPosition": setPosition,
        "fail": fail,
        "attempt": attempt,
        "lookahead": lookahead,
        "next": next,
        "sequencea": sequencea,
        "sequence": sequence,
        "either": either,
        "choicea": choicea,
        "choice": choice,
        "optional": optional,
        "expected": expected,
        "eager": eager,
        "binds": binds,
        "cons": cons,
        "append": append,
        "enumerationa": enumerationa,
        "enumeration": enumeration,
        "many": many,
        "many1": many1,
        "token": token,
        "anyToken": anyToken,
        "memo": memo,
        "exec": exec,
        "perform": perform,
        "runState": runState,
        "runStream": runStream,
        "run": run,
        "runManyState": runManyState,
        "runManyStream": runManyStream,
        "runMany": runMany,
        "testState": testState,
        "testStream": testStream,
        "test": test
    });
}
);
