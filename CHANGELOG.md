# ChangeLog #

## 16.1.1 - Jan 22, 2014
* Fixed certain edge cases creating large a stack.
* Fixed `Parser` called on existing parser being an error.

## 16.1.0 - Jan 20, 2014
* Added node package.

## 16.0.6 - December 16, 2013
* Changed pruning to be more aggressive.
* Removed `parserId` from parser since memo table is no longer a Javascript object.

## 16.0.5 - December 16, 2013
* Defunctionalized the values stored in memo tables for better performance.
  
## 16.0.4 - December 11, 2013
* Further improved tail call performance.

## 16.0.3 - December 10, 2013
* Changed tail call implementation to use best performing version from: 
 http://jsperf.com/external-tail-calls/2

## 16.0.2 - November 16, 2013
* Fixed bug causing certain edge case incremental parsers to fail
  when used with a backtracking parser at eof.

## 16.0.1 - November 15, 2013
* Fixed a bug in look and lookahead that caused them to call `cok` instead of
  `eok`, potential leading to incorrect behavior when used in a either.

## 16.0.0 - November 15, 2013
* Updated to nu V3.0.0
* Library files now live in `dist`.

## 15.3.1 - November 15, 2013
* Updated `parse.lookahead` to also restore old position. Its behavior is now
  to merge the old position and input into the new state.

## 15.3.0 - November 14, 2013
* Changed `parse.lookahead` to merge state with old input. This is what the
  documentation said the parser does.
* Added `parse.look` that does what `parse.lookahead` used to do. This is the
  same as parsec's lookahead.

## 15.2.0 - November 13, 2013
* Added `enumerations`, `choices`, and `sequences` for combining finite
  streams of parsers.
* Fixed `lang.betweenTimes` to work with infinite upper bound.
* Added `lang.atMostTimes` to consume `p` up to `n` times.

## 15.1.1 - November 12, 2013
* Fixed `parse_text.characters` to work with array-likes.

## 15.1.0 - November 5, 2013
* Added `parse_text.characters` for selecting any from a set of characters.
** Performs in constant time vs the linear `parse.choice` of characters.
* Changed `parse_text.trie` to be more efficient.
** Improves performance when used with a large set of words.
* Shorter and clearer error messages for tries.

## 15.0.4 - November 2, 2013
* Changed incremental state empty check to better delegate to inner state instead
  of assuming empty rest of input means state is empty.

## 15.0.3 - Oct 31, 2013
* Fixed `incremental` state not correctly forwarding properties to inner state.

## 15.0.2 - Oct 31, 2013
* Fixed `incremental.provide` to be noop when providing empty stream.

## 15.0.1 - Oct 31, 2013
* Fixed test returning function of result instead of result.

## 15.0.0 - Oct 31, 2013
* Added module for creating incremental parsers.
** Incremental parser are be feed data incrementally and will parse as much as
  possible before waiting for more data.
** A single incremental parser can also be branched by feeding different input
  streams.
* Changed outermost continuation to only be a single level function.
** This means that any thrown errors may take place inside of the parser itself
  in edge cases, but this should not effect the interfaces.
** Also, parsers can now better return abrupt completions.
* Eliminated `parse.perform` since all parsers work that way now.
* Added `parse.parser*` functions for easily passing success and error continuations
  to parsers.
* Moved `runMany` running to incremental module.
* Exported `tail` and `trampoline` to support recreating internal tail call logic.

## 14.2.1 - October 10, 2013
* Fixed for Chrome's broken `Error.prototype.toString` preventing errors from
  printing anything useful.

## 14.2.0 - September 15, 2013
* Added support for parsing potential invalid inputs (streams that error while
  evaluating). The first input element must be valid but after that, a custom
  parser state can be used to catch error attempting to get the next state after
  a token has been consumed.
* Changed `ParserState.prototype.next` to return a parser instead of the next
  state. This allows the next call to potentially fail and can map any errors
  to parser errors.

## 14.1.1 - September 12, 2013
* Fixed `perform` only calling callbacks with yielded value, not state as well.

## 14.1.0 - September 12, 2013
* Moved `isEmpty` and first logic onto parser state instead of using `input` stream
  directly. This allows more customized behavior.

## 14.0.1 - September 12, 2013
* Fixed memoization returning old values if the parser changes the input.
* Memoization now also takes the state into account for lookup.

## 14.0.0 - September 10, 2013
* Changed `parse.sequence` to return last element from a set of 1 or more parser.
* Added `parse.enumeration` to return stream of parser results.
* Removed `parse.string` as it basically does the same thing as `parse.enumeration`
  and the name is confusing when `parse_string.string` exists.
* Removed `parse.character` as the name is confused with `parse_text.character`.
* Changed state getters to be actual parsers and not functions.
* Changed eof to be parser and not function.
* Removed `ParserState.prototype.eq` as it generally does not do what is expected
  and the logic it uses should not be exposed.
* Added concept of windows to memoization to automatically prune memoized results.
* Removed `parse.backtrack` as it is not needed with windows.
* Added `parse_text.match` for a character level regular expression test.
* Added both array and argument versions of parsers that take a variable number
  of parsers, `choice and choicea, sequence and sequencea, enumeration and enumerationa`
* Refactored `parse_text.string` to generally improve performance.

## 13.0.4 - August 29, 2013
* Updated nu

## 13.0.3 - July 27, 2013 ##
* Fixed `trie` to always match longest and possibly backtrack and added trie
  tests.

## 13.0.2 - July 16, 2013 ##
* Small formatting changes, updated Nu to V2.0.5.

## 13.0.1 - July 16, 2013 ##
* Fixed trie khepri related issue.

## 13.0.0 - May 23, 2013 ##
* Removed 'parse_eager' module and replaced it with 'parse.eager' parser.
** 'parse.eager' takes a parser and flattens resulting stream into an array.
* Added 'parse_lang' module for language type parsers.
** 'times', 'betweenTimes', 'sepBy', 'sepBy1', 'between', and 'then' and
  then parsers all moved to 'parse_lang.'
* Added 'sepEndBy', 'sepEndBy1', 'endBy', 'endBy1', 'chainr1', 'chainr',
  'chainl1', 'chainl' parsers to 'parse_lang' to bring more in line with parsec.
* Renamed 'binda' 'binds'.
* Added 'perform' running function for simple, direct callbacks instead of the
  two levels 'exec' uses.
* 'betweenTimes'and 'choice' throw 'ParserError' on construction if bad params
  supplied instead of at runtime.
* 'anyToken' is object again instead of function.
* 'Added ids to string character type parsers and 'anyToken'.

## 12.4.0 - May 20, 2013 ##
* Added 'Position.initial' object for initial position instead of 'new Position(0)'.

## 12.3.0 - April 20, 2013 ##
* Clarified that 'parse.sepBy' should not backtrack.

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
