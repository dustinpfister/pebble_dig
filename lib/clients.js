

// get the client system to use
exports.getClientSystem = function (req, done) {

    console.log('get the client system!');

    var urlParts = req.url.split('?'),
    params,
    currentParam,
    system = 'vanilla',
    i,
    len;

    // if we have url params, check for cs=systemname
    if (urlParts.length > 1) {

        params = urlParts[1].split('&');

        console.log('looking for cs=');
        i = 0,
        len = params.length;
        while (i < len) {

            currentParam = params[i].split('=');

            console.log(currentParam);

            if (currentParam[0] === 'cs') {

                system = currentParam[1];
                break;

            }

            i += 1;

        }

    }

    done(system);

};
