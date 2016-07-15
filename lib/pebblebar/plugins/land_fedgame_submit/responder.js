

exports.createAppResponse = function (clientData, req, res, scope, done) {

    console.log(clientData);

    done({

        plugin : 'land_fedgame_submit'

    });

};
