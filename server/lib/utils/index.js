var jmcommon = require('jm-common');

module.exports = {
  random: jmcommon.random(),
  formatJSON: function(obj){
    return JSON.stringify(obj, null,2);
  }
};
