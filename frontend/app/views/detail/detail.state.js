'use strict';

angular.module('YQuiz')
    .config(function ($stateProvider) {

        $stateProvider

            .state('detail', {
                url: '/quiz/:slug',
                parent: 'layout',
                views: {
                    'content@': {
                        templateUrl: 'views/detail/detail.html',
                        controller: 'detailCtrl'
                    }
                }
            });
    });