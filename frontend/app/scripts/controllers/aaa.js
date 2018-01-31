(function () {
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
    app.controller('headerCtrl', function ($scope, $http, $state, $filter, $stateParams, $window) {
        $scope.post = [];
        $scope.checkClick = true;
        $scope.search = function () {
            $scope.checkClick = true;
            var key = $scope.keysearch;
            if (key == '') {
            } else {
                $http.get('http://en.topquiz.co/quiz/search/' + key).success(function (response) {
                    if (response.error == "" || response.items.length == 0) {
                        $http.get('http://en.topquiz.co/view/hot').success(function (response) {
                            if (response.error !== "") {
                                $scope.post = response;
                            } else {
                                $scope.post = [];
                            }
                        });
                    } else {
                        $scope.post = response.items;
                    }
                });
            }
            angular.element($window).on('click', function (e) {
                $scope.checkClick = false;
            });
        };
    });
})();