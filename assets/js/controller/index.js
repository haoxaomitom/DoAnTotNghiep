
var app = angular.module('app', []);

app.service('PostService', ['$http', function ($http) {
    // Lưu bài đăng
    this.savePost = function (postData) {
        return $http.post('https://doantotnghiepbe-production.up.railway.app/api/posts/saveUpPost', postData);
    };
}]);

app.controller('MainController', ['$scope', '$http', 'PostService', function ($scope, $http, PostService) {
    $scope.post = {
        user_id: 1,
        parking_name: '',
        street: '',
        ward_name: '',
        district_name: '',
        province_name: '',
        price: null,
        price_unit: '',
        capacity: null,
        latitude: null,
        longitude: null,
        description: '',
        status: '',
        comment_count: 0,
    };

    // Hàm gửi bài đăng đến API server
    $scope.submitPost = function () {
        if ($scope.postForm.$valid) {
            // Cập nhật dữ liệu địa chỉ và thời gian tạo
            $scope.post.province_name = $scope.selectedProvince ? $scope.selectedProvince.Name : null;
            $scope.post.district_name = $scope.selectedDistrict ? $scope.selectedDistrict.Name : null;
            $scope.post.ward_name = $scope.selectedWard ? $scope.selectedWard.Name : null;

            const postData = {
                user_id: $scope.post.user_id,
                parking_name: $scope.post.parking_name,
                street: $scope.post.street,
                ward_name: $scope.post.ward_name,
                district_name: $scope.post.district_name,
                province_name: $scope.post.province_name,
                price: $scope.post.price,
                price_unit: $scope.post.price_unit,
                capacity: $scope.post.capacity,
                latitude: $scope.post.latitude,
                longitude: $scope.post.longitude,
                description: $scope.post.description,
                status: $scope.post.status,
                comment_count: $scope.post.comment_count,
            };

            // Gọi API để lưu bài đăng
            PostService.savePost(postData)
                .then(() => alert('Bài đăng đã được lưu thành công!'))
                .catch(error => alert('Đã xảy ra lỗi khi lưu bài đăng.'));
        } else {
            alert('Vui lòng điền đầy đủ các thông tin cần thiết.');
        }
    };

    // Chuyển bước
    $scope.nextStep = function (sectionId) {
        document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
    };

    // Lưu tọa độ từ bản đồ
    $scope.saveCoordinates = function () {
        $scope.nextStep('area-price');
    };

    // Lấy danh sách tỉnh từ API
    $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
        .then(response => $scope.provinces = response.data)
        .catch(error => console.error('Error loading data:', error));

    $scope.onProvinceChange = function () {
        $scope.selectedDistrict = null;
        $scope.selectedWard = null;
    };

    $scope.onDistrictChange = function () {
        $scope.selectedWard = null;
    };
}]);
let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), { center: { lat: 10.8231, lng: 106.6297 }, zoom: 13 });
    map.addListener("click", function (event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        if (!marker) {
            marker = new google.maps.Marker({ position: { lat, lng }, map: map });
        } else {
            marker.setPosition({ lat, lng });
        }
        $scope.post.latitude = lat;
        $scope.post.longitude = lng;
    });
}


//Amenities
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
    const baseUrl = 'https://doantotnghiepbe-production.up.railway.app/api/amenities';

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


//Image
app.controller('ImagesController', ['$scope', 'ImageService', function($scope, ImageService) {
    // Danh sách file ảnh đã chọn
    $scope.selectedFiles = [];

    // Hàm xử lý khi người dùng chọn ảnh
    $scope.onFileSelect = function(files) {
        $scope.$apply(function() {
            $scope.selectedFiles = Array.from(files).map(file => {
                file.preview = URL.createObjectURL(file); // Tạo preview URL
                return file;
            });
        });
    };

    // Hàm xử lý submit bài đăng
    $scope.submitPost = function() {
        const postId = 1; // Giả sử postId là 1 (thay bằng logic thực tế)
        
        if ($scope.selectedFiles.length === 0) {
            alert('Vui lòng chọn ít nhất một ảnh!');
            return;
        }

        ImageService.uploadImages($scope.selectedFiles, postId).then(
            function(response) {
                alert('Ảnh đã được upload thành công!');
                console.log(response.data); // Xử lý kết quả trả về từ backend
            },
            function(error) {
                alert('Có lỗi xảy ra khi upload ảnh!');
                console.error(error);
            }
        );
    };
}]);

app.service('ImageService', ['$http', function ($http) {
    const baseUrl = 'https://doantotnghiepbe-production.up.railway.app/api/images';

    // Upload ảnh
    this.uploadImages = function (images, postId) {
        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`file`, image); // Dùng file key để gửi
        });
        formData.append('postId', postId);

        return $http.post(`${baseUrl}/upload`, formData, {
            headers: { 'Content-Type': undefined },
        });
    };
}]);



