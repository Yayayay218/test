var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');
var slug = require('slug');
var Quizzes = mongoose.model('Quizzes');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  Config upload photo
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/quiz')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({
    storage: storage
}).single('file');

//  POST a quiz
module.exports.quizPOST = function (req, res) {
    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        req.body.slug = slug(req.body.title);
        var data = req.body;

        var quiz = new Quizzes(data);
        quiz.save(function (err, quiz) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.CREATED, {
                success: true,
                message: "Add a new quiz successful!",
                data: quiz
            })
        })
    });
};

//  GET all quizzes
module.exports.quizGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    const slug = req.query.slug;
    delete req.query.slug;
    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (slug)
        query = {
            "slug": {$in: slug}
        }
    else
        query = {};
    Quizzes.paginate(
        query,
        {
            sort: req.query.sort,
            populate: 'questions',
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, quiz) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: quiz.docs,
                total: quiz.total,
                limit: quiz.limit,
                page: quiz.page,
                pages: quiz.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
};
module.exports.quizGetOne = function (req, res) {
    Quizzes.findById(req.params.id, function (err, quiz) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        if (!quiz)
            return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                success: false,
                message: 'Quiz not founded'
            })
        return sendJSONResponse(res, HTTPStatus.OK, {
            success: true,
            data: quiz
        })
    })
};

//  DEL a quizz
module.exports.quizDEL = function (req, res) {
    if (req.params.id)
        Quizzes.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.NO_CONTENT, {
                success: true,
                message: 'Quiz was deleted'
            })
        });
};

//  PUT a quiz
module.exports.quizPUT = function (req, res) {
    req.body.updatedAt = Date.now();

    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        req.body.slug = slug(req.body.title);
        var data = req.body;
        Quizzes.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, quiz) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if (!quiz)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: "Quiz's not founded"
                });
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'Update quiz successful!',
                data: quiz
            })
        })
    });

};