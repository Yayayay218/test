var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var demoSchema = new mongoose.Schema({
    title: String,
    coverPhoto: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date,
    results: [{
        title: String,
        img: String
    }],
    questions: [{
        title: String,
        img: String
    }]
    // questions: [{type: Schema.Types.ObjectId, ref: 'Questions'}]
});

demoSchema.plugin(mongoosePaginate);
mongoose.model('Quizzes', demoSchema);