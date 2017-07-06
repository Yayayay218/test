var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var autoIncre = require('mongoose-sequence');

var lockersSchema = new mongoose.Schema({
    locker_id: String,
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    updateAt: Date,
    pinCode: String,
    previousPinCode: String,
    available: {
        type: Number,
        default: 1
    },
    serviceUUID: String,
    charUUID: String,
    createAt: {
        type: Date,
        default: Date.now()
    }
});

lockersSchema.plugin(mongoosePaginate);
mongoose.model('Lockers', lockersSchema);