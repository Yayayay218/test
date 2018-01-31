var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');

var Languages = mongoose.model('Languages');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  POST a result
module.exports.languagePOST = function (req, res) {
    var data = req.body;

    var lang = new Languages(data);
    lang.save(function (err, lang) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        return sendJSONResponse(res, HTTPStatus.CREATED, {
            success: true,
            message: "Add a new lang successful!",
            data: lang
        })
    })
};

//  GET all results
module.exports.resultGetAll = function (req, res) {
    const page = req.query.page;
    delete req.query.page;
    const limit = req.query.limit;
    delete req.query.limit;
    var query = req.query || {};

    var sort = req.query.sort || '-createdAt';
    delete req.query.sort;
    Languages.paginate(
        query,
        {
            sort: sort,
            page: Number(page),
            limit: Number(limit)
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