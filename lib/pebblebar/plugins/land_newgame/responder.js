

exports.createAppResponse = function (clientData, req, res, scope, done) {

    console.log('I shall be the new thing');

    if (clientData.type === 'fed') {

        done({

            plugin : 'land_newgame',
            mess : 'solo game'

        });

    } else {

        if (clientData.type === 'pvp') {

            done({

                plugin : 'land_newgame',
                mess : 'pvp game'

            });

        } else {

            done({

                plugin : 'land_newgame',
                mess : 'unkown game type'

            });

        }

    }

};
