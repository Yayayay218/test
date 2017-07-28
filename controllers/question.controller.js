var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Questions = mongoose.model('Questions');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  Config upload photo
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/questions')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({
    storage: storage
}).single('file');

//  POST a question
module.exports.questionPOST = function (req, res) {
    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var data = req.body;

        var question = new Questions(data);
        question.save(function (err, question) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.CREATED, {
                success: true,
                message: "Add a new question successful!",
                data: question
            })
        })
    });
};

//  GET all questions
module.exports.questionGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    if (id)
        query = {
            "_id": {$in: id}
        };
    else
        query = {};
    Questions.paginate(
        query,
        {
            sort: req.query.sort,
            populate: 'quiz',
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, question) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: question.docs,
                total: question.total,
                limit: question.limit,
                page: question.page,
                pages: question.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
};

module.exports.questionGetOne = function (req, res) {
    Questions.findById(req.params.id)
        .populate('quiz')
        .exec(function (err, question) {
            if(err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if(!question)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: 'Question not founded'
                });
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: false,
                data: question
            })
        })
};
//  PUT a question
module.exports.questionPUT = function (req, res) {
    req.body.updatedAt = Date.now();

    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var data = req.body;
        Questions.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, question) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if (!question)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: "Question's not founded"
                });
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'Update question successful!',
                data: question
            })
        })
    });
};

//  DEL a question
module.exports.questionDEL = function (req, res) {
    if (req.params.id)
        Questions.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.NO_CONTENT, {
                success: true,
                message: 'Question was deleted'
            })
        });
};