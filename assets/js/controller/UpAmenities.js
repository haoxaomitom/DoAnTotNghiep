var app = angular.module('app', []);

        app.controller('AmenitiesController', function ($scope, PostService) {
            $scope.postId = 1; // ID bài đăng, giả sử đã lấy từ URL hoặc backend
            $scope.post = {
                amenities: {} // Dữ liệu tiện ích được chọn
            };

            $scope.tags = []; // Danh sách thẻ tiện ích
            $scope.manualInput = ""; // Tiện ích nhập thủ công
            $scope.checkboxOptions = {
                camera: 'Có camera',
                lock: 'Có khóa cổng ra vào tự do',
                charging: 'Có trạm sạc xe điện',
                security247: 'Có bảo vệ 24/7',
                roof: 'Có mái che',
                security2424: 'Có bảo vệ 24/24',
                carwash: 'Có dịch vụ rửa xe'
            };

            // Tải tiện ích từ backend
            $scope.loadAmenities = function () {
                PostService.getAmenitiesByPostId($scope.postId)
                    .then(function (amenities) {
                        amenities.forEach(function (amenity) {
                            const key = Object.keys($scope.checkboxOptions).find(k => $scope.checkboxOptions[k] === amenity.name);
                            if (key) {
                                $scope.post.amenities[key] = true;
                                $scope.tags.push(amenity.name);
                            }
                        });
                    })
                    .catch(function (error) {
                        console.error('Lỗi khi tải tiện ích:', error);
                    });
            };

            // Thêm thẻ
            $scope.addTag = function (text) {
                const tagText = text.trim();
                if (!tagText || $scope.tags.includes(tagText)) {
                    return alert('Thẻ này đã tồn tại hoặc trống!');
                }

                $scope.tags.push(tagText);
                const key = Object.keys($scope.checkboxOptions).find(k => $scope.checkboxOptions[k] === tagText);
                if (key) {
                    $scope.post.amenities[key] = true;
                }
                $scope.manualInput = '';
            };

            // Xóa thẻ
            $scope.removeTag = function (tag) {
                $scope.tags = $scope.tags.filter(t => t !== tag);
                const key = Object.keys($scope.checkboxOptions).find(k => $scope.checkboxOptions[k] === tag);
                if (key) {
                    $scope.post.amenities[key] = false;
                }
            };

            // Bật/tắt tiện ích qua checkbox
            $scope.toggleCheckbox = function (key, label) {
                if ($scope.post.amenities[key]) {
                    if (!$scope.tags.includes(label)) {
                        $scope.tags.push(label);
                    }
                } else {
                    $scope.tags = $scope.tags.filter(tag => tag !== label);
                }
            };


            $scope.logFormData = function () {
                // Lọc các tiện ích từ checkbox đã chọn
                var amenitiesDTOs = Object.keys($scope.post.amenities)
                    .filter(key => $scope.post.amenities[key])
                    .map(key => ({
                        amenitiesName: $scope.checkboxOptions[key] // Lấy tên từ checkbox
                    }));

                // Thêm tiện ích thủ công (nếu chưa có trong danh sách)
                if ($scope.manualInput.trim() && !$scope.tags.includes($scope.manualInput.trim())) {
                    amenitiesDTOs.push({
                        amenitiesName: $scope.manualInput.trim()
                    });
                }

                // Ghi log để kiểm tra
                console.log('Checkbox đã chọn:', amenitiesDTOs.map(a => a.amenitiesName));
                console.log('Tiện ích thủ công:', $scope.manualInput.trim());
                console.log('Danh sách tiện ích được chọn:', amenitiesDTOs);

                return amenitiesDTOs;
            };

            // Hiển thị dữ liệu trước khi gửi
            $scope.submitForm = function () {
                // Tạo danh sách DTO từ các thẻ trong tag-container
                var amenitiesDTOs = $scope.tags.map(tag => ({
                    amenitiesName: tag
                }));
                // var amenitiesDTOs = $scope.logFormData(); // Gọi hàm log dữ liệu
                // Hiển thị dữ liệu gửi để kiểm tra
                console.log('Danh sách tiện ích gửi đến backend:', amenitiesDTOs);

                // Gửi đến server
                PostService.saveAmenities($scope.postId, amenitiesDTOs)
                    .then(function (response) {
                        alert('Tiện ích đã được lưu thành công!');
                        console.log('Phản hồi từ server:', response);
                    })
                    .catch(function (error) {
                        alert('Đã xảy ra lỗi khi lưu tiện ích.');
                        console.error('Lỗi:', error);
                    });
            };




            // Tải tiện ích khi khởi động
            $scope.loadAmenities();
        });

        app.service('PostService', function ($http) {
            const baseUrl = 'http://localhost:8080/api/amenities';

            // Lưu tiện ích
            this.saveAmenities = function (postId, amenities) {
                return $http.post(`${baseUrl}/${postId}`, amenities)
                    .then(function (response) {
                        return response.data; // Dữ liệu trả về từ backend
                    })
                    .catch(function (error) {
                        console.error('Lỗi khi lưu tiện ích:', error);
                        throw error;
                    });
            };

            // Lấy tiện ích theo postId
            this.getAmenitiesByPostId = function (postId) {
                return $http.get(`${baseUrl}/${postId}`)
                    .then(function (response) {
                        return response.data; // Trả về danh sách tiện ích
                    })
                    .catch(function (error) {
                        console.error('Lỗi khi lấy tiện ích:', error);
                        throw error;
                    });
            };
        });
