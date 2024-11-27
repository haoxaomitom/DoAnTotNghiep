let app = angular.module('parkingApp', []);

app.controller('AdminController', function ($scope, $http, $window) {

    // Lấy dữ liệu tỉnh thành từ GitHub
    $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
        .then(function (response) {
            // Lưu dữ liệu vào $scope
            $scope.provinces = response.data;
        })
        .catch(function (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        });

    // Khi chọn Tỉnh/Thành Phố
    $scope.onProvinceChange = function () {
        $scope.selectedDistrict = null; // Reset Quận/Huyện
        $scope.selectedWard = null;     // Reset Phường/Xã

        if ($scope.selectedProvince) {
            $scope.districts = $scope.selectedProvince.Districts; // Lấy danh sách Quận/Huyện
        } else {
            $scope.districts = [];
        }
    };

    // Khi chọn Quận/Huyện
    $scope.onDistrictChange = function () {
        $scope.selectedWard = null;     // Reset Phường/Xã

        if ($scope.selectedDistrict) {
            $scope.wards = $scope.selectedDistrict.Wards; // Lấy danh sách Phường/Xã
        } else {
            $scope.wards = [];
        }
    };

    // Hàm tìm kiếm gợi ý Tỉnh/Thành Phố
    $scope.searchSuggestions = function (inputValue) {
        if (!inputValue) {
            $scope.suggestions = []; // Nếu không có giá trị, không hiển thị gợi ý
            return;
        }

        // Tìm kiếm trong danh sách tỉnh thành
        $scope.suggestions = $scope.provinces.filter(function (province) {
            return province.Name.toLowerCase().includes(inputValue.toLowerCase());
        });
    };

    // Chọn Tỉnh/Thành Phố từ gợi ý
    $scope.selectProvince = function (province) {
        $scope.selectedProvince = province;
        $scope.inputProvince = province.Name; // Cập nhật giá trị input
        $scope.suggestions = []; // Ẩn danh sách gợi ý
        $scope.onProvinceChange(); // Reset quận/huyện
    };


    $scope.currentPage = 1;
    $scope.pageSize = 10;

    // Tính toán tổng số trang
    $scope.calculateTotalPages = function () {
        $scope.totalPages = Math.ceil($scope.users.length / $scope.pageSize);
    };
    // Hàm chuyển đến trang đầu
    $scope.goToFirstPage = function () {
        $scope.currentPage = 1;
    };

    // Hàm chuyển đến trang cuối
    $scope.goToLastPage = function () {
        $scope.currentPage = $scope.totalPages;
    };

    // Hàm chuyển đến trang trước
    $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
    };

    // Hàm chuyển đến trang sau
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
        }
    };
    const token = localStorage.getItem("token");

    if (token) {
        $http.get('http://localhost:8080/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                if (response.data.status) {
                    $scope.users = response.data.data;
                    $scope.calculateTotalPages();
                } else {
                    console.log(response.data.message);
                }
            })
    } else {
        localStorage.setItem('redirectUrl', $window.location.href);
        $window.location.href = '/app/components/Login/LoginAndRegister.html';
    }

    $scope.getUserByUsername = function (username) {
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
                    $scope.dateOfBirth = new Date(data.dateOfBirth).toLocaleDateString('en-GB');
                    $scope.phoneNumber = data.phoneNumber;
                    $scope.email = data.email;
                    $scope.avatar = data.avatar;
                    $scope.username = data.username;
                    $scope.password = data.password;
                    $scope.createdAt = new Date(data.createdAt).toLocaleString('en-GB');
                    // Đổ dữ liệu Tỉnh/Thành Phố, Quận/Huyện, Phường/Xã

                    $scope.selectedProvince = $scope.provinces.find(province => province.Name === data.provinceName);
                    if ($scope.selectedProvince) {
                        $scope.inputProvince = $scope.selectedProvince.Name; // Gán giá trị cho input

                        $scope.districts = $scope.selectedProvince.Districts; // Lấy danh sách Quận/Huyện

                        $scope.selectedDistrict = $scope.districts.find(district => district.Name === data.districtName);
                        if ($scope.selectedDistrict) {
                            $scope.wards = $scope.selectedDistrict.Wards; // Lấy danh sách Phường/Xã

                            $scope.selectedWard = $scope.wards.find(ward => ward.Name === data.wardName);
                        }
                    }


                } else {
                    console.log(response.data.message);
                }
            }, function (error) {
                console.log(error);
            }
            )
    }

    $scope.username = '';
    $scope.password = '';
    $scope.createAccount = function () {
        const dataAccount = {
            username: $scope.username,
            password: $scope.password
        }
        const dataInfoAccount = {

        }
        $http.post('http://localhost:8080/api/users/login', dataAccount)
            .then(function (response) {
                if (response.data.status) {
                    $http.put('http://localhost:8080/api/users/update', data, {
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
                } else {
                    $scope.message = response.data.message;
                }
            }, function (error) {
                console.log(error);
            }
            )
    }
    $scope.user = {};
    $scope.deleteAccount = function () {
        console.log($scope.user);

    }
    localStorage
    $scope.verified = function () {
        $http.put(verificationUrl)
            .then(function (response) {
                if (response.data.status) {
                    console.log("thành công");

                } else {
                    console.log(response.data.message);

                }
            })
    }

})