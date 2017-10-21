var fs = require('fs');
var base64Img = require('base64-img');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  Config upload photo
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/media')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({
    storage: storage
}).single('file');
var photos = multer({storage: storage}).array('photos', 8);


exports.uploadFile = function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log("error:" + err);
            sendJSONresponse(res, 400, {message: 'fail'});
        }
        if (!req.file) {
            sendJSONresponse(res, 404, {message: 'fail'})
        }
        console.log(req.file);
        var url = req.file.path;
        sendJSONresponse(res, 200, url);
    })
};

var getPhotoUrl = function (photo, array, callback) {
    photo.map(function (file) {
        var datetimestamp = Date.now();
        var fileName = 'file-' + datetimestamp;
        base64Img.img(file, 'uploads/media', fileName, function (err, filepath) {
            var url = filepath;
            array.push(url)
        })
    })
    setTimeout(function () {
        callback();
    }, 500)
}
exports.uploadPhotos = function (req, res) {
    // var photos = [];
    // if (req.body.coverPhoto.length > 1)
    //     getPhotoUrl(req.body.coverPhoto, photos, function () {
    //         sendJSONresponse(res, 200, photos)
    //     })
    // else {
    var data = req.body.coverPhoto;
    var datetimestamp = Date.now();
    var fileName = 'file-' + datetimestamp;
    base64Img.img(data, 'uploads/media', fileName, function (err, filepath) {
        var url = filepath;
        sendJSONresponse(res, 200, url)
    })
    // }
};