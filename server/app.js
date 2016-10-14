/**
 * 服务器框架启动文件, 用户需要修改用户代码部分, 其他代码尽量不要改动, 除非你非常了解
 */
var pomelo = require('pomelo');
var app = pomelo.createApp();
app.set('name', 'server');

app.configure('production|development', function () {
    app.enable('systemMonitor');
    var onlineUser = require('./app/modules/onlineUser');
    if(typeof app.registerAdmin === 'function'){
        app.registerAdmin(onlineUser, {app: app});
    }
    //app.before(require('./app/filters/toobusy'));
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            blacklistFun: require('./app/utils/blackList'),
            connector: pomelo.connectors.hybridconnector,
            useProtobuf: true
        });
});

app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            blacklistFun: require('./app/utils/blackList'),
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 3,
            useDict: true,
            useProtobuf: true
        });
});

/***** 用户代码开始 ****/
app.configure('production|development', function () {
});

app.configure('production|development', 'auth', function () {
    app.loadConfig('serviceConfig', app.getBase() + '/config/service.json');
    app.loadConfig('sdkConfig', app.getBase() + '/config/sdk.json');
    app.service = require('./lib');
});


/***** 用户代码结束 ****/

app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
