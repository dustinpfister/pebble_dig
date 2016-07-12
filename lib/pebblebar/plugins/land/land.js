
var mongoose = require('mongoose'), Schema = mongoose.Schema,
Stack = require('./digserver_stack_3.js').Stack,
Land;

exports.newSoloLand = function (scope, username, done, fail) {

    var stackData = new Stack({
            w : 2,
            h : 3,
            d : 2

        });

    // clear grid to standered land section object

    var roll = Math.random(),
    stuff,
    clicks;

    if (roll > 0.5) {

        // dirt
        stuff = {

            id : 0,
            per : 1

        };
        clicks = 1;

    } else {

        // rock
        stuff = {

            id : 1,
            per : 1

        };
        clicks = 5;

    }

    stackData.clearGrid({

        amount : 0, // amount of pebble
        comp : [// compostion of section

            // * if this array is empty that means it is an empty space
            // * one or more obejcts means there is "stuff"
            // * the object contains just an id (what the stuff is), and a per (percent of the section is stuff)

            /*
        {
            id : 0, // id 0 shall be dirt
            per : 1 // the section is compleatly dirt
            }
             */

            stuff

        ],
        clicks : clicks // the number of clicks to dig the section

    });

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

            console.log('looks like we made it! check it: ');
            console.log(pluginData);

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
