var app = angular.module('app', []);

app.service('PostService', ['$http', function ($http) {
    this.savePost = function (postData) {
        return $http.post('https://doantotnghiepbe-production.up.railway.app/api/upPosts/savePost', postData);
    };
}]);

app.controller('MainController', ['$scope', '$http', 'PostService', function ($scope, $http, PostService) {
    $scope.post = {
        userId: 2,
        parking_name: '',
        street: '',
        ward_name: null,
        district_name: null,
        province_name: null,
        price: null,
        price_unit: 'VND/giờ',
        capacity: null,
        latitude: null,
        longitude: null,
        description: '',
        // videoUrl: '',
        status: 'Hoạt động',
        // comment_count: 0
    };

    // Form submission function
    $scope.submitPost = function () {
        if ($scope.postForm.$valid) { // Kiểm tra tính hợp lệ của form
            // Cập nhật thông tin địa điểm
            $scope.post.province_name = $scope.selectedProvince ? $scope.selectedProvince.Name : null;
            $scope.post.district_name = $scope.selectedDistrict ? $scope.selectedDistrict.Name : null;
            $scope.post.ward_name = $scope.selectedWard ? $scope.selectedWard.Name : null;

            const postData = {
                userId: $scope.post.userId,
                parkingName: $scope.post.parking_name,
                street: $scope.post.street,
                wardName: $scope.post.ward_name,
                districtName: $scope.post.district_name,
                provinceName: $scope.post.province_name,
                price: $scope.post.price,
                priceUnit: $scope.post.price_unit,
                capacity: $scope.post.capacity,
                latitude: $scope.post.latitude,
                longitude: $scope.post.longitude,
                description: $scope.post.description,
                // videoUrl: $scope.post.videoUrl,
                status: $scope.post.status
            };

            PostService.savePost(postData)
                .then(() => alert('Bài đăng đã được lưu thành công!'))
                .catch(error => alert('Đã xảy ra lỗi khi lưu bài đăng.'));
        } else {
            alert('Vui lòng điền đầy đủ các thông tin cần thiết.');
        }
    };

    $scope.nextStep = function (sectionId) {
        document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
    };

    // $scope.saveCoordinates = function () {
    //     alert("Coordinates saved!");
    // };

    // Lấy danh sách tỉnh từ API
    $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
        .then(response => $scope.provinces = response.data)
        .catch(error => console.error('Error loading data:', error));

    // Hàm xử lý khi tỉnh thay đổi
    $scope.onProvinceChange = function () {
        $scope.selectedDistrict = null; // Đặt lại huyện khi tỉnh thay đổi
        $scope.selectedWard = null; // Đặt lại xã khi tỉnh thay đổi
    };

    // Hàm xử lý khi huyện thay đổi
    $scope.onDistrictChange = function () {
        $scope.selectedWard = null; // Đặt lại xã khi huyện thay đổi
    };

    // Hàm lấy thông tin tỉnh, huyện, xã khi submit
    $scope.getLocationDetails = function () {
        return {
            province: $scope.selectedProvince ? $scope.selectedProvince.Name : null,
            district: $scope.selectedDistrict ? $scope.selectedDistrict.Name : null,
            ward: $scope.selectedWard ? $scope.selectedWard.Name : null
        };
    };
}]);

let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), { center: { lat: 10.8231, lng: 106.6297 }, zoom: 13 });
    map.addListener("click", (e) => placeMarker(e.latLng));
}

function placeMarker(location) {
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({ position: location, map: map });

    const scope = angular.element(document.getElementById('map')).scope();

    // Cập nhật tọa độ vào scope
    if (!scope.$$phase) {
        scope.$apply(() => {
            scope.post.latitude = location.lat();
            scope.post.longitude = location.lng();
        });
    } else {
        scope.post.latitude = location.lat();
        scope.post.longitude = location.lng();
    }

    alert("Đã lưu tọa độ: " + location.lat() + ", " + location.lng());
}