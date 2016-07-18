/*
 *    dig2d_main_fed.js
 *    Copyright 2016 by Dustin Pfister (GPL v3)
 *
 *    A client system prototype for pebble_dig
 *
 */

var canvas = document.getElementById('thecanvas'),
ctx = canvas.getContext('2d');

canvas.width = '640';
canvas.height = '480';

// Client State (cs)
var cs = {

    username : '', // the username of the player
    attackingUsername : '', // the username of the player you are attacking
    layer : 0,
    digs : 0,
    userWallet : 0, // the amount of pebble in the users waller
    pebbleDelta : 0, // the amount of pebble the user may have won so far
    pebbleInLand : 0, // the total amount of pebble in the land
    landId : '', // the id of the land being diged
    gameOver : false

};

var countPebble = function (stack) {

    var total = 0;

    stack.points.forEach(function (pt) {

        total += pt.val.amount;

    });

    return total;

};

// just go ahead and start a new game for now.
peb({

    action : 'pebblebar',
    clientData : [{
            plugin : 'land_newgame',
            type : 'fed'
        }
    ]

}, function (data) {

    console.log(data)
    cs.username = data.userData.username;
    cs.wallet = data.userData.primeWallet;

    // all responces
    data.response.forEach(function (res) {

        console.log('anything');

        // if a new game response, set up the clinets stack
        if (res.plugin === 'land_newgame') {

            console.log('responce from land_newgame');

            if (res.success) {

                if (res.game.land) {

                    // update the stack to the fed land
                    stack.fromServer(JSON.parse(res.game.land.stack3Data));

                    // set client state max digs to max digs allowed
                    cs.digs = res.game.land.maxDigs;

                    // just setting digs client side for now
                    //cs.digs = 10;


                    cs.attackingUsername = res.game.land.owner;

                    cs.pebbleInLand = res.game.wallet;
                    cs.pebbleDelta = 0;
                    cs.landId = res.game.landId;
                    cs.gameOver = false;

                    console.log('total pebble in stack: ' + countPebble(stack));

                    draw();

                } else {

                    console.log('we do not have a land object!');

                }

            } else {

                console.log('all land may be locked');

                drawLocked();

            }

        }

    });

});

var submit = function (stack) {

    console.log('submit');

    peb({

        action : 'pebblebar',
        clientData : [{
                //plugin : 'land_game_submit',
                plugin : 'land_submit',
                landId : cs.landId,
                stack3Data : JSON.stringify(stack)
            }
        ]

    }, function (data) {

        console.log('submited');

    });

}

var infoArea = document.getElementById('game_info_area');

var updateInfoArea = function () {

    infoArea.innerHTML = '{ user: ' + cs.username + ', pebble : ' + cs.wallet + '}<br>' +
        'attacking user: ' + cs.attackingUsername + '; currentLayer :' + cs.layer + '; digs : ' + cs.digs + '; pebble in land: ' + cs.pebbleInLand + '; pebbleDelta: ' + cs.pebbleDelta;

};

var draw = function () {

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStack(cs.layer);
    updateInfoArea();

};

var drawLocked = function () {

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    infoArea.innerHTML = 'all land is locked, try again later';

};

drawStack = function (layer) {

    var z = layer,
    zLen = stack.d,
    x,
    y,
    xLen = stack.w,
    yLen = stack.h,
    pxWidth = 640 / xLen,
    pxHeight = 480 / yLen,
    ci,
    ciLen,
    point;

    y = 0;
    while (y < yLen) {

        x = 0;
        while (x < xLen) {

            point = stack.getPoint(x, y, z);

            /*

            ALERT! we will have to do soething like this in the future

            ci = 0, ciLen = point.val.comp.length;
            while(ci < ciLen){



            ci += 1;
            }
             */

            if (point.val.comp.length > 0) {

                // just render based on comp[0] for now
                if (point.val.comp[0].id === 0) {

                    // if dirt
                    ctx.fillStyle = 'rgba(255,255,0,1)';

                } else {

                    // else rock
                    ctx.fillStyle = 'rgba(128,128,128,1)';

                }

            } else {

                ctx.fillStyle = '#000000';

            }

            ctx.fillRect(x * pxWidth, y * pxHeight, pxWidth, pxHeight);

            x += 1;

        }

        y += 1;

    }

};

// compute and append dig count based on comp of stack 3 points val object.
var computeComp = function (point) {

    //if not count compute and append
    var i = 0,
    len = point.val.comp.length,
    hp = 0,

    // the hp multis for each dirt type
    types = [
        1, // dirt
        5 // rock
    ];
    while (i < len) {

        //console.log(point.val.comp[i]);

        hp += types[point.val.comp[i].id] * point.val.comp[i].per

        i += 1;

    }

    //console.log(hp);
    point.hp = hp;

};

// EVENTS
canvas.addEventListener('mousedown', function (e) {

    var box = e.target.getBoundingClientRect(),
    x = Math.floor(e.clientX - box.left),
    y = Math.floor(e.clientY - box.top),
    pxWidth = 640 / stack.w,
    pxHeight = 480 / stack.h,
    cellX = Math.floor(x / pxWidth),
    cellY = Math.floor(y / pxHeight),
    point = stack.getPoint(cellX, cellY, cs.layer);

    //console.log(cellX + ',' + cellY);
    //console.log(point.val);

    e.preventDefault();

    if (!cs.gameOver) {

        // drop down only on empty comp
        if (point.val.comp.length === 0) {

            console.log('droping down');

            cs.layer += 1;

            if (cs.layer >= stack.d) {

                cs.layer = stack.d - 1;

            }

        } else {

            if (cs.digs <= 0) {

                console.log('you are out of digs!');

            } else {

                //console.log('time to dig');
                console.log(point.val);

                cs.pebbleDelta += point.val.amount;

                if (point.hp === undefined) {

                    computeComp(point);

                }

                if (point.hp) {

                    cs.digs -= 1;
                    point.hp -= 1;

                }

                if (point.hp <= 0) {

                    point.val.comp = [];
                }

                if (cs.digs <= 0) {

                    cs.gameOver = true;
                    submit(stack);

                }

            }

        }

    } else {

        console.log('the game is over');

    }

    draw();

});
