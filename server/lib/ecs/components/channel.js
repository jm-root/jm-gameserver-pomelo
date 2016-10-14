var jm = jm || {};
var ecs= ecs || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-ecs');
    ecs = require('../ecs');
}

var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('app', __filename);
var utils = require('../../utils');
var consts = require('../../consts');

ecs.ComponentChannel = jm.Component.extend({
    _className : 'channel',

    properties: {
    },

    ctor : function (e, opts) {
        opts = opts || {};
        this._super(e, opts);

        e.getChannelName = function () {
            return opts.channelPrefix + this.entityId;
        };

        e.getChannel = function () {
            if (!this._channel) {
                var channelName = this.getChannelName();
                if(pomelo.app)
                    this._channel = pomelo.app.get('channelService').getChannel(channelName, true);
            }
            return this._channel;
        };

        e.destroyChannel = function() {
            pomelo.app.get('channelService').destroyChannel(this.getChannelName());
        };

        e.pushMessage = function (route, msg) {
            if(!pomelo.app) return;
            this.getChannel().pushMessage(route, msg);
        };

        if(!pomelo.app) return;

    }
});
