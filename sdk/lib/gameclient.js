var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-sdk-core');
}

(function () {
    var sdk = jm.sdk;
    var $ = sdk.$;
    var ERR = sdk.consts.ERR;
    var storage = sdk.storage;
    var logger = sdk.logger;
    var utils = sdk.utils;
    var pomelo = pomelo || window.pomelo;

    sdk.on('init', function (opts) {
        var model = 'gameclient';
        opts[model] = opts[model] || {};
        opts[model].host = opts[model].host || opts.host || '127.0.0.1';
        opts[model].port = opts[model].port || opts.port || 21000;
        opts[model].reconnect = opts[model].reconnect || opts.reconnect || false;
        opts[model].maxReconnectAttempts = opts[model].maxReconnectAttempts || opts.maxReconnectAttempts || 0;
        sdk[model].init(opts[model]);
    });

    /**
     * gameclient对象
     * @class  gameclient
     * @param {Object} opts 配置属性
     * 格式:{host:gate服务器, port: 端口}
     */
    sdk.gameclient = {
        connecter: pomelo,

        init: function (opts) {
            opts = opts || {};
            this.host = opts.host;
            this.port = opts.port;
            this.reconnect = opts.reconnect;
            this.maxReconnectAttempts = opts.maxReconnectAttempts;

            if (this.onDisconnect) {
                this.onMessage('disconnect', this.onDisconnect.bind(this));
            }
            if (this.onKick) {
                this.onMessage('onKick', this.onKick.bind(this));
            }
        },

        /**
         * 连接服务器
         * @function gameclient#connect
         * @param {Object} [opts={}] 参数
         * @example
         * opts参数:{
         *  host: 服务器ip(可选),
         *  port: 端口号(可选),
         *  reconnect: 断线自动重连(可选),
         *  maxReconnectAttempts: 最大重连尝试次数(必填),
         *  token: 用户token(可选),
         *  gender: 性别(可选),
         *  country: 国家(可选),
         *  province: 省份(可选),
         *  city: 城市(可选),
         *  area: 地区(可选),
         *  birthday: 生日(可选),
         *  signature: 签名(可选),
         *  headimgurl: 头像(可选)
         * }
         * @param cb
         */
        connect: function (opts, cb) {
            var self = this;
            opts = opts || {};
            this.online = false;
            this.state = 'queryConnector';
            pomelo.init({
                host: opts.host || this.host,
                port: opts.port || this.port
            }, function () {
                self.online = true;
                var token = opts.token || storage.getItem('token');
                self.request('gate.gateHandler.queryConnector', {token: token}, function (doc) {
                    pomelo.disconnect();
                    var err = null;
                    if (doc.err) {
                        err = new Error(doc.msg);
                    }
                    if(err){
                        logger.error(err.stack);
                        if (cb) cb(err, doc);
                        return;
                    }
                    var t = setInterval(function () {
                        if (!self.online) {
                            clearInterval(t);
                            doc.token = opts.token;
                            doc.reconnect = opts.reconnect;
                            doc.maxReconnectAttempts = opts.maxReconnectAttempts;
                            self._connect(doc, cb);
                        }
                    }, 100);
                });
            });
        },

        _connect: function (opts, cb) {
            var self = this;
            opts = opts || {};
            this.online = false;
            this.state = 'connect';
            pomelo.init(opts, function () {
                self.online = true;
                self.state = '';
                var token = opts.token || storage.getItem('token');
                self.request('connector.connectorHandler.connect', {token: token}, function (doc) {
                    var err = null;
                    if (doc.err) {
                        err = new Error(doc.msg);
                    }
                    if(err){
                        logger.error(err.stack);
                    }
                    self.emit('onConnected', err, doc);
                    if (cb) cb(err, doc);
                });
            });
        },

        /**
         * 断开连接
         */
        disconnect: function () {
            this.state = 'disconnect';
            pomelo.disconnect();
        },

        /**
         * 发送请求
         * @param route
         * @param msg
         * @param cb
         */
        request: function (route, msg, cb) {
            if (!this.online) return;
            msg = msg || {};
            pomelo.request(route, msg, function (doc) {
                logger.debug('[request]' + route + ': ' + utils.formatJSON(doc));
                if (cb) {
                    cb(doc);
                }
            });
        },

        /**
         * 发送通知
         * @param route
         * @param msg
         */
        notify: function (route, msg) {
            if (!this.online) return;
            msg = msg || {};
            logger.debug('[notify]' + route + ': ' + utils.formatJSON(msg));
            pomelo.notify(route, msg);
        },

        /**
         * 进入空闲状态, 服务器开始倒计时, 超时后, 服务器自动断开连接
         */
        idle: function () {
            this.notify('connector.connectorHandler.idle');
        },

        /**
         * 心跳, 取消idle状态
         */
        heartbeat: function () {
            this.notify('connector.connectorHandler.heartbeat');
        },

        /**
         * 监听服务器消息
         * @param route
         * @param cb
         */
        onMessage: function (route, cb) {
            pomelo.on(route, function (msg) {
                logger.debug('[onMessage]' + route + ': ' + utils.formatJSON(msg));
                cb(msg);
            });
        },

        onKick: function (msg) {
            logger.info('被服务器踢下线');
            this.state = 'onKick';
            this.emit('onKick', msg);
        },

        onDisconnect: function () {
            pomelo.disconnect();
            if (this.online) {
                this.online = false;
                if (this.state == '') {
                    logger.info('连接异常中断');
                    this.emit('onDisconnected', true);
                } else {
                    logger.debug('连接正常中断');
                    this.emit('onDisconnected', false);
                }
            } else {
                if (this.state !== '' && this.state !== 'disconnect') {
                    this.emit('onConnectFail');
                    logger.info('连接服务器失败');
                }
            }
        }

    };

    jm.enableEvent(sdk.gameclient);

})();
