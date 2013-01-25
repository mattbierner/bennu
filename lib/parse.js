/**
 * @fileOverview Combinatorial Parsers for JavaScript.
 */
define(['stream'],
        function(stream) {
//"use strict";

/* Prototypes
 ******************************************************************************/
var join = Array.prototype.join;
var map = Array.prototype.map;
var reduceRight = Array.prototype.reduceRight;

/* Helpers
 ******************************************************************************/
var bind = function(f /*, ...*/) {
    return (arguments.length === 1 ? f : f.bind.apply(f, arguments));
};

var identity = function(v) { return v; };

var constant = bind(bind, identity);

var throwConstant = function(err) {
    return function() {
        throw err;
    };
};

var eq = function(x, y) {
    return (x === y);
};

// Continuation
////////////////////////////////////////
var cont = function(f, args) {
    var c = [f, args];
    c._next = true;
    return c;
};

var trampoline = function(f) {
    var value = f;
    while (value && value._next) {
        value = value[0].apply(undefined, value[1]);
    }
    return value;
};

/* Memoing
 ******************************************************************************/
var Memoer = function(val, state, rest) {
    this.val = val;
    this.state = state;
    this.rest = rest;
};

Memoer.prototype.get = function(state) {
    if (this.state && (this.state.pos.line === state.pos.line && this.state.pos.column === state.pos.column)) {
        return this.val;
    } else if (this.rest) {
        return this.rest.get(state);
    } else {
        return null;
    }
};

Memoer.prototype.cons = function(val, state) {
    return new Memoer(val, state, this);
};


/* Records
 ******************************************************************************/
/**
 * A line and column position in the input.
 */
var Position = (function(){
    var toString = function() {
        return "{line: " + this.line + " col: " + this.column + "}";
    };
    
    return function(line, column) {
        return Object.freeze({
            'line': line,
            'column': column,
            'toString': toString
        });
    };
}());

/**
 * Advanced the position based on a consumed character.
 * 
 * @param pos Position to increment.
 * @param {String} c Character that was consumed.
 * 
 * @returns Input object for position after 'c'.
 */
Position.increment = function(pos, c) {
    return (c === '\n' ?
        Position(pos.line + 1, 1):
        Position(pos.line, pos.column + 1));
};

/**
 * Object used to track a Parser's state.
 * 
 * @param input Input to the parser.
 * @param pos Current position of head of input.
 * 
 * @returns InputState object for given input and position.
 */
var InputState = function(input, pos) {
    this.input = input;
    this.pos = pos;
};

/**
 * Get next state object for a given consumed token.
 * 
 * @param tok Token consumed.
 * 
 * @returns New input state for next item in stream.
 */
InputState.prototype.next = function(tok) {
    return (this._next ||
        (this._next = new InputState(stream.rest(this.input), Position.increment(this.pos, tok))));
};

/* Errors
 ******************************************************************************/
/**
 * Parser Error
 * @constructor
 * @implements {Error}
 * 
 * @param pos The Position of the first parser error.
 * @param {Array} messages Order collection of parser error messages.
 */
var ParseError = function(pos, messages) {
    this._messages = messages;
    this.pos = pos;
};
ParseError.prototype = new Error();
ParseError.prototype.constructor = ParseError;
ParseError.prototype.name = "ParseError";
Object.defineProperties(ParseError.prototype, {
    'message': {
        'get': function() {
            var messages = this.messages;
            return "At position:" + this.pos + " [" + (messages ? join.call(messages, ', ') : '') + ']';
        }
    },
    'messages' : {
        'get': function() { return this._messages; }
    }
});

/**
 * Merges two ParserErrors into a single ParserError.
 */
var MultipleError = function(e1, e2) {
    this.e1 = e1;
    this.e2 = e2;
    ParseError.call(this, e1.pos);
};
MultipleError.prototype = new ParseError();
MultipleError.prototype.constructor = MultipleError;
MultipleError.prototype.name = "MultipleError";

Object.defineProperty(MultipleError.prototype, 'messages', {
    'get': function() {
        return [this.e1.messsage, this.e2.message];
    }
});

/**
 * @constructor
 * @implements {ParseError}
 */
var UnknownError = function(pos) {
    ParseError.call(this, pos, ["Error"]);
};
UnknownError.prototype = new ParseError();
UnknownError.prototype.constructor = UnknownError;
UnknownError.prototype.name = "UnknownError";

/**
 * @constructor
 * @implements {ParseError}
 */
var UnexpectError = function(pos, msg) {
    ParseError.call(this, pos, (msg ? ["Unexpected " + msg] : msg));
};
UnexpectError.prototype = new ParseError();
UnexpectError.prototype.constructor = UnexpectError;
UnexpectError.prototype.name = "UnexpectError";

/**
 * @constructor
 * @implements {ParseError}
 */
var ExpectError = function(pos, msg) {
    ParseError.call(this, pos, ["Expected " + (msg || '')]);
};
ExpectError.prototype = new ParseError();
ExpectError.prototype.constructor = ExpectError;
ExpectError.prototype.name = "ExpectError";


/* Parser definition
 ******************************************************************************/
/**
 * Create a named parser.
 * Completely optional, but useful for debugging purposes.
 * 
 * @param {string} name Human readable display name to give the Parser. Used for
 *     identifying a parser for debugging.
 * @param impl Implementation of the parser itself, not the parser's constructor.
 *
 *@return 
 */
var Parser = function(name, impl) {
    return Object.defineProperty(impl, 'displayName', {
        'value': name,
        'writable': false
    });
};

/**
 * Creates a parser using a factory function to allow self references.
 * 
 * For example, using a traditional definition the self reference to 'bs'
 * evaluates to undefined:
 * 
 *    var bs = parse.either(parse.character('b'), bs) -> parse.either(parse.character('b'), undefined)
 * 
 * Using RecParser, we fix this.
 * 
 *     var bs = RecParser(function(bs) {
 *         return parse.either(parse.character('b'), bs);
 *     });
 * 
 * @param def Factory function that is passed a reference to the parser being
 *     defined and returns the parser.
 * 
 * @return A parser.
 */
var RecParser = function(def) {
    var value;
    return (value = def(function(/*...*/) { return value.apply(this, arguments); }));
};

/**
 * Create a parser with a given function body. Parser is defined by a create
 * function that is passed itself as first argument.
 * 
 * Allows easy self references in parser.
 * 
 * @param body The body of the parser.
 */
var NamedRecParser = function(name, body) {
    return Parser(name, RecParser(body));
};

/* Parsers
 ******************************************************************************/
// Base Parsers
////////////////////////////////////////
/**
 * Parser that always succeeds with a given value and consumes no input.
 * 
 * @param x Value to yield.
 */
var alwaysParser = function(x) {
    return function ALWAYS_PARSER(state, m, cok, cerr, eok /*, _*/) {
        return eok(x, state, m);
    };
};

/**
 * Parser that always fails and consumes no input.
 */
var neverParser = constant(function NEVER_PARSER(state, m, cok, cerr, eok, eerr) {
    return eerr(new UnknownError(state.pos), state, m);
});

/**
 * Parser that parses 'p', passing the results to function 'f' which returns a
 * parser 'q' that continues the computation.
 * 
 * @param p Parser to run, passing results to f.
 * @param f Function called with result from 'p' and returns parser 'q'.
 * 
 * @return Value from 'q' parser.
 */
var bindParser = function(p, f) {
    return function BIND_PARSER(state, m, cok, cerr, eok, eerr) {
        var pcok = function(v, state, m) { return cont(f(v, state), [state, m, cok, cerr, cok, cerr]); },
            peok = function(v, state, m) { return cont(f(v, state), [state, m, cok, cerr, eok, eerr]); };
        return cont(p, [state, m, pcok, cerr, peok, eerr]);
    };
};

/**
 * Same as bind but calls apply on 'f' using results of 'p'. 
 */
var bindaParser = function(p, f) {
    return bindParser(p, function(s) {
        return f.apply(undefined, stream.toArray(s));
    });
};

/**
 * Parser that matches end of input. If end of input, succeeds with null.
 */
var eofParser = constant(function EOF_PARSER(state, m, cok, cerr, eok, eerr) {
    return (!state.input ?
        eok(null, state, m) :
        eerr(new ExpectError(state.pos, "end of input"), state, m));
});


// Parser State Interaction Parsers
////////////////////////////////////////
/**
 * Parser that extracts information from the Parser's current state.
 * 
 * @param {function(Object): *} f Function that extracts information from a 
 *     given state object.
 */
var extractParser = function(f) {
    return function EXTRACT_PARSER(state, m, cok, cerr, eok /*, _*/) {
        return eok(f(state), state, m);
    };
};

/**
 * Parser that returns the current state.
 */
var examineParser = bind(extractParser, identity);

// Try Parsers
////////////////////////////////////////
/**
 * Parser that attempts to parse p. Upon failure, never consumes any input.
 */
var attemptParser = function(p) {
    return function ATTEMPT_PARSER(state, m, cok, cerr, eok, eerr) {
        return cont(p, [state, m, cok, eerr, eok, eerr]);
    };
};

/**
 * Parser that consumes no input but returns what was parsed.
 */
var lookaheadParser = function(p) {
    return function LOOKAHEAD_PARSER(state, m, cok, cerr, eok, eerr) {
        var ok = function(item, _, m) { return eok(item, state, m); };
        return cont(p, [state, m, ok, cerr, eok, eerr]);
    };
};

// Combinitorial Parsers
////////////////////////////////////////
/**
 * Parser that parses 'p', then 'q'. Return the 'q' value.
 */
var nextParser = function(p, q) {
    return bindParser(p, constant(q));
};

/**
 * Parser that attempts p or q. If p succeeds, returns its value. Else, tries
 * to parse q.
 */
var eitherParser = function(p, q) {
    return function EITHER_PARSER(state, m, cok, cerr, eok, eerr) {
        var peerr = function(errFromP, _, mFromP) {
            var qeerr = function(errFromQ, _, mFromQ) {
                return eerr(new MultipleError(errFromP, errFromQ), state, mFromQ);
            };
            return cont(q, [state, mFromP, cok, cerr, eok, qeerr]);
        };
        return cont(p, [state, m, cok, cerr, eok, peerr]);
    };
};

/**
 * Parser that attempts a variable number of parsers in order and returns
 * the value of the first one that succeeds.
 */
var choiceParser = (function(){
    var reducer = function(p, c) { return eitherParser(c, p); };
    
    return function(/*...*/) {
        return (arguments.length === 0 ?
            neverParser :
            reduceRight.call(arguments, reducer));
    };
}());

/**
 * Consume 'p' either zero or one time.
 * 
 * @param p Parser to consume zero or one times.
 * @param [def] Default value to return.
 * 
 * @return Result of 'p' or default value.
 */
var optionalParser = function(p, def) {
    return eitherParser(
        p,
        alwaysParser(def));
};

// Iterative  Parsers
////////////////////////////////////////
var _end = alwaysParser(stream.end);

var _joinParser = function(joiner, p1, p2) {
    return bindParser(p1, function(v1) {
        return bindParser(p2, function(v2) {
            return alwaysParser(joiner(v1, v2));
        });
    });
};

var _optionalValueParser = function(p) {
    return optionalParser(p, stream.end);
};

/**
 * Parser that cons the value result of 'valueParser' onto the stream result
 * of 'streamParser'.
 * 
 * @param valueParser Parser that returns a value.
 * @param streamParser Parser that returns a stream.

 * @return Stream with value from 'valueParser' consed on.
 */
var consParser = bind(_joinParser, stream.cons);

/**
 * Parser that joins the results of two iterative Parsers
 */
var concatParser =  bind(_joinParser, stream.concat);

/**
 * Consume a finite sequence of parsers, returning the results as a list.
 * 
 * @return Ordered list of results from each parsers.
 */
var sequenceParser = (function(){
    var cons = function(p, q) {
        return consParser(q, p);
    };
    
    return function(/*...*/) {
        return reduceRight.call(arguments, cons, _end);
    };
}());

/**
 * Consume 'p' zero or more times.
 * 
 * @param p Parser to consume zero or more times.
 * 
 * @return List of 'p' results. May be empty if zero 'p' was consumed.
 */
var manyParser = (function(){
    var manyError = function() {
        throw new Error("Many parser applied to a parser that accepts an empty string");
    };
    
    return function MANY_PARSER(p) {
        var safeP = function(state, m, cok, cerr, eok, eerr) {
            return cont(p, [state, m, cok, cerr, manyError, eerr]);
        };
        
        return RecParser(function(self) {
            return _optionalValueParser(
                consParser(safeP, self));
        });
    };
}());

/**
 * Consume 'p' 1 or more times.
 * 
 * @param p Parser to consume one or more times.
 * 
 * @return List of 'p' results.
 */
var many1Parser = function(p) {
    return consParser(p, manyParser(p));
};

/**
 * Consume p 'n' times.
 * 
 * @param {Number} n Number of times to consume p.
 * @param p Parser to consume 'n' times.
 * 
 * @return List of 'p' results.
 */
var timesParser = function(n, p) {
    return (n <= 0 ?
        _end : 
        consParser(p, timesParser(n - 1, p)));
};

/**
 * Consume 'p' between 'min' and 'max' times.
 * 
 * @param {Number} min Minimum number of times to consume 'p'.
 * @param {Number} max Maximum umber of times to consume 'p'.
 * @param p Parser to consume.
 * 
 * @return List of 'p' results.
 */
var betweenTimesParser = (function(){
    var maxParser = function(max, p) {
        return (max <= 0 ?
            _end :
            _optionalValueParser(
                consParser(p, maxParser(max - 1, p))));
    };
    
    return function(min, max, p) {
        return (max < min ?
            neverParser :
            concatParser(
                timesParser(min, p),
                maxParser(max - min, p)));
    };
}());

/**
 * Consume 'p' between 'open' and 'close', returning 'p' results.
 * 
 * @param open Parser to consume first, discarding results.
 * @param close Parser to consume last, discarding results.
 * @param p Parser to consume between 'open' and 'close'.
 *
 *@return Result of 'p'.
 */
var betweenParser = (function(){
    var mid = function(open, middle) {
        return alwaysParser(middle);
    };

    return function(open, close, p) {
        return bindaParser(sequenceParser(open, p, close), mid);
    };
}());


/**
 * Consume 'p' seperated by 'sep' one or more times.
 * 
 * @param sep Parser to consume between instances of 'p', discarding results.
 * @param p Parser to consume seperated by 'sep'.
 * 
 * @return List of 'p' results.
 */
var sepBy1 = function(sep, p) {
    return consParser(p, manyParser(nextParser(sep, p)));
};

/**
 * Parser that consumes 'p' seperated by 'sep' zero or more times.
 * 
 * @param sep Parser to consume between instances of 'p', discarding results.
 * @param p Parser to consume seperated by 'sep'.
 * 
 * @return List of 'p' results.
 */
var sepBy = function(sep, p) {
    return _optionalValueParser(sepBy1(sep, p));
};

// Token Parsers
////////////////////////////////////////
/**
 * Parser that consumes a single item from the head of the input if consume is
 * true. Fails to consume input if consume is false or input is empty.
 * 
 * @param {function(string): boolean} consume Function that tests if a character should be consumed.
 * 
 * @return Consumed token.
 */
var tokenParser = (function(){
    /**
 * @constructor
 * @implements {UnexpectError}
 */
    var UnexpectTokenError = function(pos, tok) {
        ParseError.call(this, pos);
        this.tok = tok;
    };
    UnexpectTokenError.prototype = new UnexpectError;
    UnexpectTokenError.prototype.constructor = UnexpectTokenError;
    Object.defineProperty(UnexpectTokenError.prototype, 'message', {
        'get': function() {
            return "Unexpected " + this.tok;
        }
    });
    
    return function(consume) {
        return function TOKEN_PARSER(state, m, cok, cerr, eok, eerr) {
            var pos = state.pos,
                input = state.input;
            if (!input) {
                return eerr(new UnexpectError(pos, "end of input"), state, m);
            } else {
                var tok = stream.first(input);
                return (consume(tok) ?
                    cok(tok, state.next(tok), m) :
                    eerr(new UnexpectTokenError(pos, tok), state, m));
            }
        };
    };
}());


/**
 * Parser that consumes any token.
 * 
 * @return Consumed token.
 */
var anyTokenParser = tokenParser(constant(true));

var _charParser = function(pred, c) {
    return tokenParser(bind(pred, c));
};

/**
 * Parser that consumes a character based on a predicate.
 * 
 * @param c Object to test against.
 * @param {function(Object, Object): boolean} [pred] Predicate function that
 *    compares two values. Returns if the parser should consume the character.
 */
var charParser = function(c, pred) {
    return _charParser((pred || eq), c);
};

/**
 * Parser that consumes a sequence of characters based on a predicate.
 * 
 * @param s Sequence of objects to test against.
 * @param {function(Object, Object): boolean} [pred] Predicate function called on
 *    each character of sequence that compares two values. Returns if the parser
 *    should consume the character.
 **/
var stringParser = (function(){
    var reducer = function(p, c) { return nextParser(c, p); };
    
    return function(s, pred) {
        return map.call(s, bind(_charParser, (pred || eq)))
            .reduceRight(reducer, alwaysParser(s));
    };
}());

/* Memo Parsers
 ******************************************************************************/
/**
 * Parse 'p' and continue with old memo table.
 */
var backtracingParser = function(p) {
    return function(state, m, cok, cerr, eok, eerr) {
        var pcok = function(x, state /*, _*/) { return cok(x, state, m); },
            pcerr = function(x, state /*, _*/) { return cerr(x, state, m); },
            peok = function(x, state /*, _*/) { return pok(x, state, m); },
            peerr = function(x, state /*, _*/) { return cerr(x, state, m); };
        return cont(p, [state, m, pcok, pcerr, peok, peerr]);
    };
};

/**
 * Uses memo result for 'p' or parse 'p' and store result in memo table.
 */
var memoParser = (function(){
    var pcok = function(x, state /*, _*/) {
        return function(_, m, cok, cerr, eok, eerr) {
            return cok(x, state, m);
        };
    };
    var pcerr = function(x, state /*, _*/) {
        return function(_, m, cok, cerr, eok, eerr) {
            return cerr(x, state, m);
        };
    };
    var peok = function(x, state /*, _*/) {
        return function(_, m, cok, cerr, eok, eerr) {
            return eok(x, state, m);
        };
    };
    var peerr = function(x, state /*, _*/) {
        return function(_, m, cok, cerr, eok, eerr) {
            return eerr(x, state, m);
        };
    };
    
    return function(p) {
        return function(state, m, cok, cerr, eok, eerr) {
            var entry;
            if ((entry = m.get(state))) {
                return entry(state, m, cok, cerr, eok, eerr);
            } else {
                entry = trampoline(p(state, m, pcok, pcerr, peok, peerr));
                return entry(state, m.cons(entry, state), cok, cerr, eok, eerr)
            }
        };
    };
}());

/* Running
 ******************************************************************************/
/**
 * Execute a given parser 'p', correctly extracting results.
 */
var exec = function(p, state, cok, cerr, eok, eerr) {
    return trampoline(p(state, new Memoer(), cok, cerr, eok, eerr))();
};

var _makeParser = function(ok, err) {
    return function(p, state) {
        return exec(p, state, ok, err, ok, err);
    };
};

/**
 * Run a given parser with a given state.
 * 
 * @param p Parser to run.
 * @param state State to run parser against.
 * 
 * @return Result from the parser.
 */
var runState = _makeParser(constant, throwConstant);

/**
 * Run parser 'p' against an input stream.
 * 
 * Supplies own state object.
 * 
 * @param p Parser to run.
 * @param s A stream.js style stream supporting first and rest.
 * 
 * @return Result from the parser.
 */
var runStream = function(p, s) {
    return runState(p, new InputState(s, Position(1, 0)));
};

/**
 * Run parser 'p' against an input string.
 * 
 * @param p Parser to run.
 * @param input An array-like object of characters to run the parser against.
 * 
 * @return Result from the parser.
 */
var run = function(p, input) {
    return runStream(p, stream.from(input));
};

/**
 * Run parser 'p' zero or more times to produce a lazy stream of results.
 * 
 * Similar in operation to the 'many' parser, but lazy and not a
 * combinatorial parser.
 * 
 * Result may be an infinite stream.
 * 
 * @param p Parser to run zero or more times.
 * @param state State to run parser against.
 * 
 * @return Lazy stream of results.
 */
var runManyState = function(p, state) {
    var manyP = _optionalValueParser(
        bindParser(p, function(v, state) {
            return alwaysParser(stream.stream(v, bind(runState, manyP, state)));
        }));
    return runState(manyP, state);
};

/**
 * Run parser 'p' zero or more times to produce a lazy stream or results.
 * 
 * Supplies own state.
 * 
 * @param p Parser to run.
 * @param s stream.js style stream supporting first and rest.
 *
 * @see runManyState
 */
var runManyStream = function(p, s) {
    return runManyState(p, new InputState(s, Position(1, 0)));
};

/**
 * Run parser 'p' zero or more times against a input string to produce a lazy
 * stream or results.
 * 
 * @param p Parser to run.
 * @param input Array-like object of characters to run the parser against.
 *
 * @see runManyStream
 */
var runMany = function(p, input) {
    return runManyStream(p, stream.from(input));
};

/**
 * Tests parser 'p' with a given state.
 * 
 * @param p Parser to run.
 * @param state State to run parser against.
 *
 * @return Did the parser successfully run?
 */
var testState = _makeParser(constant(constant(true)), constant(constant(false)));

 /**
 * Tests parser 'p' against a stream.
 * 
 * Supplies own state.
 * 
 * @param p Parser to run.
 * @param s stream.js style stream supporting first and rest.
 * 
 * @see testState
 */
var testStream = function(p, s) {
    return testState(p, new InputState(s, Position(1, 0)));
};

/**
 * Tests parser 'p' against an input string.
 * 
 * @param p Parser to run.
 * @param input Array-like object of characters to run the parser against.
 *
 * @see testStream
 */
var test = function(p, input) {
    return testStream(p, stream.from(input));
};


/* Export
 ******************************************************************************/
return {
// Errors
    'ParseError': ParseError,
    'UnknownError': UnknownError,
    'UnexpectError': UnexpectError,
    'ExpectError': ExpectError,

// Objects
    'InputState': InputState,
    'Position': Position,

// Parser Definition
    'Parser': Parser,
    'RecParser': RecParser,
    'NamedRecParser': NamedRecParser,

// Parsers
    'always': alwaysParser,
    'never': neverParser,
    'bind': bindParser,
    'binda': bindaParser,
    'eof': eofParser,

    'extract': extractParser,
    'examine': examineParser,

    'attempt': attemptParser,
    'lookahead': lookaheadParser,

    'next': nextParser,
    'either': eitherParser,
    'choice': choiceParser,
    'optional': optionalParser,

    'consParser': consParser,
    'concatParser': concatParser,
    'sequence': sequenceParser,
    'many': manyParser,
    'many1': many1Parser,
    'times': timesParser,
    'betweenTimes': betweenTimesParser,

    'between': betweenParser,
    'sepBy1': sepBy1,
    'sepBy': sepBy,

    'token': tokenParser,
    'anyToken': anyTokenParser,

    'character': charParser,
    'string': stringParser,

    'backtracing': backtracingParser,
    'memo': memoParser,
    
// Running
    'exec': exec,

    'runState': runState,
    'runStream': runStream,
    'run': run,

    'runManyState': runManyState,
    'runManyStream': runManyStream,
    'runMany': runMany,

    'testState': testState,
    'testStream': testStream,
    'test': test
};
});
