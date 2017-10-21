var passport = require('passport');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var User = mongoose.model('Users');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {
    var user = new User();

    user.email = req.body.email;

    user.setPassword(req.body.password);
    var token;
    token = user.generateJwt();
    user.token = 'Bearer ' + token;
    user.save(function (err) {
        res.status(200);
        res.json({
            "token": token
        });
    });
};

module.exports.login = function (req, res) {

    passport.authenticate('local', function (err, user, info) {
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": 'Bearer ' + token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};





