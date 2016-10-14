var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('app', __filename);
var jmcommon = require('jm-common');
var DB = jmcommon.DB;
var mq = null;

var dburi = 'mongodb://localhost/test';
if(pomelo.app){
    var serviceConfig = pomelo.app.get('serviceConfig');
    if(serviceConfig){
        dburi = serviceConfig.dburi || dburi;
        mq = jmcommon.mq(serviceConfig.mq);
    }
}
var db = DB.connect(dburi);
mq = mq || jmcommon.mq();

var opts = {};
opts.db = db;
opts.mq = mq;

var o = {
    mq: mq,
    consts: require('../consts'),
    utils: require('../utils'),
    message: require('./message'),
    sdk: require('./sdk'),
    sso: require('./sdk').sso
};

module.exports =  o;
