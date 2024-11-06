let app = angular.module('parkingApp', []);

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
    $scope.uploadImage = function (files) {
        if (files && files.length) {
            const file = files[0]; // Chọn tệp đầu tiên
            const reader = new FileReader();

            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.avatar = e.target.result; // Lưu trữ URL của ảnh đại diện
                    console.log("change avatar");

                });
            };

            reader.readAsDataURL(file); // Đọc tệp như một URL dữ liệu
        }
    };
    $scope.setAvatarFile = function (file) {
        $scope.avatarFile = file;
    };
    $scope.uploadAvatar = function () {
        const file = $scope.avatarFile;
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const username = localStorage.getItem("username");

        $http.put(`http://localhost:8080/api/users/avatar/${username}`, formData, {
            headers: {
                'Content-Type': undefined,  // Let the browser set the Content-Type
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.data.status) {
                // Update avatar with the new Cloudinary URL from the backend response
                $scope.avatar = response.data.data.avatar;
                alert("Avatar updated successfully!");
            } else {
                console.log(response.data.message);
                alert("Failed to update avatar.");
            }
        }).catch(error => {
            console.error("Error uploading avatar", error);
            alert('Failed to upload the avatar.');
        });
    };

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
        console.log($scope.phoneNumber);
        console.log(data.phoneNumber);


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


})