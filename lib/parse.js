/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse.kep'
 * DO NOT EDIT
*/
;
define(["nu/stream"], function(stream) {
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
    var Memoer = function(id, state, val, delegate) {
        (this.id = id);
        (this.state = state);
        (this.val = val);
        (this.delegate = delegate);
    }
    ;
    (Memoer.lookup = function(cell, id, state) {
        for(var m = cell;
         m;(m = m.delegate)){
            if (((m.id === id) && m.state.eq(state))){
                return m.val;
            }
            
        }
        
        return null;
    }
    );
    (Memoer.update = function(m, id, state, val) {
        return new Memoer(id, state, val, m);
    }
    );
    var Position = function(i) {
        (this.index = i);
    }
    ;
    (Position.initial = new Position(0));
    (Position.prototype.increment = function(tok) {
        return new Position((this.index + 1));
    }
    );
    (Position.prototype.toString = function() {
        return ("" + this.index);
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
    (ParserState.prototype.eq = function(state) {
        return (this.position.compare(state.position) === 0);
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
            var pcok = function(x, state, m) {
                return cont(f(x, state, m), [state, m, cok, cerr, cok, cerr]);
            }
            ,peok = function(x, state, m) {
                return cont(f(x, state, m), [state, m, cok, cerr, eok, eerr]);
            }
            ;
            return cont(p, [state, m, pcok, cerr, peok, eerr]);
        }
        ;
    }
    ;
    var extract = function(f) {
        return function EXTRACT_PARSER(state, m, cok, cerr, eok) {
            return eok(f(state), state, m);
        }
        ;
    }
    ;
    var getParserState = constant(extract(identity));
    var modifyParserState = function(f) {
        return function MODIFY_PARSER_STATE(state, m, cok, cerr, eok) {
            var newState = f(state);
            return eok(newState, newState, m);
        }
        ;
    }
    ;
    var setParserState = function(s) {
        return modifyParserState(constant(s));
    }
    ;
    var getState = constant(extract(function(s) {
        return s.userState;
    }
    ));
    var modifyState = function(f) {
        return function MODIFY_STATE(state, m, cok, cerr, eok) {
            var newState = state.setUserState(f(state.userState));
            return eok(newState, newState, m);
        }
        ;
    }
    ;
    var setState = function(s) {
        return modifyState(constant(s));
    }
    ;
    var getPosition = constant(extract(function(s) {
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
    var getInput = constant(extract(function(s) {
        return s.input;
    }
    ));
    var setInput = function(input) {
        return modifyState(function(s) {
            return s.setInput(input);
        }
        );
    }
    ;
    var eof = function() {
        return bind(getInput(), function(input) {
            return (stream.isEmpty(input) ? always(stream.end) : bind(getPosition(), function(pos) {
                return never(new ExpectError(pos, "end of input", stream.first(input)));
            }
            ));
        }
        );
    }
    ;
    var fail = function(msg) {
        return function(e) {
            return bind(getPosition(), function(pos) {
                return never(new e(pos, msg));
            }
            );
        }
        ((msg ? ParseError : UnknownError));
    }
    ;
    var attempt = function(p) {
        return function ATTEMPT_PARSER(state, m, cok, cerr, eok, eerr) {
            return cont(p, [state, m, cok, eerr, eok, eerr]);
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
    var choice = function(either) {
        return function(reducer) {
            return function(end) {
                return function() {
                    if (! arguments.length){
                        throw new ParserError("choice called with no arguments");
                    }
                    
                    return reduceRight(arguments, reducer, end);
                }
                ;
            }
            (bind(getPosition(), function(pos) {
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
    var sequence = function(reducer) {
        return function() {
            return reduceRight(arguments, reducer, _end);
        }
        ;
    }
    (function reducer(p, q) {
        return cons(q, p);
    }
    );
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
                var pos = state.position,input = state.input;
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
    var _character = function(pred, c) {
        return token(curry(pred, c));
    }
    ;
    var character = function(c, pred) {
        return _character((pred || eq), c);
    }
    ;
    var string = function(reducer) {
        return function(s, pred) {
            return map(s, curry(_character, (pred || eq))).reduceRight(reducer, always(s));
        }
        ;
    }
    (function reducer(p, c) {
        return next(c, p);
    }
    );
    var backtrack = function(p) {
        return function(state, m, cok, cerr, eok, eerr) {
            return cont(p, [state, m, function(x, state) {
                return cok(x, state, m);
            }
            , function(x, state) {
                return cerr(x, state, m);
            }
            , function(x, state) {
                return eok(x, state, m);
            }
            , function(x, state) {
                return eerr(x, state, m);
            }
            ]);
        }
        ;
    }
    ;
    var memo = function(p) {
        return function(id) {
            return function(state, m, cok, cerr, eok, eerr) {
                var entry = Memoer.lookup(m, id, state);
                if (entry)return cont(entry, [state, m, cok, cerr, eok, eerr]);
                
                var pcok = function(x, pstate, pm) {
                    return cok(x, pstate, Memoer.update(pm, id, state, function(_, m, cok) {
                        return cok(x, pstate, m);
                    }
                    ));
                }
                ;
                var pcerr = function(x, pstate, pm) {
                    return cerr(x, pstate, Memoer.update(pm, id, state, function(_, m, cok, cerr) {
                        return cerr(x, pstate, m);
                    }
                    ));
                }
                ;
                var peok = function(x, pstate, pm) {
                    return eok(x, pstate, Memoer.update(pm, id, state, function(_, m, cok, cerr, eok) {
                        return eok(x, pstate, m);
                    }
                    ));
                }
                ;
                var peerr = function(x, pstate, pm) {
                    return eerr(x, pstate, Memoer.update(m, id, state, function(_, m, cok, cerr, eok, eerr) {
                        return eerr(x, pstate, pm);
                    }
                    ));
                }
                ;
                return cont(p, [state, m, pcok, pcerr, peok, peerr]);
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
        return exec(p, state, null, ok, err, ok, err);
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
        "either": either,
        "choice": choice,
        "optional": optional,
        "expected": expected,
        "eager": eager,
        "binds": binds,
        "cons": cons,
        "append": append,
        "sequence": sequence,
        "many": many,
        "many1": many1,
        "token": token,
        "anyToken": anyToken,
        "character": character,
        "string": string,
        "backtrack": backtrack,
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
