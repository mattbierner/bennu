var parse = require('../index').parse;


exports.always = function(test) {
    var any = parse.token(function() { return true; });
    
    test.deepEqual(parse.run(any, "abc"), 'a');
    
    test.throws(parse.run.bind(undefined, any, ""));
    
    test.done();
};

exports.never = function(test) {
    var none = parse.token(function() { return false; })
    
    test.throws(parse.run.bind(undefined, none, "abc"), parse.UnexpectError);
    test.throws(parse.run.bind(undefined, none, ""), parse.UnexpectError);
    
    test.done();
};



exports.testInput = function(test) {
    var gt5 = parse.token(function(x) { return +x > 5; })
    
    test.throws(parse.run.bind(undefined, gt5, 1), parse.UnexpectError);
    test.throws(parse.run.bind(undefined, gt5, "5"), parse.UnexpectError);
    test.equal(parse.run(gt5, "7"), "7");
    
    test.done();
};
