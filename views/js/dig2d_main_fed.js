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

    layer : 0,
    digs : 0

};

// just go ahead and start a new game for now.
peb({

    action : 'pebblebar',
    clientData : [{
            plugin : 'land_newfedgame'
        }
    ]

}, function (data) {

    // all responces
    data.response.forEach(function (res) {

        // if a new game response, set up the clinets stack
        if (res.plugin === 'land_newfedgame') {

            console.log(res);

            if (res.success) {
                // update the stack to the fed land
                stack.fromServer(JSON.parse(res.fedGame.land.stack3Data));

                console.log(res.fedGame.land);

                // set client state max digs to max digs allowed
                cs.digs = res.fedGame.land.maxDigs;

                draw();

            } else {

                console.log('all land may be locked');

            }

        }

    });

});

var infoArea = document.getElementById('game_info_area');

var updateInfoArea = function () {

    infoArea.innerHTML = 'currentLayer :' + cs.layer + '; digs : ' + cs.digs;

};

var draw = function () {

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStack(cs.layer);
    updateInfoArea();

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
	
	console.log(hp);

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

            if (point.hp === undefined) {

                computeComp(point);

            }

        }

    }

    draw();

});
