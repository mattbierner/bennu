(function(define){

define(function() {
"use strict";

/* Array Prototype
 ******************************************************************************/
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

/* Helpers
 ******************************************************************************/
var simpleCompose = function(f, g) {
    return function(/*...*/) {
        return f(g.apply(undefined, arguments));
    };
};

var constantUndefined = function() { };

var extractor = simpleCompose.bind(undefined, function(v) { return v && v[0]; });

var reduceFuncs = function(reducer) {
    return function(reduction, funcs) {
        return function(/*...*/) {
            return reducer.call(funcs, reduction, arguments);
        };
    };
};

var reduceFuncsLeft = reduceFuncs(Array.prototype.reduce);

var reduceFuncsRight = reduceFuncs(Array.prototype.reduceRight);

/* Factories
 ******************************************************************************/
var wrapReduceFactory = function(state) {
    return function(p, c) {
        return c.apply(state, p);
    };
};

var wrapReduceExplicitFactory = function(state) {
    return function(p, c) {
        return c.apply(undefined, concat.apply([state], p));
    };
};

var composeReduceFactory = function(state) {
    return function(p, c) {
        return [c.apply(state, p)];
    };
};

var composeReduceExplicitFactory = function(state) {
    return function(p, c) {
        return [c.apply(undefined, concat.apply([state], p))];
    };
};

var chainFactory = function(reducer, factory) {
    return function(state /*, ...wrappers*/) {
        return (arguments.length === 1 ? constantUndefined :
            reducer(factory(state), slice.call(arguments, 1)));
    };
};

/* Exported Objects
 ******************************************************************************/
/**
 * Composes a chain of functions using an explicit state object when invoking
 * each function.
 * 
 * Composes right to left
 * 
 * Example:
 *     composeChain(state, a, b, c)(x, y) =
 *         a.apply(state, [b.apply(state, [c.apply(state, [x, y])])])
 * 
 * @param state State object used when invoking each function. Set to 'this' for
 *     function calls.
 * @param {...function(...[*]): *} Functions being composed.
 * 
 * @return {function(...[*]): *} Composed function.
 */
var composeChain = simpleCompose(extractor, chainFactory(reduceFuncsRight, composeReduceFactory));

/**
 * Same as 'composeChain' but left to right.
 */
var composeChainl = simpleCompose(extractor, chainFactory(reduceFuncsLeft, composeReduceFactory));

/**
 * Same as 'composeChain' except that state is passed as explicit first argument
 * to each function. 'this' is not changed when invoking the function.
 * 
 * Composed functions should not return state as one of the passed arguments,
 * the explicit state argument will be bound automatically.
 * 
 * Example:
 *     wrapChain(state, a, b, c)(x, y) =
 *         a.apply(undefined, b.apply(undefined, c.apply(undefined, [state, x, y])))
 */
var composeChainExplicit = simpleCompose(extractor, chainFactory(reduceFuncsRight, composeReduceExplicitFactory));

/**
 * Same as 'composeChainExplicit' but left to right.
 */
var composeChainExplicitl = simpleCompose(extractor, chainFactory(reduceFuncsLeft, composeReduceExplicitFactory));

/**
 * Composes a set of functions.
 * 
 * Composed function is right to left:
 *     compose(a, b, c)(x, y) = a(b(c(x, y)))
 * 
 * @param {...function(...[*]): *} functions Set of composing functions. Composing
 *     functions are called with the return value of the previous function.
 * 
 * @return {function(...[*]): *} Composed function.
 */
var compose = composeChain.bind(undefined, undefined);

/**
 * Same as compose but composes left to right.
 * 
 * Example:
 *     compose(a, b, c)(x, y) = c(b(a(x, y)))
 */
var composel = composeChainl.bind(undefined, undefined);

/**
 * Composes a function with itself 'count' times.
 * 
 * Example:
 *     composeIterate(a, 3)(x, y) = a(a(a(x, y)))
 * 
 * @param {function(...[*]): *} f Function being composed.
 * @param {number} count Number of times to compose function with itself. If zero,
 *    empty function is returned.
 * 
 * @return {function(...[*]): *} Composed function.
 */
var composeIterate = function(f, count) {
    if (count <= 0) {
        return constantUndefined;
    } else if (count === 1) {
        return f;
    } else {
        return compose(composeIterate(f, count - 1), f);
    }
};

/**
 * Wraps a chain of functions using an explicit state object when invoking
 * each function.
 * 
 * Wraps right to left
 * 
 * Example:
 *     wrapChain(state, a, b, c)(x, y) =
 *         a.apply(state, b.apply(state, c.apply(state, [x, y])))
 * 
 * @param state State object used when invoking each function. Set to 'this' for
 *     function calls.
 * @param {...function(...[*]): *} Functions being wrapped.
 * 
 * @return {function(...[*]): *} Wrapped function.
 */
var wrapChain = chainFactory(reduceFuncsRight, wrapReduceFactory);

/**
 * Same as 'chain' but left to right.
 */
var wrapChainl = chainFactory(reduceFuncsLeft, wrapReduceFactory);

/**
 * Same as 'wrapChain' except that state is passed as explicit first argument to
 * each function. 'this' is not changed when invoking the function.
 * 
 * Wrapped functions should not return state as one of the passed arguments,
 * the explicit state argument will be bound automatically.
 * 
 * Example:
 *     wrapChain(state, a, b, c)(x, y) =
 *         a.apply(undefined, b.apply(undefined, c.apply(undefined, [state, x, y])))
 */
var wrapChainExplicit = chainFactory(reduceFuncsRight, wrapReduceExplicitFactory);

/**
 * Same as 'wrapChainExplicit' but left to right.
 */
var wrapChainExplicitl = chainFactory(reduceFuncsRight, wrapReduceExplicitFactory);

/**
 * Wraps a function in a set of functions that give the function's arguments.
 * 
 * Similar to function composition, except inner functions return the arguments
 * for outer functions. Like composition if Javascript supported multiple return
 * values.
 * 
 * Wrapped function is right to left:
 *     wrap(a, b, c)(x, y) = a(b(c(x, y)))
 * 
 * @param {...function(...[*]): *} wrappers Wrapping functions. Wrapped
 *     right to left. Wrapper functions are called with the current set of
 *     arguments for the wrapped function and return an array of arguments.
 * 
 * @return {function(...[*]): *} Wrapped function.
 */
var wrap = wrapChain.bind(undefined, undefined);

/**
 * Same as wrap but wraps left to right.
 * 
 * Example:
 *     wrapl(a, b, c)(x, y) = c(b(a(x, y)))
 */
var wrapl = wrapChainl.bind(undefined, undefined);


/**
 * Wraps a function in itself 'count' times.
 * 
 *     wrapIterate(a, 3)(x, y) = a(a(a(x, y)))
 * 
 * @param {function(...[*]): *} f Function being wrapped.
 * @param {number} count Number of times to wrap function in itself. If zero,
 *    empty function is returned.
 * 
 * @return {function(...[*]): *} Wrapped function.
 */
var wrapIterate = function(f, count) {
    if (count <= 0) {
        return constantUndefined;
    } else if (count === 1) {
        return f;
    } else {
        return wrap(wrapIterate(f, count - 1), f);
    }
};

/* Export
 ******************************************************************************/
return {
    'compose': compose,
    'composel': composel,
    
    'composeChain': composeChain,
    'composeChainl': composeChainl,
    
    'composeChainExplicit': composeChainExplicit,
    'composeChainExplicitl': composeChainExplicitl,
    
    'composeIterate': composeIterate,
    
    'wrap': wrap,
    'wrapl': wrapl,
    
    'wrapChain': wrapChain,
    'wrapChainl': wrapChainl,
    
    'wrapChainExplicit': wrapChainExplicit,
    'wrapChainExplicitl': wrapChainExplicitl,
    
    'wrapIterate': wrapIterate
};

});

}(
    typeof define !== 'undefined' ? define : function(factory) { composed = factory(); }
));