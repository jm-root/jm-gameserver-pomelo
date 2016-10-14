var jm = require('jm-core');
var ERR = jm.ERR;
module.exports = {
    TEST: false,

    ERR: ERR,

    Event:{
        syncTime:'syncTime'
        ,sysNotice:'sysNotice'
        ,save:'save'
        ,chat:'chat'
    },

    NoticeType: {
        NT_NORMAL : 0,
        NT_POP : 1,
        NT_URL : 2,
        NT_ONLINECOUNT : 3,
        NT_CONFIRM : 4
    },

    EntityTypeCode: {
        area: 0
    },

    EntityType: {
        AREA: 'area'
    }
}
