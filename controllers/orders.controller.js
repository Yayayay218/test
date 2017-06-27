var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var constant = require('../helpers/lib/constant');
var randomstring = require('randomstring');

var Orders = mongoose.model('Orders');
var Lockers = mongoose.model('Lockers');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var checkAndUpdateLockerAvailable = function (id) {
    return new Promise(function (resolve, reject) {
        Lockers.findOne({_id: id}, function (err, locker) {
            if (err) {
                reject(err);
            }
            resolve(locker);
        });
    });

};
//  POST a Order
module.exports.orderPOST = function (req, res) {
    var data = req.body;
    var order = new Orders(data);

    checkAndUpdateLockerAvailable(req.body.locker)
        .then(function (locker) {
            if (locker.status === constant.UNLOCK) {
                order.save(function (err, order) {
                    if (err)
                        sendJSONresponse(res, 400, err);
                    sendJSONresponse(res, 201, order);
                });
                return;
            }
            sendJSONresponse(res, 400, {message: 'Locker is not available'});
        })
        .catch(function (err) {
            sendJSONresponse(res, 400, err);
        });
};

//  GET All Orders
module.exports.orderGetAll = function (req, res) {
    // var query = req.query || {};

    const page = Number(req.query.page);
    // delete req.query.page;
    const limit = Number(req.query.limit);
    // delete req.query.limit;
    const sort = req.query.sort;
    // delete req.query.sort;

    Orders.paginate(
        {},
        {
            sort: sort,
            populate: 'locker',
            page: page,
            limit: limit
        }, function (err, order) {
            if (err)
                sendJSONresponse(res, 404, err);
            else {
                var results = {
                    data: order.docs,
                    total: order.total,
                    limit: order.limit,
                    page: order.page,
                    pages: order.pages
                };
                sendJSONresponse(res, 201, results);
            }
        });
};

//  GET a Order
module.exports.orderGetOne = function (req, res) {
    Orders.findById(req.params.id, function (err, order) {
        if (err)
            sendJSONresponse(res, 404, err);
        else
            sendJSONresponse(res, 200, {'data': order});
    }).populate('locker');
};

//  PUT a Order
module.exports.orderPUT = function (req, res) {
    req.body.updateAt = Date.now();
    var data = req.body;
    Orders.findByIdAndUpdate(req.params.id, data, function (err, order) {
        if (err)
            sendJSONresponse(res, 400, err);
        if(order) {
            checkAndUpdateLockerAvailable(order.locker)
                .then(function (locker) {
                    locker.updateAt = Date.now();
                    locker.previousPinCode = locker.pinCode;
                    locker.pinCode = randomstring.generate({
                        length: 6,
                        charset: 'numeric'
                    });
                    locker.save();

                })
                .catch(function (err) {
                    sendJSONresponse(res, 400, err);
                });
            sendJSONresponse(res, 200, order);
            return;
        }
        sendJSONresponse(res, 404, {message: 'Order Not Fount'});
    });
};

//  DEL a Order
module.exports.orderDEL = function (req, res) {
    if (req.params.id)
        Orders.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                sendJSONresponse(res, 404, err);
            else
                sendJSONresponse(res, 204, {'message': 'success'});
        });
};