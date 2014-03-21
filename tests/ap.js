var parse = require('../index').parse;

var identity = function(v) { return v; };
var constant = function(v) { return identity.bind(this, v); };

var add10 = function(x) { return (+x) + 10; };

exports.simple = function(test) {
    var result = parse.of(add10)
        .ap(parse.anyToken)
    
    test.deepEqual(
        parse.run(result, "3"),
        13);
    test.done();
};