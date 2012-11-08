# act.js - Small Javascript Library for Behavior Changing Functions #

## About ##
act.js is a small library for creating Javascript functions that can change
their behavior, both externally or internally. Also supports creating functions
that select their behavior when called.

    // Create a function 'fib' that generates the Fibonacci numbers.
    var fib = act.on(function(x, y) {
        this.become(undefined, undefined, [y, x + y]);
        return x;
    }, undefined, [0, 1]);
    
    fib(); -> 0
    fib(); -> 1
    fib(); -> 1
    fib(); -> 2
    fib(); -> 3
    fib(); -> 5
    ...

    // Change a function's behavior externally.
    var constant = function(v) { return function(){ return v; }; };
    var f = act.as(constant(1));
    f(); -> 1
    f(); -> 1
    
    f.become(constant(2));
    f(); -> 2
    f(); -> 2


# Using act.js #
act.js can be used either as an AMD style module or in the global scope.

## With AMD ##
Include any AMD style module loader and load act:

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <script type="application/javascript" src="require.js"></script>
        <script type="application/javascript">
            require(['act'], function(act) {
                var f = act.as(...);
            });
        </script>
    </body>

## Global ##
Include act.js file directly and use 'act' global:

    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
        <script type="application/javascript" src="act.js"></script>
        <script type="application/javascript">
                var f = act.as(...);
        </script>
    </body>

# Details #
act.js explores the idea of the function as an actor with mutable behavior.
The concept of mutable behavior is implicit in many Javascript methods, but
act.js makes behavior change more explicit and easier to work with in some
situations.

act.js style functions are just regular Javascript functions that operate in a
special way. Besides returning a value, act.js functions also  specify a
replacement behavior that will handle returning a value and specifying a
replacement behavior the next time the function is invoked.

Replacement behavior may be set explicitly or implicitly. Using the implicit 
replacement behavior is the same as replacing the current behavior
with itself.

## Behaviors ##
act.js behaviors consist of three elements: an implementation function, a
scope object, and a set of bound arguments. Only an implementation function is
required, the scope and bound arguments are optional.

The implementation function is the function that is invoked for the behavior.
It receives arguments from the act function and may return
values and call 'this.become(...)' to specify a replacement behavior.

    var add = function(n){ return function(v){ return n + v; }; };
    var f = act.as(add(10));
    f(1); -> 11
    f(2); -> 12
    f.become(add(20));
    f(1); -> 21
    f(2); -> 22

The scope object is the object used as the scope when invoking the
implementation function.

    var f = act.as(function(){ return this.a; }, {a: 1});
    f(); -> 1
    f.become(undefined, {a: 2});
    f(); -> 2

The set of bound arguments is an array of leading arguments bound on the
implementation function.

    var sum = function() {
        return Array.prototype.reduce.call(arguments, function(p, c) {
            return p + c;
        });
    };
    
    var f = act.as(sum, {}, [10]);
    f(1); -> 11
    f(1, 2, 3); -> 16
    f.become(undefined, undefined, [20]);
    f(1); -> 21
    f(1, 2, 3); -> 26

Not specifying an implementation function, scope object, or bound arguments when
creating a replacement behavior will automatically use the current behavior's
value for the given object.

## Replacement Behavior ##
act.js allows you to specify a replacement behavior to use when a function is next
invoked. For external behavior changes, such as initial calls to 'act.as' or
'act.on' and setting behavior explicitly, the behavior is used when the function
is next called. The most recently specified behavior will be used.

For internal behavior changes, the new replacement behavior is specified while
the old behavior is still executing. The replacement behavior is the behavior 
used when the function is next invoked. Multiple calls to 'become' are
allowed, but only the most recent replacement behavior is used. External
behavior modification, in the case of 'act.as', may override internal
replacement behavior.


# API #
Overview of API. More detailed documentation can be found in the code.

## act.as(function(...[\*]): \*, scope, boundArgs: Array) ##
Create a function that can have its behavior changed both internally and
externally.

## act.on(function(...[\*]): \*, scope, boundArgs: Array) ##
Same as 'act.as', but created function only supports internal replacement 
behavior modification.

## act.opt(function(...[\*]): function(...[\*]): \*, selectScope) ##
Factory for a function that selects its behavior using another function when
called.

    var constant = function(v) { return function(){ return v;}; };
    
    function fib(v) {
        if (v === 0) return constant(0);
        else if (v === 1) return constant(1);
        return function() { return fib(v - 1)() + fib(v - 2)(); } 
    };
    
    var f = act.opt(fib);
    f(0); -> 0
    f(1); -> 1
    f(2); -> 1
    f(3); -> 2
    f(4); -> 3
    f(5); -> 5
    ...
