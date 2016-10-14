var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('app', __filename);
var jm = require('jm-sso/sdk');
var utils = require('../utils');

var sdkConfig = {
    sdk: {
        uri: 'http://192.168.0.32:20200'
    },
    user: {
        account: 'cp',
        passwd: '123'
    }
};

if(pomelo.app){
    sdkConfig = pomelo.app.get('sdkConfig');
}

var sdk = jm.sdk;
sdk.init(sdkConfig.sdk || {});

if(sdkConfig.user){
    sdk.sso.signon(sdkConfig.user, function(err, doc){
        if(err){
            logger.error(err.stack);
            logger.error('sdk signon fail. %j', doc);
        }else{
            logger.debug('sdk sigon success. %s', utils.formatJSON(doc));
            sdk.user = doc;
            sdk.emit('signon', doc);
        }
    });
}

module.exports = sdk;
