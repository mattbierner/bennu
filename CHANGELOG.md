# ChangeLog #

## 10.0.0 - February 1, 2012 ##
* Position changed to use array index only instead of assuming string input.

## 9.1.4 - January 30, 2012 ##
* 'binda' calls 'f' with state as last argument.

## 9.1.3 - January 30, 2012 ##
* Altered how multiple errors are displayed. Errors should now be joined together
  correctly.

## 9.1.2 - January 28, 2012 ##
* Fixed error in 'sepBy' with trailing sep.

## 9.1.1 - January 27, 2012 ##
* Improved 'between' perf about 2x.

## 9.1.0 - January 27, 2012 ##
* Update 'manyStream' to pass along memo table.
* Update exec to take memo table.
* Updated 'manyStream' to return memoized stream.

## 9.0.1 - January 27, 2012 ##
* Updated memo impl to not use trampoline but store values with callbacks. Should
  fix memo stack issues

## 9.0.0 - January 27, 2012 ##
* Refactored all parsers to allow passing a memoization table. params
  are now 'state, m, cok, cerr, eok, eerr'.
* Added 'memo' and 'backtrack' for working with memoization table.
* Changed position to be a prototyped object. Must be called with 'new' now.
  Position can be subclassed now.
* Added state and pos equality tests.
* Renamed 'RecParser' to 'rec' and 'NamedRecParser' to 'RecParser' to make their
  purposes more clear.

## 8.0.2 - January 17, 2012 ##
* Changed 'token' to use own error type to avoid string building until needed.

## 8.0.1 - January 17, 2012 ##
* Changed 'choice' and 'string' to use reduceRight instead of reduce. Should
  improve performance when dealing with many choices and larger inputs.

## 8.0.0 - January 17, 2012 ##
* Renamed 'runParser' to 'runState' and 'testParser' to 'testState'.
* Exported 'exec' for cleanly manually running a parser and correctly extracting
  the results.
* Added 'runMany' for running a parser zero or more times to produce a lazy stream
  of results.

## 7.0.0 - January 13, 2012 ##
* Changed how 'optional' parser works. It returns a value, not a stream. May 
  return a default value as well.
* Exported 'consParser' for working with streams.

## 6.1.0 - January 13, 2012 ##
* Exported 'concatParser' for working with streams.

## 6.0.0 - January 13, 2012 ##
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
