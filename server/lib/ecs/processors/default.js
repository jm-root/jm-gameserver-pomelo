var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-ecs');
}

jm.ProcessorDefault = jm.Processor.extend({
    _className : 'default',

    update : function(e, delta) {
        if(e.update){
            e.update(delta);
        }
    }

});