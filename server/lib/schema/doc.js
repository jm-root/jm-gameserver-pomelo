var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaDefine = {
    oid: {type: Number, unique: true, sparse: true, index: true},
    title : {type: String},
    content:{type: String},
    isHtml:{type: Boolean, default: true},
    creator: {type: Schema.Types.ObjectId, ref: 'user'},
    crtime: {type: Date,  default: Date.now},
    moditime: {type: Date},
    tags: [String],
    visible: {type: Boolean,  default: true},
    status: {type: Number,  default: 0},
    ext: Schema.Types.Mixed
};

module.exports = function(schema, opts) {
    schema = schema || new Schema();
    schema.add(schemaDefine);
    return schema;
};

