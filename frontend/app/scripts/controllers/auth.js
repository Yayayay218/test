'use strict';

angular.module('YQuiz')
    .controller('authCtrl', function ($scope, authService, $stateParams, $location, $timeout, $http, $state, Dialog) {

        $scope.credentials = {
            email: '',
            password: ''
        };
        $scope.onSubmit = function () {
            authService.login($scope.credentials)
                .catch(function (err) {
                    Dialog.onFailure('Wrong', 'Wrong email or password');
                })
                .then(function () {
                    $state.go('dashboard')
                });
        };
    });
