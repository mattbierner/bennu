Seshet
======

Javascript Functional Memorization Utility


## About
Seshat defines a set of operations for working with a two dimensional
data structure for use with memoization. One use case is memoizing
the results of computations in sequence, especially for parsing. The exposed
interfaces are all functional-style.

In most cases, Seshat has good access and update performance by using a self
balancing tree. The tree can also be pruned to discard unreachable values.


# Example

Calculating the Fibonacci sequence is the classic example of why memorization
matters. Although not the best application of Seshat, this demonstration implements
the Fibonacci sequence using Seshat.

### Basic Algorithm

The basic logic for calculating Fibonacci number `n` is:

    var fib = \n ->
        (n < 2 ? n
            fib(n - 1) + fib(n -2));

Written using continuations for clearer translation:

    var fib = \n, k ->
        (n < 2 ?
            k(n)
            fib(n - 1, \x ->
                fib(n - 2, \y ->
                    k(x + y))));

The problem with this approach is that `fib(n - 1)` and `fib(n - 2)` are
recalculated on every call, even when the calculation has been performed before.
Memoization stores past results in a table to provide constant time lookup.
In this problem, only the previous two values need to be stored.

### Basic Memoization

Seshat operates on an memoization data structure, so `fib` is rewritten to take the
opaque memoization table as an argument. The memo table is immutable, and needs
to be threaded though the continuations.

Vales are stored using two dimensional keys. The first part of the key is used
for storing the value in a tree and the second part for looking up a specific
instance of the value on a node.  In the Fibonacci function, only one dimensional
storage is needed. The first part of the key will be the
Fibonacci number, and the second will always be zero.

Updating the `fib` function to take advantage of Seshat, before entering the
Fibonacci logic, the memo table is checked. If a result is found, it is
returned right away. Otherwise, the calculation is performed and the result is stored:

    var fib = \n, m, k -> {
        var found = seshat.lookup(m, x, 0);
        if (found !== null)
            return k(found, m);
        return (n < 2 ?
            k(n, seshat.update(m, n, 0, n)) :
            fib(n - 1, m, \x, m ->
                fib(n - 2, m, \y, m ->
                    k(x + y, seshat.update(m, n, 0, x + y)))));
    };

Now large Fibonacci numbers can be calculated. A key ordering function `compareInt`
is defined for the keys of the memoization table. On the first call of `fib`,
a new, empty memoer is created.

    var compareInt = \x, y ->  x - y;
    
    // JS nums round this from the real result
    fib(100, seshat.create(compareInt), \x, m -> x); // 354224848179262000000


### Pruning
By passing in a continuation that returns the memoization table,
this table can be inspected (This is for demonstration purposes only,
the table should always be treated as an opaque data structure):

    var m = fib(100, seshat.create(compareInt), \_, m -> m);
    
    var count = \root ->
        (!root ? 0 :
            1 + count(root.left) + count(root.right));
    
    count(m.root); // 101 with values from [0 .. 100]

Although 101 entries are stored, only the last two results in the calculations are ever
used. Numbers before `n - 2` are unreachable. The unreachable entries can be pruned
to reduce the size of the tree:

    var fib = \n, m, k -> {
        var found = seshat.lookup(m, x, 0);
        if (found !== null)
            return k(found, m);
        return (n < 2 ?
            k(n, seshat.update(m, n, 0, n)) :
            fib(n - 1, m, \x, m ->
                fib(n - 2, m, \y, m ->
                    k(x + y, seshat.prune(seshat.update(m, n, 0, x + y), n - 1)))));
    };
    
    var m = fib(100, seshat.create(compareInt), \_, m -> m);
    count(m.root); // 2 with values for [99, 100]

The prune uses `n - 1` as the lower bound because the lower bound is inclusive
and only values for `n` and `n - 1` are needed. Although not particularly beneficial
in this case, pruning can reduce memory usage and improving access performance. 

### Hof
Seshat is not designed for direct use. This simplified example demonstrates
using Seshat for memoization of a monadic Fibonacci calculator:

    // Basic Operations
    var ret = \x -> \m, k -> k(x, m);
    var bind = \c, f -> \m, k -> c(m, \x, m -> f(x)(m, k));
    var next = \p, c -> bind(p, \() -> c);
    
    var modifyM = \f -> \m, k -> let x = f(m) in k(x, x);
    var getM = modifyM(\m -> m);
    
    // Memoer Operations
    var update = \key, val ->
        next(
            modifyM(\m -> seshat.update(m, key, 0, val)),
            ret(val));
    
    var lookup = \key, fallback ->
        bind(getM, \m -> 
            let found = seshat.lookup(m, key, 0) in
                (found !== null ? ret(found) : fallback));
    
    // Fibonacci
    var fib = \n ->
        (n < 2 ? ret(n) :
            lookup(n, bind(fib(n - 1), \x ->
                bind(fib(n - 2), \y ->
                    update(n, x + y)))));
    
    fib(100)(seshat.create(compareInt), \x -> x)); //354224848179262000000


