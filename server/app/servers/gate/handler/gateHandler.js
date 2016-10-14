var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('app', __filename);
var utils = require('../../../utils');
var ERR = require('../../../consts').ERR;

module.exports = {
	queryConnector: function(msg, session, next) {
		var app = pomelo.app;
		var token = msg.token, self = this;
		if(!token) {
			logger.debug('queryConnector fail. invalid token');
			return next(null, ERR.GATE.FA_TOKEN_INVALID);
		}
		app.rpc.auth.authRemote.auth(session, token, function(err, doc){
			if(err) {
				doc = ERR.FA_NOAUTH;
				logger.debug('queryConnector fail. %s ', utils.formatJSON(doc));
				logger.debug(err.stack);
				next(null, doc);
				return;
			}
			var connectors = app.getServersByType('connector');
			if(!connectors || connectors.length === 0) {
				next(null, ERR.GATE.FA_NO_SERVER_AVAILABLE);
				return;
			}
			var res = utils.dispatch(doc.id, connectors);
			next(null, {
				host: res.host,
				port: res.clientPort
			});
			logger.debug('queryConnector. uid(%s) connector(%s:%s)', doc.id, res.host, res.clientPort);
		});
	}
};
