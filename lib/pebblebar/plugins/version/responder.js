
//exports.createAppResponse = function(clientData,req,res, users, pebble, done){
exports.createAppResponse = function(clientData,req,res, scope, done){

        

        // call done callback with response object
        done({
        
            plugin: 'version',
            pebbleDig : '0.0.0'
        
        });


};
