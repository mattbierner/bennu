---
layout: base
---

Bennu is a Javascript [parser combinator][ParserCombinators] library based on [Parsec][Parsec].
The Bennu library consists of a core set of parser combinators that implement [Fantasy Land's Specification][fantasy-land],
while also providing more advanced functionality like advanced error messaging,
[custom parser state](https://github.com/mattbierner/bennu/wiki/Custom-Parser-State),
memoization, and [running unmodified parsers incrementally](http://blog.mattbierner.com/incremental-parsing-with-feedback-in-a-web-worker/).

Bennu works with Node or in browsers using AMD. With Bennu, you do do everything
from rapidly prototyping a binary parser, to [parsing Javascript](parse-ecma), to
incrementally parsing user keyboard input in real time.

## Basics

### This is a Bennu parser

`always` returns its value, `'a'` in this case, without consuming any input.

``` javascript
parse.always('a');
```

### You run a parser against input with `run`

Since `always` consumes no input, it doesn't matter what you pass in.

``` javascript
parse.run(parse.always('a'), ''); // a
parse.run(parse.always('a'), 'xyz'); // a
```

### `never` always fails without consuming any input


``` javascript
parse.never('ERROR');
```

The default behavior when you run a parser that fails is to throw the result, but
this can be customized.

``` javascript
parse.run(parse.never('ERROR'), ''); // Throws 
parse.run(parse.never('ERROR'), 'xyz'); // Throws 
```

### `bind` combines two parsers

Bind runs a parser, and calls a function with the result only if the parser succeeded.
The function returns the next parser to run. Note how parsers can work with any data types, not just strings.


``` javascript
var sqr = parse.bind(parse.always(3), function(x) {
    return parse.always(x * 2);
});

parse.run(sqr, 123); // 6
```

### Bennu parsers also implement [Fantasy Land interfaces][fantasy-land]
Bennu implements the Monad, Monoid, Semigroup, Functor, and Applicative functor interfaces.

``` javascript
var p = parse.of(3)
    .chain(function(x) {
        return parse.of(x * 2);
    })
    .map(function(x) {
        return x + 100;
    });

parse.run(p, ''); // 106
```


## String Parsers
Bennu includes a few core modules, including [text](https://github.com/mattbierner/bennu/wiki/text)
for working with strings and character data.

### `parse_text.character` consumes a single character

```
var a = parse_text.character('a');

parse.run(a, 'a'); // 'a'
parse.run(a, 'abc'); // 'a'
parse.run(a, ''); // Expected 'a' found end of input
parse.run(a, 'bc'); // Expected 'a' found b
```

### `parse_text.oneOf` consumes any single character for a set

```
var abc = parse_text.oneOf('abc');

parse.run(abc, 'a'); // 'a'
parse.run(abc, 'c'); // 'c'
parse.run(abc, ''); // Expected 'abc', found EOF
parse.run(abc, 'z'); // Expected 'abc', found 'z'
```

### `parse_text.noneOf` consumes any single not in a set

```
var notAbc = parse_text.noneOf('abc');

parse.run(notAbc, 'd'); // 'd'
parse.run(notAbc, 'c'); // 'c'
parse.run(notAbc, ''); // Expected not 'abc', found EOF
parse.run(notAbc, 'a'); // Expected not 'abc', found 'a'
```

### `parse_text.string` consumes a sequence of characters

```javascript
var abc = parse_text.string('abc');

parse.run(abc, 'abc'); // 'abc'
parse.run(abc, 'abcdefg'); // 'abc'
parse.run(abc, 'ac'); // Expected 'c', found EOF
parse.run(abc, 'axc'); // Expected 'b', found 'x'
```

### Parsers for a few general ASCII character sets are included

```javascript
parse_text.anyChar; // any character
parse_text.space; // any whitespace character
parse_text.anyLetter; // a-z
parse_text.anyDigit; // 0-9
```

## Sequencing

### `parse.next` runs one parser and then another
The second parser is only run if the first succeeds. Outputs the result of the
second parser.

``` javascript
var a = parse_text.character('a'),
    b = parse_text.character('b');

var ab = parse.next(a, b);

parse.run(ab, 'abc'); // 'b'
parse.run(ab, 'ac'); // Expected 'b' found 'c'
parse.run(ab, 'xyz'); // Expected 'a' found 'x'
```

### `parse.sequence` is like `next` for many parsers

```javascript
var a = parse_text.character('a'),
    b = parse_text.character('b'),
    c = parse_text.character('c');

var ab = parse.sequence(a, b, c);

parse.run(ab, 'abc'); // 'c'
```

### `parse.many` runs a parser zero or more times, until it fails

The result is a [Nu][nu] stream of results.

```javascript
var p = parse.many(parse_text.character('a'));
parse.run(p, ''); // empty stream 
parse.run(p, 'z'); // empty stream
parse.run(p, 'a'); // stream of ['a'] 
parse.run(p, 'aaa'); // stream of ['a', 'a', 'a'] 
parse.run(p, 'aabaa'); // stream of ['a', 'a'] 
```

### You can use `parse.eager` to convert the result of `many` to a Javascript array

```javascript
var p = parse.eager(parse.many(parse_text.character('a')));
parse.run(p, ''); // []
parse.run(p, 'z'); // []
parse.run(p, 'a'); //  ['a'] 
parse.run(p, 'aaa'); //  ['a', 'a', 'a'] 
parse.run(p, 'aabaa'); //  ['a', 'a'] 
```

### `parse.many1` runs a parser one or more times.

```javascript
var p = parse.many1(parse_text.character('a'));
parse.run(p, ''); // Error!
parse.run(p, 'z'); // Error!
parse.run(p, 'a'); // stream of ['a'] 
parse.run(p, 'aaa'); // stream of ['a', 'a', 'a'] 
parse.run(p, 'aabaa'); // stream of ['a', 'a'] 
```

Other [sequencing combinators](https://github.com/mattbierner/bennu/wiki/parse#enumeration) are also included.

## Choice

### `parse.either` is the base choice combinator.
It runs one parser and only if that fails, runs another. Returns the result from
the first parser to succeed. If both parsers fail, `either `combines the error
messages.

```javascript
var p = parse.either(
    parse_text.character('a'),
    parse_text.character('b'));

parse.run(p, 'a'); // a 
parse.run(p, 'b'); // b
parse.run(p, 'c'); // Error! MultipleError
```

`either` alone does not automatically [backtrack](http://en.wikipedia.org/wiki/Backtracking),

```
var p = parse.either(
    parse.next(
        parse_text.character('a'),
        parse_text.character('b')),
    parse.next(
        parse_text.character('a'),
        parse_text.character('c')));
        
parse.run(p, 'ab'); // b
parse.run(p, 'ac'); // Error!
// First parser succeeded on first 'a' then failed.
// When it attempts next choice, it fails since 'b' is next
// in the input.
```

###  But you can easily add backtracking with `parse.attempt`

```javascript
var p = parse.either(
    parse.attempt(parse.next(
        parse_text.character('a'),
        parse_text.character('b'))),
    parse.next(
        parse_text.character('a'),
        parse_text.character('c')));

parse.run(p, 'ab'); // b
parse.run(p, 'ac'); // c
parse.run(p, 'z'); // Error! MultipleError 
```

### `parse.choice` is like either for multiple parsers
Attempts a variable number of parser in order until one succeeds or all fail. Returns result of first to succeed.

``` javascript
var p = parse.choice(
    parse_text.character('a'),
    parse_text.character('b'),
    parse_text.character('c'));
    
parse.run(p, 'a'); // a
parse.run(p, 'b'); // b
parse.run(p, 'c'); // c
parse.run(p, 'z'); // Error! MultipleError
```

### You can choose to consume a value with `parse.optional`
It returns the result of a parser, or a default value if the parser fails.

```javascript
var p = parse.optional('def', parse_text.character('b'));
parse.run(p, 'b'); // b
parse.run(p, ''); // 'def'
parse.run(p, 'z'); // 'def'
```

## More Complex Combinators
Bennu's [lang module](https://github.com/mattbierner/bennu/wiki/lang) includes a number of
parsers for more complex languages.

### `parse_lang.times` runs a parser a set number of times.

```javascript
var p = parse_lang.times(2, parse_text.character('a'));
parse.run(p, ''); // Error!
parse.run(p, 'z'); // Error!
parse.run(p, 'a'); // Error!
parse.run(p, 'aa'); // stream of ['a', 'a'] 
parse.run(p, 'aaaa); // stream of ['a', 'a'] 
```

### You can parse things Javascript array literal notation with `parse_lang.between`
It runs an open parser, then a body parser, then a closing parser. The result is
the value from the body parser.

```javascript
var p = parse_lang.between(
    parse_text.character('['), // open
    parse_text.character(']'), // close
    parse.many(parse_text.character('a'))); // body
   
parse.run(p, ''); // Error!
parse.run(p, '['); // Error!
parse.run(p, ']'); // Error!
parse.run(p, '[]'); // stream of []
parse.run(p, '[a]'); // stream of ['a'] 
parse.run(p, '[aa'); // Error!
parse.run(p, '[aaa]'); // stream of ['a', 'a', 'a'] 
```

### Or comma separated lists with `parse_lang.sepBy`
Parser that consumes a element parser separated by a separator parser zero or more times.

``` javascript
var p = parse_lang.sepBy(
    parse_text.character(','),
    parse_text.character('a'));
    
parse.run(p, ''); // stream of []
parse.run(p, 'x'); // stream of []
parse.run(p, ','); // stream of []
parse.run(p, 'a'); // stream of ['a']
parse.run(p, 'abc'); // stream of ['a'] 
parse.run(p, 'a,a'); // stream of ['a', 'a']
parse.run(p, 'a,xyz'); // stream of ['a']
```

`parse_lang` includes [many other](https://github.com/mattbierner/bennu/wiki/lang) 
Parsec inspired combinators as well.


## Running Incrementally
Almost any Bennu parser can be run incrementally using the [incremental module](https://github.com/mattbierner/bennu/wiki/incremental).


### First define your parser
``` javascript
var p = parse.eager(parse.many(parse.anyToken)));
```

### Start parsing

``` javascript
var s = parse_inc.runInc(p);
```

### And feed it data (as a [Nu][nu] stream) with `provide`
`finish` signals the end of input and gets the result.

```javascript
var c1 = parse_inc.provide(stream.from('a'), c);
parse_inc.finish(c1); // 'a'
```

### You can feed any number and sized of chunks to a parser and finish it multiple
times to get real time parsing feedback

``` javascript
var c2 = parse_inc.provide(stream.from('bc'), s);
parse_inc.finish(c2); // 'abc';

// Feeding alt input to `c1`.
var c3 = parse_inc.provide(stream.from('yx'), c1);
parse_inc.finish(c3); // 'axy';
```


## More
This page only provides a brief introduction to Bennu. Check out the [documentation][documentation]
for the complete Bennu API and more examples. Or checkout out the [source][source]
on github.




[documentation]: https://github.com/mattbierner/bennu/wiki
[Nu]: http://mattbierner.github.io/nu/

[ParserCombinators]: http://en.wikipedia.org/wiki/Parser_combinator

[Parsec]: https://www.haskell.org/haskellwiki/Parsec

[source]: https://github.com/mattbierner/bennu
[parse-ecma]: https://github.com/mattbierner/parse-ecma
[fantasy-land]: https://github.com/fantasyland/fantasy-land

