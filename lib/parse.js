(function(define){

define(function() {
"use strict";

/* Prototypes
 ******************************************************************************/
var concat = Array.prototype.concat;
var join = Array.prototype.join;
var map = Array.prototype.map;
var slice = Array.prototype.slice;
var reduce = Array.prototype.reduce;

var test = RegExp.prototype.test;

/* Helpers
 ******************************************************************************/
var bind = function(f /*, ...*/) {
    return Function.prototype.bind.apply(f,
        [undefined].concat(slice.call(arguments, 1)));
};

var identity = function(v) { return v; };

var constant = function(v) { return bind(identity, v); };

var equal = function(a, b) {
    return (a === b);
};

var first = function(v) {
    return v[0];
};

var rest = function(v) {
    return slice.call(v, 1);
};

var repeat = function(n, v) {
    var arr = [];
    for (var i = 0; i < n; ++i) {
        arr[i] = v;
    }
    return arr;
};


/* Exported Objects
 ******************************************************************************/

// Records
////////////////////////////////////////

/**
 * 
 */
var InputState = function(input, pos) {
    return Object.create(Object.prototype, {
        'input': {
            'value': input,
            'writable': false
        },
        'pos': {
            'value': pos,
            'writable': false
        }
    });
};

/**
 * 
 */
var Position = (function(){
    var Pos = function(line, column) {
        this.line = line;
        this.column = column;
    };
    
    Pos.prototype.toString = function() {
        return "{line: " + this.line + " col: " + this.column + "}";
    };
    
    return function(line, column) {
        return Object.freeze(new Pos(line, column));
    };
}());

/**
 * 
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
    
    this.message =  "At position:" + pos + " [" + (messages ? join.call(messages, ', ') : '') + ']';
};
ParseError.prototype = new Error();
ParseError.prototype.constructor = ParseError;
ParseError.prototype.name = "ParseError";

/**
 * Merges two ParserErrors into a single ParserError.
 */
ParseError.mergeErrors = function(e1, e2) {
    return new ParseError(e1.pos,
        (e1.messages ? concat.apply(e1.messages, e2.messages) : e2.messages));
};

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


// Base Parsers
////////////////////////////////////////

/**
 * Parser that always succeeds with a given value and consumes no input.
 * 
 * @param x Value to yield.
 */
var alwaysParser = function(x) {
    return function(state, cok, cerr, eok, eerr) {
        return eok(x, state);
    };
};

/**
 * Parser that always fails and consumes no input.
 */
var neverParser = constant(function(state, cok, cerr, eok, eerr) {
    return eerr(new UnknownError(state), state);
});

/**
 * Parser that parses 'p' then 'q' where 'q' is given by a function 'f'.
 * Returns the 'q' value.
 */
var bindParser = function(p, f) {
    return function(state, cok, cerr, eok, eerr) {
        var pcok = function(v, state) { return f(v)(state, cok, cerr, cok, cerr); },
            peok = function(v, state) { return f(v)(state, cok, cerr, eok, eerr); };
        return p(state, pcok, cerr, peok, eerr);
    };
};

/**
 * Parser that matches end of input. If end of input, succeeds with null.
 */
var eof = constant(function(state, cok, cerr, eok, eerr) {
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
    return function(state, cok, cerr, eok, eerr) {
        return eok(f(state), state)
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
    return function(state, cok, cerr, eok, eerr) {
        return p(state, cok, eerr, eok, eerr);
    };
};

/**
 * Parser that consumes no input but returns what was parsed.
 */
var lookaheadParser = function(p) {
    return function(state, cok, cerr, eok, eerr) {
        var ok = function(item /*, _*/) { return eok(item, state); };
        return p(state, ok, cerr, eok, eerr);
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
    return function(state, cok, cerr, eok, eerr) {
        var peerr = function(errFromP) {
            var qeerr = function(errFromQ) {
                return eerr(ParseError.mergeErrors(errFromP, errFromQ));
            };
            return q(state, cok, cerr, eok, qeerr);
        };
        return p(state, cok, cerr, eok, peerr);
    };
};

/**
 * Parser that attempts a variable number of parsers in order and returns
 * the value of the first one that succeeds.
 */
var choiceParser = function(/*...*/) {
    return (arguments.length === 0 ? neverParser :
        reduce.call(arguments, eitherParser));
};


// Repeat Parsers
////////////////////////////////////////
/**
 * Parser that consumes 'p' zero or more times. Returns an array of consumed input.
 */
var manyParser = (function(){
    var manyError = function() {
        throw new Error("Many parser applied to a parser that accepts an empty string");
    };
    
    return function(p) {
        var safeP = function(state, cok, cerr, eok, eerr) {
            return p(state, cok, cerr, manyError, eerr);
        };
        
        return eitherParser(
            bindParser(safeP, function(x) {
                return bindParser(manyParser(safeP), function(xs) {
                    return alwaysParser(concat.apply([x], xs));
                });
            }),
            alwaysParser([])
        );
    };
}());

/**
 * Parser that consumes 'p' 1 or more times.
 */
var many1Parser = function(p) {
    return bindParser(p, function(x) {
        return bindParser(manyParser(p), function(xs) {
            return alwaysParser(concat.apply([x], xs));
        });
    });
};

/**
 * Consumes p 'n' times.
 */
var timesParser = function(n, p) {
    if (n <= 0) {
        return alwaysParser([]);
    } else {
        return function(state, cok, cerr, eok, eerr) {
            var pcok = function(item, state) {
                var qcok = function(items, state) {
                    return cok(concat.apply(item, items), state);
                };
                return timesParser(n - 1, p)(state, qcok, cerr, qcok, eerr);
            };
            
            var peok = function(item, state) {
                return eok(repeat(n, item), state);
            };
            return p(state, pcok, cerr, peok, eerr);
        };
    }
};

// Token Parsers
////////////////////////////////////////
/**
 * Parser that consumes a single item from the head of the input if consume is
 * true. Fails to consume input if consume is false or input is empty.
 */
var tokenParser = function(consume) {
    return function(state, cok, cerr, eok, eerr) {
        var input = state.input, pos = state.pos;
        var tok = first(input);
        if (tok === undefined) {
            return eerr(new UnexpectError(pos, "end of input"));
        } else {
            return (consume(tok) ?
                cok(tok, InputState(rest(input), Position.increment(pos, tok))) :
                eerr(new UnexpectError(pos, "token:'" + tok + "'")));
        }
    };
};

/**
 * Parser that consumes a given character. 
 * 
 * @param c The char to consume.
 */
var charParser = function(c) {
    return tokenParser(bind(equal, c));
};

/**
 * Parser that consumes a given string.
 */
var stringParser = function(s) {
    return concat.call(map.call(s, charParser), alwaysParser(s)).reduce(nextParser);
};

/**
 * Parser that consumes any character.
 */
var anyCharParser = bind(tokenParser, test.bind(/^.$/));

/**
 * Parser that consumes any letter character.
 * 
 */
var letterParser = bind(tokenParser, test.bind(/^[a-z]$/i));

/**
 * Parser that consumes any number character.
 */
var digitParser = bind(tokenParser, test.bind(/^[0-9]$/i));


/* 
 ******************************************************************************/




/* Run
 ******************************************************************************/
/**
 * 
 */
var runParser = (function(){
    var Ok = constant;
    
    var Err = function(err) {
        return function() {
            throw err;
        };
    };
    
    return function(p, state) {
        return p(state, Ok, Err, Ok, Err);
    };
}());

/**
 * 
 */
var run = (function(){
    var extract = function(v) { return v(); };
    
    return function(p, input) {
        return extract(runParser(p, InputState(input, Position(1, 1))));
    };
}());


/* Export
 ******************************************************************************/
return {
// Errors
    'ParseError': ParseError,
    'UnknownError': UnknownError,
    'UnexpectError': UnexpectError,
    'ExpectError': ExpectError,

// Parsers
    'always': alwaysParser,
    'never': neverParser,
    'bind': bindParser,
    'eof': eof,
    
    'extract': extractParser,
    'examine': examineParser,
    
    'attempt': attemptParser,
    'lookahead': lookaheadParser,

    'next': nextParser,
    'either': eitherParser,
    'many': manyParser,
    'many1': many1Parser,
    'times': timesParser,
    'choice': choiceParser,
    
    'token': tokenParser,
    'char': charParser,
    'string': stringParser,
    'anyChar': anyCharParser,
    'letter': letterParser,
    'digit': digitParser,
    
// Running
    'run': run
};

});

}(
    typeof define !== 'undefined' ? define : function(factory) { parse = factory(); }
));