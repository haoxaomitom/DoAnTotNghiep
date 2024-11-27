let app = angular.module('parkingApp', []);

// Directive cho input file, dùng để gán file vào model
app.directive("fileModel", ["$parse", function ($parse) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            const model = $parse(attrs.fileModel);
            const modelSetter = model.assign;

            element.bind("change", function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        },
    };
}]);
app.controller('detailUserController', function ($scope, $http, $window) {
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

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
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
                    $scope.avatar = data.avatar;
                    $scope.isVerified = data.verified ? "Xác thực Email" : "Đã xác thực"
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

    // load avata
    $scope.uploadAvatar = function () {
        const formData = new FormData();
        formData.append("file", $scope.file);
        console.log(formData);
        if (!$scope.file || !/^image\//.test($scope.file.type)) {
            console.error("Chỉ chấp nhận các định dạng ảnh.");
            $scope.uploadResult = {
                status: false,
                message: "Chỉ chấp nhận các định dạng ảnh.",
            };
            return;
        }

        // Gửi yêu cầu PUT đến API
        $http
            .put(`http://localhost:8080/api/users/avatar/${username}`, formData, {
                headers: {
                    "Content-Type": undefined,
                    'Authorization': `Bearer ${token}`
                },
                transformRequest: angular.identity,
            })
            .then(function (response) {
                $scope.uploadResult = response.data;
                console.log($scope.uploadResult.message);


                // Cập nhật URL của avatar nếu upload thành công
                if ($scope.uploadResult.status) {
                    $scope.avatar = $scope.uploadResult.data.avatar;
                    console.log("thành công");
                }
            })
            .catch(function (error) {
                console.error("Lỗi tải ảnh:", error);
                $scope.uploadResult = {
                    status: false,
                    message: "Tải ảnh thất bại. Vui lòng thử lại.",
                };
            });
    };

    // Gọi hàm upload khi người dùng chọn một file
    $scope.$watch("file", function (newFile) {
        console.log("File selected:", newFile);
        if (newFile) {
            $scope.uploadAvatar();
        }
    });
    // cập nhật thông tin
    $scope.update = function () {

        const data = {
            username: localStorage.getItem('username'),
            lastName: $scope.lastName,
            firstName: $scope.firstName,
            gender: $scope.gender,
            dateOfBirth: new Date($scope.dateOfBirth),
            provinceName: $scope.selectedProvince.Name,
            districtName: $scope.selectedDistrict.Name,
            wardName: $scope.selectedWard.Name,
            phoneNumber: $scope.phoneNumber,
            email: $scope.email,

        }
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
    }
    $scope.verified = function () {
        $http.get(`http://localhost:8080/api/email/send-verification-email?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                if (response.data.status) {
                    alert("Đã gửi email xác nhận qua địa chỉ mail của bạn")
                    console.log("thành công");

                } else {
                    console.log(response.data.message);

                }
            })
    }



})