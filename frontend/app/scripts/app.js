'use strict';

// Declare app level module which depends on views, and components
var YQuiz = angular.module('YQuiz', ['ui.router', '720kb.socialshare', 'infinite-scroll', 'ezfb', 'ngMeta', 'ngCookies', 'base64', 'angularUtils.directives.dirPagination', 'updateMeta']);

YQuiz.config(function ($stateProvider, $urlRouterProvider, $locationProvider, ezfbProvider, ngMetaProvider, paginationTemplateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================
        .state('layout', {
            views: {
                'header': {
                    templateUrl: 'views/layouts/header.html',
                },

                'footer': {
                    templateUrl: 'views/layouts/footer.html',
                }
            }
        })
        .state('about', {
            url: '/about-us',
            views: {
                'header': {templateUrl: 'views/layouts/header.html'},
                'footer': {templateUrl: 'views/layouts/footer.html'},
                'content': {templateUrl: 'views/staticPage/about.html'}
            }
        })
        .state('privacy', {
            url: '/privacy-policy',
            views: {
                'header': {templateUrl: 'views/layouts/header.html'},
                'footer': {templateUrl: 'views/layouts/footer.html'},
                'content': {templateUrl: 'views/staticPage/privacy.html'}
            }
        })
        .state('term', {
            url: '/term-policy',
            views: {
                'header': {templateUrl: 'views/layouts/header.html'},
                'footer': {templateUrl: 'views/layouts/footer.html'},
                'content': {templateUrl: 'views/staticPage/copyright.html'}
            }
        })
        .state('contact', {
            url: '/contact-us',
            views: {
                'header': {templateUrl: 'views/layouts/header.html'},
                'footer': {templateUrl: 'views/layouts/footer.html'},
                'content': {templateUrl: 'views/staticPage/contact.html'}
            }
        })

        .state('login', {
            url: '/admin',
            views: {
                'content': {
                    templateUrl: 'views/auth/login.html',
                    controller: 'authCtrl'
                }
            }
        })

    // $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    ngMetaProvider.setDefaultTitle('Yquizz.com - The funniest quizzes');
    paginationTemplateProvider.setPath('../bower_components/angularUtils-pagination/dirPagination.tpl.html');
    // ezfbProvider.setInitParams({appId: '1706155966071399', version: 'v2.8'});
    // ezfbProvider.setLocale('en_US');
});


YQuiz.run(function ($rootScope, $state, ngMeta) {
    ngMeta.init();
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
    $rootScope.$on('$viewContentLoaded', function(event) {
        // console.log(event)
    });
});


