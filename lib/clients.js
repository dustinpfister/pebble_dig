

// get the client system to use
exports.getClientSystem = function (req, done) {

    var urlParts = req.url.split('?'),
    params,
    currentParam,
    agent,
    system = 'vanilla',
    i,
    len;

    // if we have url params, check for cs=systemname
    if (urlParts.length > 1) {

        params = urlParts[1].split('&');

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

    // no url params
    }else{

        agent = req.get('user-agent').toLowerCase();

        // setting jboot system for chrome.
        if(agent.indexOf('chrome')){

            system = 'jboot';

        }

    }

    done(system);

};
