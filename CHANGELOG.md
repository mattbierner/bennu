# ChangeLog #

## 12.2.0 - April 20, 2013 ##
* Added 'parse.then' as opposite of 'parse.next', parse p then q and return p result.

## 12.1.0 - April 20, 2013 ##
* All run and runStream type functions take an optional user data object.
* Added 'parse.expected' parser similar to <?> in parsec for better error 
  messages. Displays an expected message when parser fails without consuming any
  input.

## 12.0.0 - April 19, 2013 ##
* Renamed 'InputState' to 'ParserState'
** 'ParserState.pos' renamed to 'ParserState.position'.
** 'ParserState' added 'userState' property for a user object that can be threaded
  though the parsers.
** 'ParserState' added methods for setting 'input', 'position', and 'userState'.
  Any custom 'ParserState' must implement these.
* Added parsers for getting, setting, and modifying input, position, parser state,
  and user state.
* Ensured that all parsers are functions ('anyToken' was the parser itself before).
* Made 'parse_string.string' and 'parse_string.trie' parsers all or nothing. 
** 'parse_string.string' produces better error messages detailing entire error.
* 'parse.token' onError also called for end of input 

## 11.0.2 - April 15, 2013 ##
* Fixed 'MultipleError' and 'ParserError' not being exported.
* Made choice defer merging errors until needed.

## 11.0.1 - April 15, 2013 ##
* Fixed 'choice' discarding memo table and state.

## 11.0.0 - April 14, 2013 ##
* Added new error object, 'ParserError' for errors with the parsers themselves.
  Used by 'many' when passed infinite parser.
* Renamed 'consParser' to 'cons' and 'concatParser' to 'append'. 
* 'choice' parser now flattens errors into a single 'MultipleError'. Before it 
  returned nested 'MultipleError's.
* 'MultipleError' now takes two arguments, a position and an array of errors. 
  This makes calling easier since Javascript does not support new with vargs well
  and also allows the position of the error to differ from the errors it contains.
* Creating named parsers with 'parse.Parser' now works correctly when passed an
  existing named parser. Before it would throw an error strict mode or worse,
  mutate the object silently. Now it wraps the parser in a named parser.

## 10.4.1 - April 4, 2013 ##
* Update to Nu 2.0.0

## 10.4.0 - March 26, 2013 ##
* Reworked error constructors. Should be more flexible and delay string
  conversion as long as possible.
** 'ParseError' takes a message instead of an array of messages.
** 'ParseError' calls 'errorMessage' to get the message to display.
** 'ExpectError' takes two params, the expected value and an optional found value.
  these may be objects.
** 'UnexpectError' takes an unexpected value. This may be an object.
** 'MultipleError' takes one or more errors instead of just two.
* Builtin error messages have clearer message formatting.
* Never allows an optional 'msg' value. If message is not provided, throws
  'UnknownError'. Otherwise throws a ParseError with 'msg'. 

## 10.3.1 - March 25, 2013 ##
* Fixed 'MultipleError' only listing the last error.

## 10.3.0 - March 25, 2013 ##
* 'parse.token' takes on optional 'err' function to generate the error when
  consume fails.

## 10.2.2 - March 25, 2013 ##
* 'eof' also reports found item on expected error.
* 'eof' uses correct stream operations.

## 10.2.1 - February 23, 2013 ##
* 'binda' no longer passes state.

## 10.2.0 - February 10, 2013 ##
* Updated parse_string parsers to produce better error messages that include
  expected and found token. 
* Corrected string unboxing in parse_string. Now uses valueOf.

## 10.1.1 - February 6, 2013 ##
* Fixed calls to 'Position' in 'run' using old style arguments.

## 10.1.0 - February 5, 2013 ##
* Changed 'Position' to use compare instead of simple equals.

## 10.0.0 - February 1, 2013 ##
* Position changed to use array index only instead of assuming string input.

## 9.1.4 - January 30, 2013 ##
* 'binda' calls 'f' with state as last argument.

## 9.1.3 - January 30, 2013 ##
* Altered how multiple errors are displayed. Errors should now be joined together
  correctly.

## 9.1.2 - January 28, 2013 ##
* Fixed error in 'sepBy' with trailing sep.

## 9.1.1 - January 27, 2013 ##
* Improved 'between' perf about 2x.

