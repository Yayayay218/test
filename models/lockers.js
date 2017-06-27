var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var autoIncre = require('mongoose-sequence');

var lockersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'unLock'
    },
    updateAt: Date,
    pinCode: Number,
    previousPinCode: Number,
    createAt: {
        type: Date,
        default: Date.now()
    }
});

lockersSchema.plugin(mongoosePaginate);
lockersSchema.plugin(autoIncre, {inc_field: 'locker_id'});
mongoose.model('Lockers', lockersSchema);