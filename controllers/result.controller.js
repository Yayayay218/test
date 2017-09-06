var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Results = mongoose.model('Results');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  Config upload photo
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/result')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({
    storage: storage
}).single('file');

//  POST a result
module.exports.resultPOST = function (req, res) {
    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var data = req.body;

        var result = new Results(data);
        result.save(function (err, result) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.CREATED, {
                success: true,
                message: "Add a new result successful!",
                data: result
            })
        })
    });
};

//  GET all results
module.exports.resultGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    const quiz = req.query.quiz;
    delete req.query.quiz;
    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (quiz)
        query = {
            "quiz": {$in: quiz}
        };
    else
        query = {};
    Results.paginate(
        query,
        {
            sort: req.query.sort,
            populate: 'quiz',
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, result) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: result.docs,
                total: result.total,
                limit: result.limit,
                page: result.page,
                pages: result.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
};

module.exports.resultGetOne = function (req, res) {
    Results.findById(req.params.id)
        .populate('quiz')
        .exec(function (err, result) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if (!result)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: 'result not founded'
                });
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: false,
                data: result
            })
        })
};
//  PUT a result
module.exports.resultPUT = function (req, res) {
    req.body.updatedAt = Date.now();

    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var data = req.body;
        Results.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, result) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if (!result)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: "result's not founded"
                });
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'Update result successful!',
                data: result
            })
        })
    });
};

//  DEL a result
module.exports.resultDEL = function (req, res) {
    if (req.params.id)
        Results.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.NO_CONTENT, {
                success: true,
                message: 'result was deleted'
            })
        });
};