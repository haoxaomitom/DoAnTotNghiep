var app = angular.module('VerificationApp', []);

app.controller('VerificationController', ['$scope', '$http', function ($scope, $http) {
    $scope.status = null;
    $scope.message = '';

    // Lấy token từ URL nếu có
    var urlParams = new URLSearchParams(window.location.search);
    var token = urlParams.get('token');

    if (token) {
        $http.get(`https://doantotnghiepbe-production.up.railway.app/api/users/verified?token=${token}`)
            .then(function (response) {
                console.log(response.data.status);
                if (response.data.status) {
                    // Trường hợp thành công
                    $scope.status = 'success';
                    $scope.message = 'Xác thực thành công!';
                } else {
                    $scope.status = 'error';
                    $scope.message = response.data.message;
                }
            })
            .catch(function (error) {
                // Trường hợp lỗi
                if (error.status === 400) {
                    $scope.status = 'expired';
                    $scope.message = 'Token đã hết hạn!';
                } else {
                    $scope.status = 'error';
                    $scope.message = 'Đã xảy ra lỗi khi xác thực!';
                }
            });
    } else {
        $scope.status = 'noToken';
        $scope.message = 'Không tìm thấy token!';
    }
}]);
