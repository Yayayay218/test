var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');
var base64Img = require('base64-img');
var async = require('async');
var randomString = require('randomstring');
var slug = require('slug');
var Quizzes = mongoose.model('Quizzes');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  Config upload photo
var multer = require('multer');

// var storage = multer.diskStorage({ //multers disk storage settings
//     destination: function (req, file, cb) {
//         cb(null, 'storage/quiz')
//     },
//     filename: function (req, file, cb) {
//         var datetimestamp = Date.now();
//         cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
//     }
// });
// var upload = multer({
//     storage: storage
// }).single('file');

var getImg = function (photo) {
    return new Promise(function (resolve, reject) {
        var tmp = [];
        async.each(photo, function (item, callback) {
            var datetimestamp = Date.now();
            var fileName = 'file-' + datetimestamp + randomString.generate(7);
            if (item.featuredImg !== '')
                if (item.answers)
                    base64Img.img(item.featuredImg, 'storage/media', fileName, function (err, filepath) {
                        tmp.push({
                            title: item.title,
                            featuredImg: filepath,
                            answers: item.answers
                        });
                        callback();
                    })
                else
                    base64Img.img(item.featuredImg, 'storage/media', fileName, function (err, filepath) {
                        tmp.push({
                            title: item.title,
                            featuredImg: filepath,
                            correctNumber: item.correctNumber
                        });
                        callback();
                    })
            else callback();
        }, function (err) {
            if (err)
                reject(err);
            else
                resolve(tmp);
        })
    })
}
//  POST a quiz
module.exports.quizPOST = function (req, res) {
    req.body.slug = slug(req.body.title);
    var data = req.body;
    getImg(data.results).then(function (result) {
        console.log(result)
        data.results = result;
        getImg(data.questions).then(function (question) {
            data.questions = question;
            var quiz = new Quizzes(data);
            quiz.save(function (err, quiz) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, err)
                return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: 'OK',
                    data: quiz
                })
            })
        }).catch(function (err) {
            console.log(err)
        })
    }).catch(function (err) {
        console.log(err)
    })

};

//  GET all quizzes
module.exports.quizGetAll = function (req, res) {
    const page = req.query.page;
    delete req.query.page;
    const limit = req.query.limit;
    delete req.query.limit;
    var query = req.query || {};

    var sort = req.query.sort || '-createdAt';
    delete req.query.sort;
    Quizzes.paginate(
        query,
        {
            sort: sort,
            page: Number(page),
            limit: Number(limit)
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
    req.body.slug = slug(req.body.title);
    var data = req.body;

    getImg(data.results).then(function (result) {
        data.results = result;
        getImg(data.questions).then(function (question) {
            data.questions = question;
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
        }).catch(function (err) {
            console.log(err)
        })
    }).catch(function (err) {
        console.log(err)
    })
};
