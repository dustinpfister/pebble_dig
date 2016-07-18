var powSum = function (base, pow) {

    var i = pow,
    curPow,
    sum = 0;
    while (i--) {

        curPow = i; // make current pow 1 relative

        sum += Math.pow(base, curPow);

    };

    return sum;

},

// break a pebble wallet amount down into an array of amounts for each layer of depth of a stack
breakToLayers = function (wallet, depth) {

    var ps = powSum(2, depth),
    pebTotal = 0,
    pebble,
    layerAmounts = [],
    per,
    i = 0;
    while (i < depth) {

        per = Math.pow(2, i) / ps;
        pebble = Math.floor(wallet * per);
        pebTotal += pebble;
        layerAmounts.push(pebble);

        i += 1;

    }

    // any remaining pebble shall go to the bottom layer
    layerAmounts[layerAmounts.length - 1] += wallet - pebTotal;

    return layerAmounts;

},

// make an array that reflects the number of locations where pebbleis to be placed per layer
divCounts = function (w, h, d) {

    var divs = [],
    i = 0,
    a = w * h;
    while (i < d) {

        divs.push(Math.floor((a - 1) * (0.9 - (0.9 * (i / d)))) + 1);

        i += 1;

    }

    return divs;

};

// get distabution params for where to place pebble in a land stack of the given values
exports.getDistParams = function (wallet, w, h, d) {

    return {

        layers : breakToLayers(wallet, d),
        divs : divCounts(w, h, d)

    };

};
