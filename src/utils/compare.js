export default function compare(x, y) {
    let p

    if (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)) {
        return true
    }

    if (x === y) {
        return true
    }

    if (typeof x === 'function' && typeof y === 'function') {
        if ((x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String || y instanceof String) ||
            (x instanceof Number || y instanceof Number)) {
            return x.toString() === y.toString()
        } else {
            return false
        }
    }

    if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime()
    }

    if (!(x instanceof Object && y instanceof Object)) {
        return false
    }

    if (x.prototype !== y.prototype) {
        return false
    }

    if (x.constructor !== y.constructor) {
        return false
    }

    for (p in y) {
        if (!x.hasOwnProperty(p)) {
            return false
        }
    }

    for (p in x) {
        if (!y.hasOwnProperty(p)) {
            return false
        }

        if (typeof y[p] !== typeof x[p]) {
            return false
        }

        if (!compare(x[p], y[p])) {
            return false
        }
    }

    return true
}