## 9.1.0 - January 27, 2013 ##
* Update 'manyStream' to pass along memo table.
* Update exec to take memo table.
* Updated 'manyStream' to return memoized stream.

## 9.0.1 - January 27, 2013 ##
* Updated memo impl to not use trampoline but store values with callbacks. Should
  fix memo stack issues

## 9.0.0 - January 27, 2013 ##
* Refactored all parsers to allow passing a memoization table. params
  are now 'state, m, cok, cerr, eok, eerr'.
* Added 'memo' and 'backtrack' for working with memoization table.
* Changed position to be a prototyped object. Must be called with 'new' now.
  Position can be subclassed now.
* Added state and pos equality tests.
* Renamed 'RecParser' to 'rec' and 'NamedRecParser' to 'RecParser' to make their
  purposes more clear.

## 8.0.2 - January 17, 2013 ##
* Changed 'token' to use own error type to avoid string building until needed.

## 8.0.1 - January 17, 2013 ##
* Changed 'choice' and 'string' to use reduceRight instead of reduce. Should
  improve performance when dealing with many choices and larger inputs.

## 8.0.0 - January 17, 2013 ##
* Renamed 'runParser' to 'runState' and 'testParser' to 'testState'.
* Exported 'exec' for cleanly manually running a parser and correctly extracting
  the results.
* Added 'runMany' for running a parser zero or more times to produce a lazy stream
  of results.

## 7.0.0 - January 13, 2013 ##
* Changed how 'optional' parser works. It returns a value, not a stream. May 
  return a default value as well.
* Exported 'consParser' for working with streams.

## 6.1.0 - January 13, 2013 ##
* Exported 'concatParser' for working with streams.

## 6.0.0 - January 13, 2013 ##
* Updated to use stream.js for iterative parsers. Should improve performance for
  large inputs.
* Added set of eager iterative parsers that transform streams into finite arrays
  before returning.

## 5.0.0 - December 17, 2012 ##
* Token parser calls 'state.next' instead of creating new InputState itself.
  Allows InputState to be subclassed and other implementations passed in when
  running a parser.

## 4.1.0 - December 17, 2012 ##
* Added 'binda' parser that calls apply 'f' with result of 'p'.

## 4.0.0 - December 17, 2012 ##
* Use 'parse' package to access to parse and parse_string.

## 3.1.0 - December 16, 2012 ##
* Added 'sequence' parsing a finite sequence of different parsers.
* Added 'sepBy', 'sepBy1' for parsing list or infix operator type input.

## 3.0.0 - December 3, 2012 ##
* Renamed exported 'char' parser 'character' because ECMAScript 3 reserves char keyword.
* Added 'parse_string.trie' parser for parsing large sets of words.

## 2.0.0 - December 2, 2012 ##
* Moved Parse string specific parsers to own file to better separate when string
  input is assumed.
* 'parse.char' and 'parse.string' do strict equal. Also can be given own
  predicate compare. Does not convert to string.
* 'parse_string.char' and 'parse_string.string' have old logic, unboxing string
  objects for comparison.
* Renamed 'Parser' constructor 'RecParser'.
* Added new 'Parser' constructor for creating named parsers. Also, 'NamedRecParser'.

## 1.0.1 - Nov 27th, 2012 ##
* Rewrote 'betweenTimes' parser.
* Updated implementation of consume multiple parsers.

## 1.0.0 - Nov 25th, 2012 ##
* Constant parsers (letter, space, ... ) use object instead of constant function.
* Added anyToken parser that accepts any token. Different in behavior than anyChar.

## 0.6.0 - Nov 25th, 2012 ##
* Added 'test' to test if a parser succeeds or fails for a given input.

## 0.5.0 - Nov 15th, 2012 ##
* Added 'optional' parser to consume item zero or one time.
* Added 'betweenTimes' parser to consume item between a min and max times.

## 0.4.0 - Nov 13th, 2012 ##
* Fixed creating String objects instead of string literals.
* Added stream style input.
* Added runStream function for parsing streams.

## 0.3.0 - Nov 10th, 2012 ##
* Fixed 'char' when passing in string Objects.
* Fixed 'eof' negation.
* Added 'Parser' function for defining parsers recursively.

## 0.2.0 - Nov 9th, 2012 ##
* Fixed stack size for large inputs and recursive parsers.
* Cleanup implementation.
* Performance improvements.

## 0.1.0 - Nov 9th, 2012 ##
* Initial Release
