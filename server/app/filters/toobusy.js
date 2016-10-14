var consts = require('../consts');
var ERR = consts.ERR;
var logger = require('pomelo-logger').getLogger('app', __filename);
var toobusy = require('toobusy-js');

module.exports = {
  before: function(msg, session, next){
    if (!!toobusy && toobusy()) {
      var remoteAddress = session.__session__.__socket__.remoteAddress;
      var key = remoteAddress.ip + ':' + remoteAddress.port;
      logger.warn('[toobusy] reject request from ' + key + ' msg: ' + JSON.stringify(msg));
      var err = new Error('Server toobusy!');
      err.code = ERR.BUSY.err;
      next(err, ERR.BUSY);
    } else {
      next();
    }
  }
};

