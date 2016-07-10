
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Land;

exports.setup = function(db){

    console.log('land.js : land.setup called, defining Land Collection...');

    Land = db.model('land', new Schema({

        stack3Data : String

    }));

};