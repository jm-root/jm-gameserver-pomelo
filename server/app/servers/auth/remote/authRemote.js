var pomelo = require('pomelo');

module.exports = {

    auth: function(token, cb){
        pomelo.app.service.sso.getUser({token:token}, cb);
    }

};

