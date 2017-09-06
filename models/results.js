var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var resultSchema = new mongoose.Schema({
    title: String,
    featuredImg: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date,
    quiz: {type: Schema.Types.ObjectId, ref: 'Quizzes'}
});

resultSchema.plugin(mongoosePaginate);
mongoose.model('Results', resultSchema);