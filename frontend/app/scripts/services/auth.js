'use strict';

angular.module('YQuiz')
    .service('authService', authService);

function authService(API, $http, $cookies, $rootScope) {
    var exports = {};

    var login = function (info) {
        return $http.post(API.URL + 'auth/login', info).then(function (data) {
            saveToken(data.data.token);
        })
    };

    var logout = function () {
        removeToken();
        removeUserInfo();
    };

    var saveToken = function (token) {
        $cookies.put('token', token);
    };

    var getToken = function () {
        return $cookies.get('token');
    };

    var setTokenToRequestHeader = function () {
        $http.defaults.headers.common.Authorization = getToken();
    };

    var saveUserInfo = function (info) {
        $cookies.putObject('user', info);
    };

    var getUserInfo = function () {
        return $cookies.getObject('user');
    };
    var removeToken = function () {
        $cookies.remove('token');
    };

    var removeUserInfo = function () {
        $cookies.remove('user');
    };
    return {
        login: login,
        logout: logout,
        removeUserInfo: removeUserInfo,
        removeToken: removeToken,
        getUserInfo: getUserInfo,
        saveUserInfo: saveUserInfo,
        getToken: getToken,
        saveToken: saveToken,
        setTokenToRequestHeader: setTokenToRequestHeader
    }
}