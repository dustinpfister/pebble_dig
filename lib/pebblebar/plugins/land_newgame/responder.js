

exports.createAppResponse = function (clientData, req, res, scope, done) {

   console.log('I shall be the new thing');
   
   done({
	   
	   plugin : 'land_newgame'
	   
   })

};
