'use strict';

angular.module('YQuiz')
    .controller('detailCtrl', function ($scope, Socialshare, quizService, $stateParams, $location, $timeout, $http, API, ezfb, ngMeta) {
        $scope.showFirst = true;
        $scope.showSecond = false;
        $scope.showResult = false;
        $scope.play = function () {
            $scope.showFirst = false;
            $scope.showSecond = true;
        };

        $scope.page = 2;
        $scope.quizzes = {};
        $scope.items = [];
        $scope.quizzes.busy = false;

        $scope.items = quizService
            .quizGetAll(1)
            .catch(function (e) {
                console.log(e)
            })
            .then(function (res) {
                $scope.items = res.data.data;
            });
        $scope.loadMore = function () {
            if ($scope.quizzes.busy) return;
            $scope.quizzes.busy = true;
            $http.get(API.URL + 'quizzes?sort=-_id&page=' + $scope.page).then(function (datas) {
                if (datas.data.data.length === 0) {
                } else {
                    var _items = datas.data.data;
                    for (var i = 0; i < _items.length; i++) {
                        $scope.items.push(_items[i]);
                    }
                    $scope.quizzes.busy = false;
                }
            }).catch(function (err) {
                // $scope.quizzes.busy = false;
                console.log(err)
            });
            $scope.page += 1;
        };

        if ($stateParams.slug) {
            $scope.quizById = quizService
                .quizGetOne($stateParams.slug)
                .catch(function (e) {
                    console.log(e)
                })
                .then(function (res) {
                    $scope.quizById = res.data.data;
                    var image = 'https://yquizz.com/'+$scope.quizById[0].featuredImg;
                    ngMeta.setTitle($scope.quizById[0].title);
                    ngMeta.setTag('description', $scope.quizById[0].description);
                    ngMeta.setTag('image', image)
                });
            $timeout(function () {

                $scope.urlFB = window.location.href;

                $scope.results = $scope.quizById[0].results;
                $scope.randResult = Math.floor(Math.random() * $scope.results.length);
                $scope.titleShare = $scope.quizById[0].title;
                $scope.thumbShare = $scope.quizById[0].results[$scope.randResult].featuredImg;

                $scope.shareFB = function () {
                    FB.ui({
                        method: 'share_open_graph',
                        action_type: 'og.shares',
                        action_properties: JSON.stringify({
                            object: {
                                'og:url': $scope.urlFB,
                                'og:title': $scope.titleShare,
                                'og:image': 'https://yquizz.com/' + $scope.thumbShare
                            }
                        })
                    }, function (response) {
                    });
                };
                $scope.sendFB = function () {
                    window.open('fb-messenger://share?link=' + encodeURIComponent($scope.urlFB) + '&app_id=' + encodeURIComponent('1706155966071399'));
                }
            }, 1000);

            $scope.indexStt = 0;
            $scope.pickAnswer = function () {
                $('#adContainer div').css("display", "none");
                $scope.urlFB = window.location.href;
                if ($scope.indexStt === 3) {
                    url_ads = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=image&client=ca-games-pub-4290458289993584&description_url=http%3A%2F%2Fyquizz.com&channel=6497142434&videoad_start_delay=0&hl=en'
                    $('#adContainer').css('display', 'block');
                    setTimeout(function () {
                        setUpIMA();
                    }, 300);
                }
                if (($scope.indexStt + 1) === $scope.quizById[0].questions.length) {
                    url_ads = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=image&client=ca-games-pub-4290458289993584&description_url=http%3A%2F%2Fyquizz.com&channel=9123305777&videoad_start_delay=0&hl=en'
                    $('#adContainer').css('display', 'block');
                    setTimeout(function () {
                        setUpIMA();
                    }, 300);

                    $scope.showSecond = false;
                    $scope.showResult = true;
                }
                else
                    $scope.indexStt++;
            };
            $scope.nextQuiz = $http.get(API.URL + 'quizzes')
                .catch(function (e) {
                    console.log(e);
                })
                .then(function (data) {
                    var randPage = Math.floor(Math.random() * data.data.pages);
                    $scope.next = quizService
                        .quizGetAll(randPage + 1)
                        .catch(function (e) {
                            console.log(e);
                        })
                        .then(function (res) {
                            var index = Math.floor(Math.random() * res.data.data.length);
                            $timeout(function () {
                                $scope.next = res.data.data[index];
                            }, 1000);
                        })
                })
        }
    });