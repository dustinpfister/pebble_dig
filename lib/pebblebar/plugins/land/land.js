
var mongoose = require('mongoose'), Schema = mongoose.Schema,
Stack = require('./digserver_stack_3.js').Stack,
Land;

// randomize the composition of stackData
var randComp = function (stackData) {

    stackData.points.forEach(function (point) {

        point.val = {

            amount : 0,
            comp : [{

                    id : Math.floor(Math.random() * 2),
                    per : 1

                }
            ]

        };

    });

    /*

    // for some reason this does not work
    // I have ben at this for years so I should spot whats wrong (maybe I am having an off day.).
    // if you can find out whats wrong great, otherwise just remove this later.

    var i = 0,
    len = stackData.points.length,
    point;
    while (i < len) {

    var n = Math.floor(Math.random() * 2 );

    point = stackData.getPoint(i);  // so this would be a reference, but the reference should change on each loop.

    point.val.comp = [];  // fresh new array here

    console.log('i = ' + i);
    console.log('n = ' + n);  // both i and n are as you would exepect on each loop

    // dirt or rock
    point.val.comp.push({

    id : Number(n + 0), // no matter what always ref's the last value of n, i, ect...
    per : 1

    });

    i += 1;
    }

    stackData.points.forEach(function (point) {

    console.log(point.val)

    });
     */

};

exports.newSoloLand = function (scope, username, done, fail) {

    var stackData = new Stack({
            w : 2,
            h : 3,
            d : 2

        });

    // clear grid to standered land section object

    stackData.clearGrid({

        amount : 0, // amount of pebble
        comp : [// compostion of section

            // * if this array is empty that means it is an empty space
            // * one or more obejcts means there is "stuff"
            // * the object contains just an id (what the stuff is), and a per (percent of the section is stuff)

            {
                id : 0, // id 0 shall be dirt
                per : 1 // the section is compleatly dirt
            }

        ],
        clicks : 1 // the number of clicks to dig the section

    });

    // random comp
    randComp(stackData);

    //console.log(JSON.stringify(stackData));

    if (done === undefined) {
        done = function () {};
    }
    if (fail === undefined) {
        fail = function () {};
    }

    // get the uses pluginData for 'soloLand'
    scope.users.pluginData(

        // get soloLand plugin data for the given user
        username,

        // the default object
    {

        plugin : 'soloLand',
        stack3Data : '',
        turnsLeft : 0

    },

        // done (getting pluginData)
        function (pluginData) {

        pluginData.stack3Data = JSON.stringify(stackData);
        pluginData.tunsLeft = 10;

        scope.users.updatePluginData(username, pluginData,

            // done (updaing pluginData)
            function () {

            done(pluginData);

        },

            // fail (updating pluginData)
            function () {

            fail();

        });

    },

        // fail (gettig pluginData)
        function () {

        console.log('land.js : failed getting plugin data:');

        fail();

    });

};

exports.setup = function (db) {

    console.log('land.js : land.setup called, defining Land Collection...');

    Land = db.model('land', new Schema({

                forUser : String,
                turns : Number,
                stack3Data : String

            }));

};
