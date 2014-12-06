/*
 * THIS FILE IS AUTO GENERATED from 'lib/seshet.kep'
 * DO NOT EDIT
*/
"use strict";
var create, lookup, update, prune;
var max = (function(x, y) {
    return ((x > y) ? x : y);
});
var heightFromChild = (function(child) {
    return (child ? (1 + child.height) : 0);
});
var height = (function(root) {
    return (!root ? 0 : max(heightFromChild(root.left), heightFromChild(root.right)));
});
var bf = (function(node) {
    return (!node ? 0 : (heightFromChild(node.left) - heightFromChild(node.right)));
});
var Cell = (function(id, val, delegate) {
    (this.id = id);
    (this.val = val);
    (this.delegate = delegate);
});
(Cell.lookup = (function(base, eq, id) {
    for (var cell = base; cell;
        (cell = cell.delegate))
        if (eq(cell.id, id)) return cell.val;
    return null;
}));
var Node = (function(key, cell, l, r, height) {
    (this.key = key);
    (this.cell = cell);
    (this.left = l);
    (this.right = r);
    (this.height = height);
});
(Node.setChildren = (function(node, l, r) {
    return new(Node)(node.key, node.cell, l, r, ((l || r) ? (1 + max(height(l), height(r))) : 0));
}));
(Node.setLeft = (function(node, l) {
    return Node.setChildren(node, l, node.right);
}));
(Node.setRight = (function(node, r) {
    return Node.setChildren(node, node.left, r);
}));
(Node.lookup = (function(root, compare, eq, key, id) {
    for (var node = root; node;) {
        var diff = compare(key, node.key);
        if ((diff === 0)) return Cell.lookup(node.cell, eq, id);
        (node = ((diff < 0) ? node.left : node.right));
    }
    return null;
}));
(Node.put = (function(node, id, val) {
    return new(Node)(node.key, new(Cell)(id, val, node.cell), node.left, node.right, node.height);
}));
var rr = (function(node) {
    return (!node ? node : Node.setLeft(node.right, Node.setRight(node, node.right.left)));
});
var ll = (function(node) {
    return (!node ? node : Node.setRight(node.left, Node.setLeft(node, node.left.right)));
});
var lr = (function(node) {
    return ll(Node.setLeft(node, rr(node.left)));
});
var rl = (function(node) {
    return rr(Node.setRight(node, ll(node.right)));
});
var rot = (function(node) {
    var d = bf(node);
    if ((d > 1)) return ((bf(node.left) <= -1) ? lr(node) : ll(node));
    else if ((d < -1)) return ((bf(node.right) >= 1) ? rl(node) : rr(node));
    return node;
});
(Node.update = (function(root, compare, key, id, val) {
    if (!root) return new(Node)(key, new(Cell)(id, val, null), null, null, 0);
    var diff = compare(key, root.key);
    if ((diff === 0)) return Node.put(root, id, val);
    return rot(((diff < 0) ? Node.setLeft(root, Node.update(root.left, compare, key, id, val)) : Node.setRight(
        root, Node.update(root.right, compare, key, id, val))));
}));
(Node.rebalance = (function(root) {
    return ((Math.abs(bf(root)) <= 1) ? root : rot(Node.setChildren(root, Node.rebalance(root.left), Node.rebalance(
        root.right))));
}));
(Node.prune = (function(root, compare, lower, upper) {
    if (!root) return root;
    if ((lower !== undefined)) {
        var dl = compare(root.key, lower);
        if ((dl < 0)) return Node.prune(root.right, compare, lower, upper);
        else if ((dl === 0)) return Node.setChildren(root, null, Node.prune(root.right, compare, undefined,
            upper));
    }
    if (((upper !== undefined) && (compare(root.key, upper) >= 0))) return Node.prune(root.left, compare, lower,
        upper);
    return Node.setChildren(root, Node.prune(root.left, compare, lower, upper), Node.prune(root.right, compare,
        lower, upper));
}));
var Memoer = (function(compare, eq, root) {
    (this.compare = compare);
    (this.eq = eq);
    (this.root = root);
});
(Memoer.setRoot = (function(m, root) {
    return new(Memoer)(m.compare, m.eq, root);
}));
(create = (function() {
        var equals = (function(x, y) {
            return (x === y);
        });
        return (function(compare, eq) {
            return new(Memoer)(compare, (eq || equals), null);
        });
    })
    .call(this));
(lookup = (function(m, key, id) {
    return Node.lookup(m.root, m.compare, m.eq, key, id);
}));
(update = (function(m, key, id, val) {
    return Memoer.setRoot(m, Node.update(m.root, m.compare, key, id, val));
}));
(prune = (function(m, lower, upper) {
    return Memoer.setRoot(m, Node.rebalance(Node.prune(m.root, m.compare, lower, upper)));
}));
(exports.create = create);
(exports.lookup = lookup);
(exports.update = update);
(exports.prune = prune);