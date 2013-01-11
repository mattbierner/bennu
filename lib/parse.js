/**
 * @fileOverview Combinatorial Parsers for JavaScript.
 */
(function(define){

define(['stream'], function(stream) {
"use strict";

/* Prototypes
 ******************************************************************************/
var join = Array.prototype.join;
var map = Array.prototype.map;
var reduce = Array.prototype.reduce;
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
    return (this._next || (this._next = new InputState(stream.rest(this.input), Position.increment(this.pos, tok))));
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
    ParseError.call(this, pos, ["Unexpected " + (msg || '')]);
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


/* Running
 ******************************************************************************/
var _makeParser = function(ok, err) {
    return function(p, state) {
        return trampoline(p(state, ok, err, ok, err))();
    };
};

/**
 * Run a given parser with a given state.
 * 
 * @param  p Parser to run.
 * @param {InputState} state State to run parser against.
 */
var runParser = _makeParser(constant, throwConstant);

/**
 * Run a given parser against an input stream.
 * 
 * @param p Parser to run.
 * @param stream An array of characters to run the parser against. May be a string,
 *     array, or array-like object.
 */
var runStream = function(p, stream) {
    return runParser(p, new InputState(stream, Position(1, 1)));
};

/**
 * Run a given parser against an input string.
 * 
 * @param p Parser to run.
 * @param input An array of characters to run the parser against. May be a string,
 *     array, or array-like object.
 */
var run = function(p, input) {
    return runStream(p, stream.from(input));
};

var testParser = _makeParser(constant(constant(true)), constant(constant(false)));


var testStringStream = function(p, stream) {
    return testParser(p, new InputState(stream, Position(1, 1)));
};

/**
 * Tests a given parser against an input string.
 * 
 * @param p Parser to run.
 * @param input An array of characters to run the parser against. May be a string,
 *     array, or array-like object.
 *
 * @return Did the parser successfully run?
 */
var test = function(p, input) {
    return testStringStream(p, stream.from(input));
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
    return function ALWAYS_PARSER(state, cok, cerr, eok /*, _*/) {
        return eok(x, state);
    };
};

/**
 * Parser that always fails and consumes no input.
 */
var neverParser = constant(function NEVER_PARSER(state, cok, cerr, eok, eerr) {
    return eerr(new UnknownError(state.pos));
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
    return function BIND_PARSER(state, cok, cerr, eok, eerr) {
        var pcok = function(v, state) { return cont(f(v), [state, cok, cerr, cok, cerr]); },
            peok = function(v, state) { return cont(f(v), [state, cok, cerr, eok, eerr]); };
        return cont(p, [state, pcok, cerr, peok, eerr]);
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
var eofParser = constant(function EOF_PARSER(state, cok, cerr, eok, eerr) {
    return (!state.input ?
        eok(null, state) :
        eerr(new ExpectError(state.pos, "end of input")));
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
    return function EXTRACT_PARSER(state, cok, cerr, eok /*, _*/) {
        return eok(f(state), state);
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
    return function ATTEMPT_PARSER(state, cok, cerr, eok, eerr) {
        return cont(p, [state, cok, eerr, eok, eerr]);
    };
};

/**
 * Parser that consumes no input but returns what was parsed.
 */
var lookaheadParser = function(p) {
    return function LOOKAHEAD_PARSER(state, cok, cerr, eok, eerr) {
        var ok = function(item /*, _*/) { return eok(item, state); };
        return cont(p, [state, ok, cerr, eok, eerr]);
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
    return function EITHER_PARSER(state, cok, cerr, eok, eerr) {
        var peerr = function(errFromP) {
            var qeerr = function(errFromQ) {
                return eerr(new MultipleError(errFromP, errFromQ));
            };
            return cont(q, [state, cok, cerr, eok, qeerr]);
        };
        return cont(p, [state, cok, cerr, eok, peerr]);
    };
};

/**
 * Parser that attempts a variable number of parsers in order and returns
 * the value of the first one that succeeds.
 */
var choiceParser = function(/*...*/) {
    return (arguments.length === 0 ?
        neverParser :
        reduce.call(arguments, eitherParser));
};


// Iterative  Parsers
////////////////////////////////////////
var _consParser = function(p, x) {
    return bindParser(p, function(xs) {
        return alwaysParser(stream.cons(x, xs));
    });
};

var _end = alwaysParser(stream.end);

var _optionalValueParser = function(p) {
    return eitherParser(
        attemptParser(p),
        _end);
};

var concatParser = function(p1, p2) {
    return bindParser(p1, function(s1) {
        return bindParser(p2, function(s2) {
            return alwaysParser(stream.concat(s1, s2));
        });
    });
};

/**
 * Consume a finite sequence of parsers, returning the results as a list.
 * 
 * @return Ordered list of results from each parsers.
 */
var sequenceParser = (function(){
    var cons = function(p, q) {
        return bindParser(q,
            bind(_consParser, p));
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
        var safeP = function(state, cok, cerr, eok, eerr) {
            return cont(p, [state, cok, cerr, manyError, eerr]);
        };
        
        return RecParser(function(self) {
            return _optionalValueParser(
                bindParser(safeP,
                    bind(_consParser, self)));
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
    return bindParser(p,
        bind(_consParser, manyParser(p)));
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
        bindParser(p,
            bind(_consParser, timesParser(n - 1, p))));
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
                bindParser(p,
                    bind(_consParser, maxParser(max - 1, p)))));
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
 * Consume 'p' either zero or one time.
 * 
 * @param p Parser to consume zero or one times.
 * 
 * @return Empty list if not consumed or one item list of 'p' result.
 */
var optionalParser = bind(betweenTimesParser, 0, 1);

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
    return bindParser(p,
        bind(_consParser, manyParser(nextParser(sep, p))));
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
    return eitherParser(
        sepBy1(sep, p),
        _end);
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
var tokenParser = function(consume) {
    return function TOKEN_PARSER(state, cok, cerr, eok, eerr) {
        var pos = state.pos,
            input = state.input;
        if (!input) {
            return eerr(new UnexpectError(pos, "end of input"));
        } else {
            var tok = stream.first(input);
            return (consume(tok) ?
                cok(tok, state.next(tok)) :
                eerr(new UnexpectError(pos, "token:'" + tok + "'")));
        }
    };
};

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
var stringParser = function(s, pred) {
    return map.call(s, bind(_charParser, (pred || eq)))
        .concat(alwaysParser(s))
        .reduce(nextParser);
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

// Running
    'runParser': runParser,
    'runStream': runStream,
    'run': run,
    'test': test,
    
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
    
    'sequence': sequenceParser,
    'many': manyParser,
    'many1': many1Parser,
    'times': timesParser,
    'optional': optionalParser,
    'betweenTimes': betweenTimesParser,
    
    'between': betweenParser,
    'sepBy1': sepBy1,
    'sepBy': sepBy,
    
    'choice': choiceParser,

    'token': tokenParser,
    'anyToken': anyTokenParser,

    'character': charParser,
    'string': stringParser
};

});

}(
    typeof define !== 'undefined' ? define : function(factory) { parse = factory(); }
));