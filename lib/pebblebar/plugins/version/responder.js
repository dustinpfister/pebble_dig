
var fs = require('fs');

//exports.createAppResponse = function(clientData,req,res, users, pebble, done){
exports.createAppResponse = function (clientData, req, res, scope, done) {

    var pack = {};

    // read package.json file
    fs.readFile('./package.json', 'utf8', function (err, data) {

        if (data) {

            pack = JSON.parse(data);

            // call done callback with response object
            done({

                plugin : 'version',
                pebbleDig : pack.version,
                pack : pack,
                success : true

            });

        // if no data
        } else {

            done({

                plugin : 'version',
                pebbleDig : '0.0.0',
                pack : {},
                success : false

            });

        }

    });

};
