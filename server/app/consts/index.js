var jm = require('jm-core');
var ERR = jm.ERR;
var ERRCODE_GAME = 3000;
ERR.BUSY = {
    err: ERRCODE_GAME++,
    msg: '服务器忙'
};
ERR.GATE = {
    FA_NO_SERVER_AVAILABLE: {
        err: ERRCODE_GAME++,
        msg: '无法分配服务器'
    },
    FA_TOKEN_INVALID: {
        err: ERRCODE_GAME++,
        msg: '无效Token'
    }
};
ERR.CONNECTOR = {
    FAIL: {
        err: ERRCODE_GAME++,
        msg: '连接服务器失败'
    },
    FA_TOKEN_INVALID: {
        err: ERRCODE_GAME++,
        msg: '无效Token'
    }
};

module.exports = {
    ERR: ERR,

    Connector: {
        idleTimeOut: 1 * 60 * 1000 //空闲超时时间, 超时后断开连接
    }
};

