var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Lockers = mongoose.model('Lockers');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  POST a Locker
module.exports.lockerPOST = function (req, res) {
    var data = req.body;
    var locker = new Lockers(data);

    locker.save(function (err, locker) {
        if (err)
            res.status(HTTPStatus.BAD_REQUEST).json({success: false, message: err});
        else
            res.status(HTTPStatus.CREATED).json({
                success: true,
                message: "Add a new locker successful !",
                data: locker
            })
    });
};

//  GET All Lockers
module.exports.lockerGetAll = function (req, res) {
    var query = req.query || {};

    const page = Number(req.query.page);
    delete req.query.page;
    const limit = Number(req.query.limit);
    delete req.query.limit;
    const sort = req.query.sort;
    delete req.query.sort;
    const status = req.query.status;

    if (req.query.available)
        query = {
            "available": {$in: req.query.available}
        };
    if (req.query.status)
        query = {
            "status": {$in: status}
        };

    if (req.query.id)
        query = {
            "_id": {$in: req.query.id}
        };

    Lockers.paginate(
        query,
        {
            sort: sort,
            page: page,
            limit: limit
        }, function (err, locker) {
            if (err)
                res.status(HTTPStatus.BAD_REQUEST).json({success: false, message: err});
            else {
                var results = {
                    data: locker.docs,
                    total: locker.total,
                    limit: locker.limit,
                    page: locker.page,
                    pages: locker.pages
                };
                sendJSONresponse(res, HTTPStatus.OK, results);
            }
        });
};

//  GET a Locker
module.exports.lockerGetOne = function (req, res) {
    Lockers.findById(req.params.id, function (err, locker) {
        if (err)
            sendJSONresponse(res, HTTPStatus.NOT_FOUND, err);
        else
            sendJSONresponse(res, HTTPStatus.OK,
                {
                    success: true,
                    message: "Find Locker Successful !",
                    data: locker
                });
    });
};

//  DEL a Locker
module.exports.lockerDEL = function (req, res) {
    if (req.params.id)
        Lockers.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                sendJSONresponse(res, 404, err);
            else
                sendJSONresponse(res, 204, {'message': 'success'});
        });
};

//  PUT a Locker
module.exports.lockerPUT = function (req, res) {
    req.body.updateAt = Date.now();
    var data = req.body;

    Lockers.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, locker) {
        if (err)
            sendJSONresponse(res, 400, err);
        else if (locker)
            sendJSONresponse(res, 201, {'data': locker});
        else
            sendJSONresponse(res, 404, {'message': 'locker not founded'});
    });
};