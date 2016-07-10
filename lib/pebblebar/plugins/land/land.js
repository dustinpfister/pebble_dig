
var mongoose = require('mongoose'), Schema = mongoose.Schema,
Stack = require('./stack_3.js').Stack,
Land;

exports.newLand = function (scope, username) {

    var stackData = new Stack({
            w : 4,
            h : 6,
            d : 3

        });

    stackData.clearGrid();

    console.log('land.js : newLand method called.');
    console.log(stackData);

};

exports.setup = function (db) {

    console.log('land.js : land.setup called, defining Land Collection...');

    Land = db.model('land', new Schema({

                forUser : String,
                turns : Number,
                stack3Data : String

            }));

};
