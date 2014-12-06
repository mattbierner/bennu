/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/stream.kep'
 * DO NOT EDIT
*/
"use strict";
var end, NIL, stream, memoStream, rec, cons, append, appendz, concat, bind, from, first, rest, isEmpty, isStream,
        reverse, foldl, foldr, reduce, reduceRight, zip, zipWith, indexed, map, filter, forEach, toArray, arrayReduce =
        Function.prototype.call.bind(Array.prototype.reduce),
    memo = (function(f) {
        var value;
        return (function() {
            if ((value === undefined)) {
                (value = f());
            }
            return value;
        });
    });
(end = null);
(NIL = null);
(stream = (function(val, f) {
    return ({
        first: val,
        rest: f
    });
}));
(memoStream = (function(val, f) {
    var f0 = memo(f);
    return ({
        first: val,
        rest: f0
    });
}));
(rec = (function(def) {
    var value = def((function() {
        return value;
    }));
    return value;
}));
(first = (function(x) {
    return x.first;
}));
(rest = (function(s) {
    return s.rest();
}));
(isEmpty = (function(y) {
    return (null === y);
}));
(isStream = (function(s) {
    return (((s && s.hasOwnProperty("first")) && s.hasOwnProperty("rest")) || (null === s));
}));
(cons = (function(val, s) {
    var f = (function() {
        return s;
    });
    return ({
        first: val,
        rest: f
    });
}));
(appendz = (function(s1, f) {
    var val, f0, f1;
    return ((null === s1) ? f() : ((val = s1.first), (f0 = (function() {
        return appendz(s1.rest(), f);
    })), (f1 = memo(f0)), ({
        first: val,
        rest: f1
    })));
}));
var reducer = (function(s1, s2) {
    return appendz(s1, (function() {
        return s2;
    }));
});
(append = (function() {
    var streams = arguments;
    return arrayReduce(streams, reducer, null);
}));
(concat = (function(s) {
    return ((null === s) ? s : appendz(s.first, (function() {
        return concat(s.rest());
    })));
}));
var fromImpl = (function(arr, i, len) {
    var val, f, f0;
    return ((i >= len) ? null : ((val = arr[i]), (f = (function() {
        return fromImpl(arr, (i + 1), len);
    })), (f0 = memo(f)), ({
        first: val,
        rest: f0
    })));
});
(from = (function(arr) {
    var length = arr["length"],
        val, f, f0;
    return ((0 >= length) ? null : ((val = arr[0]), (f = (function() {
        return fromImpl(arr, 1, length);
    })), (f0 = memo(f)), ({
        first: val,
        rest: f0
    })));
}));
(zipWith = (function(f, l1, l2) {
    var val, f0, f1;
    return (((null === l1) || (null === l2)) ? null : ((val = f(l1.first, l2.first)), (f0 = zipWith.bind(null,
        f, l1.rest(), l2.rest())), (f1 = memo(f0)), ({
        first: val,
        rest: f1
    })));
}));
var f = (function(x, y) {
    return [x, y];
});
(zip = (function(l1, l2) {
    var x, y, val, f0, f1;
    return (((null === l1) || (null === l2)) ? null : ((x = l1.first), (y = l2.first), (val = [x, y]), (f0 =
        zipWith.bind(null, f, l1.rest(), l2.rest())), (f1 = memo(f0)), ({
        first: val,
        rest: f1
    })));
}));
var count = (function(n) {
    var f0 = (function() {
        return count((n + 1));
    });
    return ({
        first: n,
        rest: f0
    });
}),
    f0;
(indexed = zip.bind(null, ((f0 = (function() {
    return count(1);
})), ({
    first: 0,
    rest: f0
}))));
(foldl = (function(f1, z, s) {
    var y, s0, r = z;
    for (var head = s;
        (!((y = head), (null === y)));
        (head = ((s0 = head), s0.rest()))) {
        var x;
        (r = f1(r, ((x = head), x.first)));
    }
    return r;
}));
(reverse = foldl.bind(null, (function(x, y) {
    var f1 = (function() {
        return x;
    });
    return ({
        first: y,
        rest: f1
    });
}), null));
(foldr = (function(f1, z, s) {
    return foldl(f1, z, reverse(s));
}));
(reduce = (function(f1, s) {
    return foldl(f1, s.first, s.rest());
}));
(reduceRight = (function(f1, s) {
    return reduce(f1, reverse(s));
}));
(map = (function(f1, s) {
    var val, f2, f3;
    return ((null === s) ? s : ((val = f1(s.first)), (f2 = (function() {
        return map(f1, s.rest());
    })), (f3 = memo(f2)), ({
        first: val,
        rest: f3
    })));
}));
(filter = (function(pred, s) {
    var y, s0;
    for (var head = s;
        (!((y = head), (null === y)));
        (head = ((s0 = head), s0.rest()))) {
        var x = head,
            x0 = x.first;
        if (pred(x0)) {
            var f1 = (function() {
                var s1;
                return filter(pred, ((s1 = head), s1.rest()));
            }),
                f2 = memo(f1);
            return ({
                first: x0,
                rest: f2
            });
        }
    }
    return null;
}));
var y = concat;
(bind = (function() {
    var args = arguments;
    return y(map.apply(null, args));
}));
(forEach = (function(f1, s) {
    var y0, s0, x;
    for (var head = s;
        (!((y0 = head), (null === y0)));
        (head = ((s0 = head), s0.rest()))) f1(((x = head), x.first));
}));
var builder = (function(p, c) {
    p.push(c);
    return p;
});
(toArray = (function(s) {
    return foldl(builder, [], s);
}));
(exports["end"] = end);
(exports["NIL"] = NIL);
(exports["stream"] = stream);
(exports["memoStream"] = memoStream);
(exports["rec"] = rec);
(exports["cons"] = cons);
(exports["append"] = append);
(exports["appendz"] = appendz);
(exports["concat"] = concat);
(exports["bind"] = bind);
(exports["from"] = from);
(exports["first"] = first);
(exports["rest"] = rest);
(exports["isEmpty"] = isEmpty);
(exports["isStream"] = isStream);
(exports["reverse"] = reverse);
(exports["foldl"] = foldl);
(exports["foldr"] = foldr);
(exports["reduce"] = reduce);
(exports["reduceRight"] = reduceRight);
(exports["zip"] = zip);
(exports["zipWith"] = zipWith);
(exports["indexed"] = indexed);
(exports["map"] = map);
(exports["filter"] = filter);
(exports["forEach"] = forEach);
(exports["toArray"] = toArray);