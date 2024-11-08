let app = angular.module('parkingApp', []);

app.controller('loginController', function ($scope, $http, $window) {
    $scope.login = {
        username: '',
        password: ''
    }

    $scope.submitFormLogin = function () {
        const data = {
            username: $scope.login.username,
            password: $scope.login.password
        }
        $http.post('http://localhost:8080/api/users/login', data)
            .then(function (response) {
                if (response.data.status) {

                    const token = response.data.data.token;
                    const userId = response.data.data.userId;
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', $scope.login.username);
                    localStorage.setItem('userId', userId);
                    const redirectUrl = localStorage.getItem('redirectUrl');
                    if (redirectUrl) {
                        // Xóa URL đã lưu sau khi chuyển hướng
                        localStorage.removeItem('redirectUrl');
                        // Chuyển hướng đến trang trước đó
                        $window.location.href = redirectUrl;
                    } else {
                        // Mặc định 
                        $window.location.href = '/app/components/post/post.html';
                    }
                } else {
                    $scope.message = response.data.message;
                }
            }, function (error) {
                console.log(error);
            }
            )
    }
    $scope.submitFormRegister = function () {
        const data = {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            username: $scope.username,
            email: $scope.email,
            password: $scope.password,
            confirmPassword: $scope.confirmPassword
        }
        if (data.confirmPassword === data.password) {
            $http.post('http://localhost:8080/api/users/register', data)
                .then(function (response) {
                    console.log(data);
                    if (response.data.status) {
                        alert(response.data.message);
                        console.log(response.data.message)
                    } else {
                        $scope.message = response.data.message;
                        console.log(response.data.message)
                    }
                }, function (error) {
                    console.log(error);
                }
                )
        } else {
            $scope.message = "Mật khẩu và xác nhận mật khẩu ko giống nhau";
            return;
        }
    }
}
)
