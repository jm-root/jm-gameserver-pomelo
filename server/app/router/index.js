var utils = require('../utils');

var routeByType = function (type, session, msg, app, cb) {
    if (!session) {
        return cb(new Error('route to ' + type + ' server fail. session is empty'));
    }
    var uid = session.uid;
    if (!uid) {
        return cb(new Error('route to ' + type + ' server fail. no uid in session'));
    }
    var servers = app.getServersByType(type);
    if (!servers || servers.length === 0) {
        return cb(new Error('route to ' + type + ' server fail. no server found.'));
    }
    var res = utils.dispatch(uid, servers);
    cb(null, res.id);
};

module.exports = {
    area: function (session, msg, app, cb) {
        routeByType('area', session, msg, app, cb);
    }
};
