(function(define){

define(function() {
//"use strict";

/* Prototypes
 ******************************************************************************/
var concat = Array.prototype.concat;
var join = Array.prototype.join;
var map = Array.prototype.map;
var slice = Array.prototype.slice;
var push = Array.prototype.push;
var reduce = Array.prototype.reduce;

var regExpTest = RegExp.prototype.test;

var _bind = Function.prototype.bind;

/* Helpers
 ******************************************************************************/
var bind = function(f /*, ...*/) {
    return (arguments.length === 1 ? f : _bind.apply(f, arguments));
};

var identity = function(v) { return v; };

var constant = bind(bind, identity);

var throwConstant = function(err) {
    return function() {
        throw err;
    };
};

var compose = function(f, g) {
    return function(/*...*/) {
        return f(g.apply(undefined, arguments));
    };
};

var asStream = (function() {
    var Stream = function(s, i, len) {
        this.s = s;
        this.i = i;
        this.length = len;
    };
    Stream.prototype.first = function() {
        return this.s[this.i];
    };
    Stream.prototype.rest = function() {
        return (this.i + 1 === this.length ? null :
            new Stream(this.s, this.i + 1, this.length));
    };
    
    return function(s) {
        return (s === undefined || s.length === 0 ? null : new Stream(s, 0, s.length));
    };
}());

var cont = function() {
    return Object.defineProperty(bind.apply(undefined, arguments), '_next', {
        'value': true,
        'writable': false
    });
};

var trampoline = function(f) {
    var value = f;
    while (value && value._next) {
        value = value();
    }
    return value;
};


/* Exported Objects
 ******************************************************************************/
// Records
////////////////////////////////////////
/**
 * Object used to track a Parser's state.
 * 
 * @param input Input to the parser.
 * @param pos Current position of head of input.
 * 
 * @returns InputState object for given input and position.
 */
var InputState = function(input, pos) {
    return Object.freeze({
        'input': input,
        'pos': pos
    });
};

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

// Errors
////////////////////////////////////////
/**
 * Parser Error
 * @constructor
 * @implements {Error}
 * 
 * @param pos The Position of the first parser error.
 * @param {Array} messages Order collection of parser error messages.
 */
var ParseError = function(pos, messages) {
    this.messages = messages;
    this.pos = pos;
};
ParseError.prototype = new Error();
ParseError.prototype.constructor = ParseError;
ParseError.prototype.name = "ParseError";

Object.defineProperty(ParseError.prototype, 'message', {
    'get': function() {
        return "At position:" + this.pos + " [" + (this.messages ? join.call(this.messages, ', ') : '') + ']';
    }
});

/**
 * Merges two ParserErrors into a single ParserError.
 */
var MultipleError = function(e1, e2) {
     return new ParseError(e1.pos, (e1.messages ?
        concat.apply(e1.messages, e2.messages) :
        e2.messages));
};
MultipleError.prototype = new ParseError();
MultipleError.prototype.constructor = MultipleError;
MultipleError.prototype.name = "MultipleError";

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

// Running
////////////////////////////////////////
/**
 * Create a parser with a given function body. Parser is defined by a create
 * function that is passed itself as first argument.
 * 
 * Allows easy self references in parser.
 * 
 * @param body The body of the parser.
 */
var Parser = function(body) {
    var value;
    return (value = body(function(/*...*/) { return value.apply(this, arguments); }));
};

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
var runParser = _makeParser(function(c){
    return function(){ return c; };
}, throwConstant);

/**
 * Run a given parser against an input stream.
 * 
 * @param p Parser to run.
 * @param stream An array of characters to run the parser against. May be a string,
 *     array, or array-like object.
 */
var runStream = function(p, stream) {
    return runParser(p, InputState(stream, Position(1, 1)));
};

/**
 * Run a given parser against an input string.
 * 
 * @param p Parser to run.
 * @param input An array of characters to run the parser against. May be a string,
 *     array, or array-like object.
 */
var run = function(p, input) {
    return runStream(p, asStream(input));
};

var testParser = _makeParser(constant(constant(true)), constant(constant(false)));


var testStream = function(p, stream) {
    return testParser(p, InputState(stream, Position(1, 1)));
};

/**
 * Tests a given parser against an input string.
 * 
 * @param p Parser to run.
 * @param input An array of characters to run the parser agains. May be a string,
 *     array, or array-like object.
 *
 * @return Did the parser successfully run?
 */
var test = function(p, input) {
    return testStream(p, asStream(input));
};

// Base Parsers
////////////////////////////////////////
/**
 * Parser that always succeeds with a given value and consumes no input.
 * 
 * @param x Value to yield.
 */
var alwaysParser = function(x) {
    return function(state, cok, cerr, eok /*, _*/) {
        return eok(x, state);
    };
};

/**
 * Parser that always fails and consumes no input.
 */
var neverParser = constant(function(state, cok, cerr, eok, eerr) {
    return eerr(new UnknownError(state.pos));
});

/**
 * Parser that parses 'p' then 'q' where 'q' is given by a function 'f'.
 * Returns the 'q' value.
 */
var bindParser = function(p, f) {
    return function BIND_PARSER(state, cok, cerr, eok, eerr) {
        var pcok = function(v, state) { return cont(f(v), state, cok, cerr, cok, cerr); },
            peok = function(v, state) { return cont(f(v), state, cok, cerr, eok, eerr); };
        return cont(p, state, pcok, cerr, peok, eerr);
    };
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
        return cont(p, state, cok, eerr, eok, eerr);
    };
};

/**
 * Parser that consumes no input but returns what was parsed.
 */
var lookaheadParser = function(p) {
    return function LOOKAHEAD_PARSER(state, cok, cerr, eok, eerr) {
        var ok = function(item /*, _*/) { return eok(item, state); };
        return cont(p, state, ok, cerr, eok, eerr);
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
            return cont(q, state, cok, cerr, eok, qeerr);
        };
        return cont(p, state, cok, cerr, eok, peerr);
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


// Repeat Parsers
////////////////////////////////////////
var _concatToParser = function(p, x) {
    return bindParser(p,
        compose(alwaysParser, concat.bind(x)));
};

var _concatParser = function(p, x) {
    return _concatToParser(p, [x]);
};

var _end = alwaysParser([]);

var _optionalValueParser = function(p) {
    return eitherParser(attemptParser(p), _end);
};


/**
 * Parser that consumes 'p' zero or more times. Returns an array of consumed input.
 */
var manyParser = (function(){
    var manyError = function() {
        throw new Error("Many parser applied to a parser that accepts an empty string");
    };
    
    return function MANY_PARSER(p) {
        var safeP = function(state, cok, cerr, eok, eerr) {
            return cont(p, state, cok, cerr, manyError, eerr);
        };
        
        return Parser(function(self) {
            return _optionalValueParser(
                bindParser(safeP,
                    bind(_concatParser, self)));
        });
    };
}());

/**
 * Parser that consumes 'p' 1 or more times.
 */
var many1Parser = function(p) {
    return bindParser(p,
        bind(_concatParser, manyParser(p)));
};

/**
 * Consumes p 'n' times.
 * 
 * @param {Number} n Number of times to consume p.
 * @param p Parser to consume.
 */
var timesParser = function(n, p) {
    return (n <= 0 ? _end : 
        bindParser(p, bind(_concatParser, timesParser(n - 1, p))));
};

/**
 * Consumes 'p' either zero or one time.
 */
var optionalParser = (function(){
    var wrap = function(x) {
        return alwaysParser([x]);
    };
    
    return function(p) {
        return _optionalValueParser(bindParser(p, wrap));
    };
}());

/**
 * Consumes 'p' between 'min' and 'max' times.
 * 
 * @param {Number} min Minimum number of times to consume 'p'.
 * @param {Number} max Maximum umber of times to consume 'p'.
 * @param p Parser to consume.
 */
var betweenTimesParser = (function(){
    var maxParser = function(max, p) {
        return (max <= 0 ? _end :
            _optionalValueParser(
                bindParser(p,
                    bind(_concatParser, maxParser(max - 1, p)))));
    };
    
    return function(min, max, p) {
        return (max < min ? neverParser :
            bindParser(timesParser(min, p),
                bind(_concatToParser, maxParser(max - min, p))));
    };
}());

var betweenParser = function(open, close, p) {
    return nextParser(open, bindParser(p, function(body) {
        return nextParser(close, alwaysParser(body));
    }))
};


// Token Parsers
////////////////////////////////////////
/**
 * Parser that consumes a single item from the head of the input if consume is
 * true. Fails to consume input if consume is false or input is empty.
 * 
 * @param {function(string): boolean} consume Function that tests if a character should be consumed.
 */
var tokenParser = function(consume) {
    return function TOKEN_PARSER(state, cok, cerr, eok, eerr) {
        var pos = state.pos;
        if (!state.input) {
            return eerr(new UnexpectError(pos, "end of input"));
        } else {
            var tok = state.input.first();
            return (consume(tok) ?
                cok(tok, InputState(state.input.rest(), Position.increment(pos, tok))) :
                eerr(new UnexpectError(pos, "token:'" + tok + "'")));
        }
    };
};

/**
 * Parser that consumes any token.
 */
var anyTokenParser = tokenParser(constant(true));

/**
 * Parser that consumes a given character. 
 * 
 * Unboxes string Objects
 * 
 * @param c The char to consume.
 */
var charParser = function(c) {
    return tokenParser(function(token) {
        return (c.toString() === token.toString());
    });
};

/**
 * Parser that consumes a given string.
 * 
 * @param {String} s String to consume.
 */
var stringParser = function(s) {
    return map.call(s, charParser)
        .concat(alwaysParser(s))
        .reduce(nextParser);
};

/**
 * Parser that consumes any character.
 */
var anyCharParser = tokenParser(regExpTest.bind(/^.$/));

/**
 * Parser that consumes any letter character.
 * 
 */
var letterParser = tokenParser(regExpTest.bind(/^[a-z]$/i));

/**
 * Parser that consumes any space character.
 * 
 */
var spaceParser = tokenParser(regExpTest.bind(/^\s$/i));


/**
 * Parser that consumes any number character.
 */
var digitParser = tokenParser(regExpTest.bind(/^[0-9]$/i));


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
    
// Parsers
    'always': alwaysParser,
    'never': neverParser,
    'bind': bindParser,
    'eof': eofParser,
    
    'extract': extractParser,
    'examine': examineParser,
    
    'attempt': attemptParser,
    'lookahead': lookaheadParser,

    'next': nextParser,
    'either': eitherParser,
    'many': manyParser,
    'many1': many1Parser,
    'times': timesParser,
    'optional': optionalParser,
    'betweenTimes': betweenTimesParser,
    'between': betweenParser,
    'choice': choiceParser,
    
    'token': tokenParser,
    'anyToken': anyTokenParser,

    'char': charParser,
    'string': stringParser,
    'anyChar': anyCharParser,
    'letter': letterParser,
    'space': spaceParser,
    'digit': digitParser,
    
// Running
    'Parser': Parser,
    'runParser': runParser,
    'runStream': runStream,
    'run': run,
    'test': test
};

});

}(
    typeof define !== 'undefined' ? define : function(factory) { parse = factory(); }
));