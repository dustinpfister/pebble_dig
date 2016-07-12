
// just go ahead and start a new game for now.
peb({
    action : 'pebblebar',
    clientData : [{
            plugin : 'land_newgame'
        }
    ]
}, function (data) {

    // all responces
    data.response.forEach(function (res) {

        // if a new game response, set up the clinets stack
        if (res.plugin === 'land_newgame') {

            stack.fromServer(JSON.parse(res.pluginData.stack3Data));

            console.log(stack);

            draw();

        }

    });

});

var canvas = document.getElementById('thecanvas'),
ctx = canvas.getContext('2d');

canvas.width = '640';
canvas.height = '480';

var draw = function () {

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStack();

};

drawStack = function () {

    var z = 0,
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
    while (z < zLen) {

        y = 0;
        while (y < yLen) {

            x = 0;
            while (x < xLen) {

                point = stack.getPoint(x, y, z);

                console.log(point.val.comp);

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

        z += 1;
    }

};
