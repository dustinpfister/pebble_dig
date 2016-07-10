
var mongoose = require('mongoose'), Schema = mongoose.Schema, 
stack3 = require('./stack_3.js').api,
Land;

exports.newLand = function (scope, username) {
	
	console.log('land.js : newLand method called.');
	console.log(stack3);
	
};

exports.setup = function (db) {

    console.log('land.js : land.setup called, defining Land Collection...');

    Land = db.model('land', new Schema({

                forUser : String,
                turns : Number,
                stack3Data : String

            }));

};
