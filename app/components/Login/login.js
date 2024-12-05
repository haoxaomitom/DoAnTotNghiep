// let app = angular.module('parkingApp', []);

app.controller('LoginController', function ($scope, $http, $window) {
    console.log("run");
    app.controller('LoginController', function ($scope, $http, $window) {
        console.log("run");
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
                            $location.path(redirectUrl);
                        } else {
                            // Mặc định 
                            $window.location.href = '/app/index.html';
                            $window.location.href = '/app/index.html';
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
    $scope.loginWithFacebook = function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    const facebookToken = response.authResponse.accessToken;
                    // Send the Facebook token to the server for login
                    $http.post('http://localhost:8080/api/users/facebook-login', { token: facebookToken })
                        .then(function (response) {
                            if (response.data.status) {
                                const token = response.data.data.token;
                                const userId = response.data.data.userId;
                                localStorage.setItem('token', token);
                                localStorage.setItem('userId', userId);
                                const redirectUrl = localStorage.getItem('redirectUrl');
                                if (redirectUrl) {
                                    localStorage.removeItem('redirectUrl');
                                    $window.location.href = redirectUrl;
                                } else {
                                    $window.location.href = '/home';
                                }
                            } else {
                                $scope.message = response.data.message;
                            }
                        }, function (error) {
                            console.log('Login failed:', error);
                        });
                }
            });
        };

    $scope.registerUser = function () {
        const user = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password
        };
        $http.post('http://localhost:8080/api/users/register', user)
            .then(function (response) {
                console.log('User registered successfully:', response);
            }, function (error) {
                console.log('Registration failed:', error);
            });
    };

    $scope.loginWithGoogle = function () {
        const clientId = '326720550153-k9n1s1v6vdomueidjne4bggu8o6n2u6d.apps.googleusercontent.com';
        const redirectUri = 'http://localhost:8080/login/oauth2/code/google';
        const scope = 'openid profile email';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline`;

        // Chuyển hướng người dùng tới URL xác thực của Google
        $window.location.href = authUrl;
    };
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log("Authorization Code: " + code);

    if (code) {
        $http.post('/api/auth/google', { code: code })
            .then(function (response) {
                console.log('User Info:', response.data);
                $scope.user = response.data;
            })
            .catch(function (error) {
                console.error('Login error:', error);
            });
    }



}
)
