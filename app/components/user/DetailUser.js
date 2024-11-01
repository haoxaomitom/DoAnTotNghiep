let app = angular.module('parkingApp', []);

app.controller('detailUserController', function ($scope, $http, $window) {
    $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
        .then(function (response) {
            // Lưu dữ liệu vào $scope
            $scope.provinces = response.data;
        })
        .catch(function (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        });

    // Xử lý khi chọn Tỉnh/Thành Phố
    $scope.onProvinceChange = function () {
        $scope.selectedDistrict = null; // Reset Quận/Huyện
        $scope.selectedWard = null;     // Reset Phường/Xã
    };
    // Xử lý khi chọn Quận/Huyện
    $scope.onDistrictChange = function () {
        $scope.selectedWard = null;     // Reset Phường/Xã
    };

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (username && token) {
        $http.get(`http://localhost:8080/api/users/getUserByUsername?username=${username}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token trong header
            }
        })
            .then(function (response) {
                if (response.data.status) {
                    const data = response.data.data;
                    $scope.firstName = data.firstName;
                    $scope.lastName = data.lastName;
                    $scope.gender = data.gender;
                    $scope.dateOfBirth = data.dateOfBirth;
                    $scope.phoneNumber = data.phoneNumber;
                    $scope.email = data.email;
                    $scope.fullName = data.lastName + ' ' + data.firstName;

                } else {
                    console.log(response.data.message);
                }
            }, function (error) {
                console.log(error);
            }
            )
    } else {
        localStorage.setItem('redirectUrl', $window.location.href);
        $window.location.href = '/app/components/Login/LoginAndRegister.html';
    }
    // Đăng xuất
    $scope.logout = function () {

        localStorage.clear();
        // Chuyển hướng đến trang chủ
        $window.location.href = '/app/components/post/home.html';
    };
    // Cập nhật thông tin
    $scope.update = function () {
        const data = {
            username: localStorage.getItem('username'),
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            gender: $scope.gender ? 'Male' : 'Female',
            phoneNumber: $scope.phoneNumber,
            email: $scope.email,
        }

        $http.post('http://localhost:8080/api/users/update', data, {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token trong header
            }
        })
            .then(function (response) {
                if (response.data.status) {
                    alert("Cập nhật thành công!");
                } else {
                    $scope.message = response.data.message
                }
            })
    }
})