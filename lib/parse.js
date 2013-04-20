/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse.kep'
 * DO NOT EDIT
*/
define(["nu/stream"], function(stream) {
    "use strict";
    var join = Array.prototype.join;
    var map = Array.prototype.map;
    var reduceRight = Array.prototype.reduceRight;
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
    var uniqueParserId = function() {
        return Math.random();
    }
    ;
    var cont = function(f, args) {
        var c = [f, args];
        (c._next = true);
        return c;
    }
    ;
    var trampoline = function(f) {
        var value = f;
        while((value && value._next)){
            (value = value[0].apply(undefined, value[1]));
        }
        
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
        return (this._next || (this._next = new ParserState(stream.rest(this.input), this.position.increment(tok), this.userState)));
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
            return (("[" + map.call(this.errors, function(x) {
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
        var value;
        return (value = def(function() {
            return value.apply(this, arguments);
        }
        ));
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
    var never = function(msg) {
        var e = ((msg === undefined) ? UnknownError : ParseError);
        return function NEVER_PARSER(state, m, cok, cerr, eok, eerr) {
            return eerr(new e(state.position, msg), state, m);
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
    var binda = function(p, f) {
        return bind(p, function(x) {
            return f.apply(undefined, stream.toArray(x));
        }
        );
    }
    ;
    var eof = function() {
        return function EOF_PARSER(state, m, cok, cerr, eok, eerr) {
            return (stream.isEmpty(state.input) ? eok(stream.end, state, m) : eerr(new ExpectError(state.position, "end of input", stream.first(state.input)), state, m));
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
    var choice = function() {
        var either = _either(function(pos, pErr, qErr) {
            return new ChoiceError(pos, pErr, qErr);
        }
        );
        var reducer = function(p, c) {
            return either(c, p);
        }
        ;
        var end = function(state, m, cok, cerr, eok, eerr) {
            return eerr(new MultipleError(state.position, []), state, m);
        }
        ;
        return function() {
            return ((arguments.length === 0) ? never() : reduceRight.call(arguments, reducer, end));
        }
        ;
    }
    ();
    var optional = function(p, def) {
        return either(p, always(def));
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
    var _optionalValueParser = function(p) {
        return optional(p, stream.end);
    }
    ;
    var consParser = _joinParser(stream.cons);
    var append = _joinParser(stream.append);
    var sequence = function() {
        var cons = function(p, q) {
            return consParser(q, p);
        }
        ;
        return function() {
            return reduceRight.call(arguments, cons, _end);
        }
        ;
    }
    ();
    var many = function() {
        var manyError = function() {
            throw new ParserError("Many parser applied to a parser that accepts an empty string");
        }
        ;
        return function MANY_PARSER(p) {
            var safeP = function(state, m, cok, cerr, eok, eerr) {
                return cont(p, [state, m, cok, cerr, manyError, eerr]);
            }
            ;
            return rec(function(self) {
                return _optionalValueParser(consParser(safeP, self));
            }
            );
        }
        ;
    }
    ();
    var many1 = function(p) {
        return consParser(p, many(p));
    }
    ;
    var times = function(n, p) {
        return ((n <= 0) ? _end : consParser(p, times((n - 1), p)));
    }
    ;
    var betweenTimes = function() {
        var maxParser = function(max, p) {
            return ((max <= 0) ? _end : _optionalValueParser(consParser(p, maxParser((max - 1), p))));
        }
        ;
        return function(min, max, p) {
            return ((max < min) ? never : append(times(min, p), maxParser((max - min), p)));
        }
        ;
    }
    ();
    var then = function(p, q) {
        return bind(p, function(x) {
            return next(q, always(x));
        }
        );
    }
    ;
    var between = function(open, close, p) {
        return next(open, then(p, close));
    }
    ;
    var sepBy1 = function(sep, p) {
        return rec(function(self) {
            return consParser(p, either(attempt(next(sep, self)), _end));
        }
        );
    }
    ;
    var sepBy = function(sep, p) {
        return _optionalValueParser(sepBy1(sep, p));
    }
    ;
    var token = function() {
        var defaultErr = function(pos, tok) {
            return new UnexpectError(pos, ((tok === null) ? "end of input" : tok));
        }
        ;
        return function(consume, onErr) {
            (onErr = (onErr || defaultErr));
            return function TOKEN_PARSER(state, m, cok, cerr, eok, eerr) {
                var pos = state.position,input = state.input;
                if (! input){
                    return eerr(onErr(pos, null), state, m);
                }
                else {
                    var tok = stream.first(input);
                    return (consume(tok) ? cok(tok, state.next(tok), m) : eerr(onErr(pos, tok), state, m));
                }
                
            }
            ;
        }
        ;
    }
    ();
    var anyToken = constant(token(constant(true)));
    var _character = function(pred, c) {
        return token(curry(pred, c));
    }
    ;
    var character = function(c, pred) {
        return _character((pred || eq), c);
    }
    ;
    var string = function() {
        var reducer = function(p, c) {
            return next(c, p);
        }
        ;
        return function(s, pred) {
            return map.call(s, curry(_character, (pred || eq))).reduceRight(reducer, always(s));
        }
        ;
    }
    ();
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
        var id = (p.parserId || uniqueParserId());
        return function(state, m, cok, cerr, eok, eerr) {
            var entry = Memoer.lookup(m, id, state);
            if (entry){
                return cont(entry, [state, m, cok, cerr, eok, eerr]);
            }
            
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
    ;
    var exec = function(p, state, m, cok, cerr, eok, eerr) {
        return trampoline(p(state, m, cok, cerr, eok, eerr))();
    }
    ;
    var _makeParser = function(ok, err) {
        return function(p, state, m) {
            return exec(p, state, (m || null), ok, err, ok, err);
        }
        ;
    }
    ;
    var runState = _makeParser(constant, throwConstant);
    var runStream = function(p, s, ud) {
        return runState(p, new ParserState(s, new Position(0), (ud || null)));
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
        return runManyState(p, new ParserState(s, new Position(0), ud));
    }
    ;
    var runMany = function(p, input, ud) {
        return runManyStream(p, stream.from(input), ud);
    }
    ;
    var testState = _makeParser(constant(constant(true)), constant(constant(false)));
    var testStream = function(p, s, ud) {
        return testState(p, new ParserState(s, new Position(0), ud));
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
        "binda": binda,
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
        "attempt": attempt,
        "lookahead": lookahead,
        "next": next,
        "either": either,
        "choice": choice,
        "optional": optional,
        "expected": expected,
        "cons": consParser,
        "append": append,
        "sequence": sequence,
        "many": many,
        "many1": many1,
        "times": times,
        "betweenTimes": betweenTimes,
        "then": then,
        "between": between,
        "sepBy1": sepBy1,
        "sepBy": sepBy,
        "token": token,
        "anyToken": anyToken,
        "character": character,
        "string": string,
        "backtrack": backtrack,
        "memo": memo,
        "exec": exec,
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
