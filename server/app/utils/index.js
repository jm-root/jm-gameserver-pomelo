module.exports = {
  dispatch: require('./dispatcher'),
  formatJSON: function(obj){
    return JSON.stringify(obj, null, 2);
  }
};
