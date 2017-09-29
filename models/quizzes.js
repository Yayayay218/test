var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var quizSchema = new mongoose.Schema({
    title: String,
    featuredImg: String,
    description: String,
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date,
    questions: [{type: Schema.Types.ObjectId, ref: 'Questions'}]
});

quizSchema.plugin(mongoosePaginate);
mongoose.model('Quizzes', quizSchema);