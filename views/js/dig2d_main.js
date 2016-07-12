
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

    //drawStack();

};

drawStack = function () {

    var z = 0,
    zLen = stack.d,
    x,
    y,
    xLen = stack.w,
    yLen = stack.h,
    pxWidth = 640 / xLen,
    pxHeight = 480 / yLen;

    ctx.fillStyle = '#ffff00';
	
    while (z < zLen) {

        y = 0;
        while (y < yLen) {

            x = 0;
            while (x < xLen) {
				
				ctx.fillRect(x * pxWidth, y * pxHeight, pxWidth,pxHeight);

                x += 1;

            }

            y += 1;

        }

        z += 1;
    }

};


draw();
