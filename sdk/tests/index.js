var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('../');
}

var sdkConfig = {
    gameclient: {
        //host: '192.168.0.38'
    }
};
jm.sdk.init(sdkConfig);

if (typeof module !== 'undefined' && module.exports) {
    require('./gameclient.js');
}
