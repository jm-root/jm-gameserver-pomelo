var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);

var exp = module.exports;

exp.pushMessageByUids = function (uids, route, msg) {
	pomelo.app.get('channelService').pushMessageByUids(route, msg, uids, function(err, fails){
		if(!!err){
			logger.warn('Push Message error! route: %j msg: %j', route, msg);
		}
	});
};

exp.pushMessageToPlayer = function (uid, route, msg) {
  exp.pushMessageByUids([uid], route, msg);
};
