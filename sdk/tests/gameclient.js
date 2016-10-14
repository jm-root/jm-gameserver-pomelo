var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('../');
}

(function(){
    var self = this;
    var sdk = jm.sdk;
    var logger = sdk.logger;
    var utils = sdk.utils;
    var gameclient = sdk.gameclient;

    gameclient.connect({
        token: 'fcca060908135a86ac4378742cfba48879cec204400be1adf4a968c3c5316df7',
        reconnect: true
    });

    gameclient.on('onConnected', function(err, doc){
        var areaType = 1;
        gameclient.request('connector.connectorHandler.listAreas', {areaType: areaType}, function(doc){
        });
    });

})();