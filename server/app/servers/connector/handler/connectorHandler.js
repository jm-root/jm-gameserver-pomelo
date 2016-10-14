/**
 * 连接服务器, 用户需要修改用户代码部分, 其他代码尽量不要改动, 除非你非常了解
 */
var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('app', __filename);
var utils = require('../../../utils');
var consts = require('../../../consts');
var ERR = consts.ERR;
var async = require('async');

module.exports = {
    sessions: {},
    connect: function(msg, session, next) {
        var app = pomelo.app;
        var token = msg.token, self = this;
        if(!token) {
            logger.debug('connect fail. invalid token');
            return next(new Error('connect error. invalid token'), ERR.CONNECTOR.FA_TOKEN_INVALID);
        }
        async.waterfall([
            function(cb) {
                app.rpc.auth.authRemote.auth(session, token, cb);
            }, function(doc, cb) {
                var uid = doc.id;
                app.sessionService.kick(uid, function(){
                    session.bind(uid, cb);
                });
            }, function(cb) {
                session.set('token', token);
                session.pushAll(cb);
            }
        ], function(err, doc) {
            if(err) {
                doc = doc || ERR.CONNECTOR.FAIL;
                logger.debug('connect fail. %s ', utils.formatJSON(doc));
                logger.debug(err.stack);
                next(err, doc);
                return;
            }
            session.on('closed', onClosed.bind(null, app));
            logger.info('connected. uid: %s', session.uid);
            next(null, {uid: session.uid});
        });
    },

    _heartbeat: function(session) {
        var sessions = this.sessions;
        if(!sessions[session.id]) return;
        var s = sessions[session.id];
        var t = s.idleTimer;
        if(t){
            clearTimeout(t);
            delete sessions[session.id];
        }
    },

    /**
     * 开始空闲, 超过一定时间后, 自动断线
     * @param msg
     * @param session
     * @param next
     * @returns {*}
     */
    idle: function(msg, session, next) {
        this._heartbeat(session);
        var sessions = this.sessions;
        sessions[session.id] = sessions[session.id] || {};
        var s = sessions[session.id];
        var t = setTimeout(function(){
            pomelo.app.sessionService.kickBySessionId(session.id);
        }, consts.Connector.idleTimeOut);
        s.idleTimer = t;
        next(null, {});
    },

    /**
     * 心跳, 清除空闲状态
     * @param msg
     * @param session
     * @param next
     * @returns {*}
     */
    heartbeat: function(msg, session, next) {
        this._heartbeat(session);
        next(null, {});
    }
};

var onClosed = function (app, session, reason) {
    if(!session || !session.uid) {
        return;
    }
    logger.info('disconnected. uid: %s', session.uid);

    /***** 用户代码开始 ****/
    /***** 用户代码结束 ****/
};
