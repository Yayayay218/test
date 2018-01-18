'use strict';

angular.module('YQuiz')
    .controller('dashboardCtrl', function ($scope, quizService, $stateParams, $location, $timeout, $http, API, authService, $state, Dialog, $window) {
        var url = window.location.href;
        var arr = url.split("/");
        var result = arr[0] + "//" + arr[2] + '/';

        function convertImageToDataURI(url, callback, outputFormat) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                var canvas = document.createElement('CANVAS'),
                    ctx = canvas.getContext('2d'), dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null;
            };
            img.src = url;
        }

        $scope.screenState = 'myQuiz';
        $scope.editState = false;
        $scope.totalQuizzes = 0;
        getResultsPage(1);
        $scope.pagination = {
            current: 1
        };
        $scope.pageChanged = function (newPage) {
            getResultsPage(newPage);
        };

        function getResultsPage(pageNumber) {
            // this is just an example, in reality this stuff should be in a service
            quizService
                .quizGetAll(pageNumber)
                .catch(function (e) {
                    console.log(e)
                })
                .then(function (res) {
                    $scope.items = res.data.data;
                    $scope.totalQuizzes = res.data.total;
                });
        }

        // $scope.items = quizService
        //     .quizGetAll(1)
        //     .catch(function (e) {
        //         console.log(e)
        //     })
        //     .then(function (res) {
        //         $scope.items = res.data.data;
        //     });
        $scope.onDelete = function onDelete(data) {
            Dialog.deleteDialog('Do you want to delete this collection',
                quizService.quizDelete.bind(null, data._id),
                $state.reload()
            );
        };

        $scope.onEdit = function (index) {
            $scope.editState = true;
            $scope.quiz = quizService
                .quizGetAll(1)
                .catch(function (e) {
                    console.log(e)
                })
                .then(function (res) {
                    $scope.quiz = res.data.data[index];
                    convertImageToDataURI(result + $scope.quiz.featuredImg, function (data) {
                        $scope.quiz.featuredImg = data;
                        $('#file-image')[0].src = data;
                    })
                    $scope.results = $scope.quiz.results;
                    $scope.results.forEach(function (item, index) {
                        convertImageToDataURI(result + item.featuredImg, function (data) {
                            $scope.results[index].featuredImg = data;
                            var imgId = '#result-' + index + '-image';
                            $(imgId)[0].src = data;
                        })
                    });
                    $scope.questions = $scope.quiz.questions;
                    $scope.questions.forEach(function (item, index) {
                        convertImageToDataURI(result + item.featuredImg, function (data) {
                            $scope.questions[index].featuredImg = data;
                            var imgId = '#question-' + index + '-image';
                            $(imgId)[0].src = data;
                        })
                    })
                });
            $scope.submit = function () {
                // console.log($('#file-image')[0].src)
                var tmp = [];
                $scope.results.forEach(function (e) {
                    tmp.push(e.img);
                });
                quizService.uploadPhoto(
                    {
                        coverPhoto: $('#file-image')[0].src
                    })
                    .then(function (res) {
                        $scope.data = {
                            title: $scope.quiz.title,
                            description: $scope.quiz.description,
                            featuredImg: res,
                            results: $scope.results,
                            questions: $scope.questions
                        };
                        quizService.quizUpdate($scope.quiz._id, $scope.data).then(function (res) {
                            Dialog.onSuccess('Success', null, $state.reload())
                        })
                    }, function (err) {
                        console.log(err);
                    })
            };
        };
        if (!authService.getToken()) {
            $state.go('login');
            return;
        }
        $scope.quiz = {};
        $scope.results = [
            {
                title: '',
                featuredImg: ''
            },
            {
                title: '',
                featuredImg: ''
            }
        ];

        $scope.questions = [
            {
                title: '',
                featuredImg: '',
                answers: [
                    {
                        title: ''
                    },
                    {
                        title: ''
                    },
                ]
            },
            {
                title: '',
                featuredImg: '',
                answers: [
                    {
                        title: ''
                    },
                    {
                        title: ''
                    },
                ]
            }
        ];

        $scope.addNewResult = function () {
            $scope.results.push({
                title: '',
                featuredImg: ''
            });
        };

        $scope.addNewQuestion = function () {
            $scope.questions.push({
                title: '',
                featuredImg: '',
                answers: [
                    {
                        title: ''
                    },
                    {
                        title: ''
                    },
                ]
            })
        };
        $scope.answers = [
            {
                title: ''
            },
            {
                title: ''
            }
        ];
        $scope.addNewAnswer = function (index) {
            $scope.questions[index].answers.push({
                title: ''
            })
        };

        $scope.removeQuestion = function (index) {
            $scope.questions.splice(index, 1)
        };
        $scope.removeResult = function (index) {
            $scope.results.splice(index, 1)
        };
        $scope.removeAnswer = function (index, data) {
            data.answers.splice(index, 1)
            // $scope.questions.answers.splice(index, 1)
        }

        $scope.submit = function () {
            var tmp = [];
            $scope.results.forEach(function (e) {
                tmp.push(e.img);
            });
            quizService.uploadPhoto(
                {
                    coverPhoto: $scope.quiz.img
                })
                .then(function (res) {
                    $scope.data = {
                        title: $scope.quiz.title,
                        description: $scope.quiz.description,
                        featuredImg: res,
                        results: $scope.results,
                        questions: $scope.questions
                    };
                    quizService.quizCreate($scope.data).then(function (res) {
                        Dialog.onSuccess('Success', null, $state.reload())
                    });
                }, function (err) {
                    console.log(err);
                })
        };
        $scope.logOut = function () {
            authService.logout();
            $state.reload();
        }
    });
