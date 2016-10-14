var crc = require('crc');

module.exports = function(key, list) {
	var index = Math.abs(crc.crc32(key)) % list.length;
	return list[index];
};
