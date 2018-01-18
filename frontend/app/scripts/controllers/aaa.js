(function () {
    app.controller('homeController', function ($scope, $http, $state, $filter) {
        $scope.post = {};
        $scope.post.after = 2;
        $scope.post.busy = false;
        $scope.post.items = [];
        $http.get('http://vi.topquiz.co/view/loadmore/1').success(function (response) {
            if (response.error == "") {
                $scope.post.items = [];
            } else {
                $scope.post.items = response.data;
            }
        });
        $scope.nextPage = function () {
            if ($scope.post.busy) return;
            $scope.post.busy = true;
            $http.get("http://vi.topquiz.co/view/loadmore/" + $scope.post.after).success(function (datas) {
                if (datas.error == "" || datas.data == '') {
                } else {
                    var _items = datas.data;
                    for (var i = 0; i < _items.length; i++) {
                        $scope.post.items.push(_items[i]);
                    }
                }
            }).finally(function () {
                $scope.post.busy = false;
            });
            $scope.post.after += 1;
        }
    });
})();