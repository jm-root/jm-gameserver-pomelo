require('./processors/default');

require('./components/channel');

var entityTypes = require('../config/entity');
var entityManager = require('../config/entityManager');

var ecs = require('./ecs')
jm = require('jm-ecs');

module.exports = ecs;

ecs.em = function() {
    var em = jm.entityManager();
    em.init(entityManager);
    em.addEntityTypes(entityTypes);

    em.createPlayer = function(opts, cb){
        var e = this.createEntity('player');
        e.attr(opts);
        if(cb){
            cb(null, e);
        }
        return e;
    };

    return em;
};

ecs.start = function(opts) {
    opts = opts || {};
    this.startTime = Date.now();
    this.runTime = 0;
    var interval = opts.interval || 100;
    this.timer = setInterval(this.tick.bind(this), interval);
};

ecs.stop = function() {
    clearInterval(this.timer);
};

ecs.tick = function() {
    var sysTime = Date.now();
    var runTime = sysTime - this.startTime;
    var delta = (runTime - this.runTime) / 1000;
    this.runTime = runTime;
    for(var id in areas) {
        var e = areas[id];
        e.entityManager.update(delta);
    }
};

ecs.start();

var areas = {};

ecs.areas = areas;

ecs._findAnAreaValid = function(opts) {
    var areas = this.areas;
    for(var id in areas){
        var e = areas[id];
        if(opts.areaType && e.areaType.oid != opts.areaType.oid)
            continue;

        if(!e.isFull()){
            var v = Math.abs(e.whRatio - opts.whRatio) * 10;
            if(Math.floor(v)==0){
                return e;
            }
        }
    }
    return null;
};

ecs.getOrCreateArea = function(opts, cb) {
    var areas = this.areas;
    opts.areadId = opts.areaId || 0;

    if(opts.areadId){
        var e = areas[opts.areaId];
        if(e && e.hasTag('area')){
            return cb(null, e);
        }else{
            return cb(null, null);
        }
    }

    delete opts.areadId;

    {
        var e = ecs._findAnAreaValid(opts);
        if(e) return cb(null,e);
    }

    {
        var em = this.em();
        var e = em.createEntity('area');
        areas[e.entityId] = e;
        e.attr(opts);
        e.start();
        cb(null, e);
    }
};

ecs.findPlayer = function(playerId) {
    var areas = this.areas;
    for(var id in areas){
        var e = areas[id];
        var em = e.entityManager;
        var player = em.entities[playerId];
        if(player) return player;
    }
    return null;
};

ecs.getPlayers = function() {
    var areas = this.areas;
    var players = {};
    for(var id in areas){
        var e = areas[id];
        var em = e.entityManager;
        var v = em.getEntities('player');
        for(var i in v){
            players[i] = v[i];
        }
    }
    return players;
};
