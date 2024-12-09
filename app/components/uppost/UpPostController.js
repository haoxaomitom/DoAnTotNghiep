app.controller('UpPostController', function ($scope, $http, $location) {
    // Retrieve userId from localStorage
    const token = localStorage.getItem('token');
    $scope.user_id = localStorage.getItem('userId');
    $scope.currentStep = 1;
    $scope.isLoading = false;
    $scope.isSubmitted = false; // kiểm tra đã đăng bài hay chưa
    $scope.post = {
        parking_name: '',
        description: '',
        street: '',
        ward_name: '',
        district_name: '',
        province_name: '',
        price: '',
        price_unit: '',
        capacity: '',
        latitude: null,
        longitude: null,
        amenities: {}, // Sử dụng object để lưu trạng thái checkbox
        images: [],
        vehicleTypes: []
    };

    $scope.tags = []; // Danh sách tiện ích hiển thị
    $scope.manualInput = ""; // Tiện ích nhập thủ công
    $scope.vehicleTags = []; // Danh sách loại xe hiển thị
    $scope.manualVehicleInput = ""; // Loại xe nhập thủ công

    $scope.checkboxOptions = {
        camera: 'Camera giám sát',
        security247: 'Bảo vệ 24/7',
        privatePath: 'Lối đi riêng',
        electricParking: 'Chỗ để xe điện',
        wifi: 'Wifi'
    };
    $scope.vehicleCheckboxOptions = {
        car: 'Ô tô',
        motorbike: 'Xe máy',
        bike: 'Xe đạp',
        electricCar: 'Xe điện',
        truck: 'Xe tải'
    };
    $scope.selectedFiles = [];
    $scope.selectedAmenities = {}; // To keep track of selected amenities
    $scope.manualInput = ""; // For manual input of amenities

    // Function to move to the next step
    $scope.nextStep = function () {
        if ($scope.currentStep < 7) {
            $scope.currentStep++;
        }
    };
    $scope.prevStep = function () {
        if ($scope.currentStep > 1) {
            $scope.currentStep--;
        }
    };

    // Load dữ liệu tỉnh, huyện, xã
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

    // Thêm loại xe từ checkbox
    $scope.toggleVehicleCheckbox = function (key, label) {
        if ($scope.post.vehicleTypes[key]) {
            if (!$scope.vehicleTags.includes(label)) {
                $scope.vehicleTags.push(label);
            }
        } else {
            $scope.vehicleTags = $scope.vehicleTags.filter(tag => tag !== label);
        }
    };

    // Thêm loại xe từ nhập thủ công
    $scope.addVehicleTag = function () {
        const tagText = $scope.manualVehicleInput.trim();
        if (!tagText || $scope.vehicleTags.includes(tagText)) {
            return alert('Loại xe đã tồn tại hoặc nhập rỗng!');
        }
        $scope.vehicleTags.push(tagText);
        $scope.post.vehicleTypes[tagText] = true;
        $scope.manualVehicleInput = '';
    };

    // Xóa loại xe
    $scope.removeVehicleTag = function (tag) {
        $scope.vehicleTags = $scope.vehicleTags.filter(t => t !== tag);
        const key = Object.keys($scope.vehicleCheckboxOptions).find(k => $scope.vehicleCheckboxOptions[k] === tag);
        if (key) {
            $scope.post.vehicleTypes[key] = false;
        } else {
            delete $scope.post.vehicleTypes[tag];
        }
    };

    // Thêm thẻ từ checkbox
    $scope.toggleCheckbox = function (key, label) {
        if ($scope.post.amenities[key]) {
            if (!$scope.tags.includes(label)) {
                $scope.tags.push(label);
            }
        } else {
            $scope.tags = $scope.tags.filter(tag => tag !== label);
        }
    };

    // Thêm tiện ích từ nhập thủ công
    $scope.addTag = function () {
        const tagText = $scope.manualInput.trim();
        if (!tagText || $scope.tags.includes(tagText)) {
            return alert('Tiện ích đã tồn tại hoặc nhập rỗng!');
        }
        $scope.tags.push(tagText);
        $scope.post.amenities[tagText] = true;
        $scope.manualInput = '';
    };

    // Xóa tiện ích
    $scope.removeTag = function (tag) {
        $scope.tags = $scope.tags.filter(t => t !== tag);
        const key = Object.keys($scope.checkboxOptions).find(k => $scope.checkboxOptions[k] === tag);
        if (key) {
            $scope.post.amenities[key] = false;
        } else {
            delete $scope.post.amenities[tag];
        }
    };

    // Xử lý khi chọn file ảnh
    $scope.onFileSelect = function (files) {
        $scope.$apply(function () {
            $scope.selectedFiles = Array.from(files).map(file => {
                file.preview = URL.createObjectURL(file); // Tạo preview URL
                console.log(file);
                return file;
            });
        });
    };

    // Hàm upload ảnh lên server
    $scope.uploadImages = async function (postId) {
        console.log("run upload img");
        if ($scope.selectedFiles.length === 0) {
            alert('Vui lòng chọn ít nhất một ảnh!');
            return [];
        }

        const formData = new FormData();
        $scope.selectedFiles.forEach((image) => {
            formData.append('imageFiles', image); // Attach the file to the request
        });

        // Send the postId along with the images to associate them
        formData.append('postId', postId);

        try {
            // Chèn postId vào URL
            const url = `https://doantotnghiepbe-production.up.railway.app/api/upPosts/images/${postId}`;

            const response = await $http.post(url, formData, {
                headers: { 'Content-Type': undefined, 'Authorization': `Bearer ${token}` }, // Add token in header
                transformRequest: angular.identity // Ensure FormData is correctly serialized
            });
            console.log("rp: " + response);
            console.log("rp: " + response.data);
            // Assuming the server returns an array of image URLs
            return response.data; // Return the image URLs to be used in the form
        } catch (error) {
            console.error('Upload ảnh thất bại:', error);
            alert('Có lỗi xảy ra khi tải ảnh lên.');
            return [];
        }
    };

    $scope.submitPost = async function () {
        if ($scope.isLoading || $scope.isSubmitted) return;  // Không cho phép nhấn khi đang loading hoặc đã gửi bài

        $scope.isLoading = true; // Bắt đầu quá trình loading
        $scope.isSubmitted = true; // Đánh dấu là bài đã được gửi

        try {
            const postData = {
                parkingName: $scope.post.parking_name,
                description: $scope.post.description,
                street: $scope.post.street,
                wardName: $scope.selectedWard ? $scope.selectedWard.Name : null,
                districtName: $scope.selectedDistrict ? $scope.selectedDistrict.Name : null,
                provinceName: $scope.selectedProvince ? $scope.selectedProvince.Name : null,
                price: $scope.post.price,
                priceUnit: $scope.post.price_unit,
                capacity: $scope.post.capacity,
                latitude: $scope.post.latitude,
                longitude: $scope.post.longitude,
                amenities: Object.keys($scope.post.amenities)
                    .filter(key => $scope.post.amenities[key])
                    .map(key => ({ amenitiesName: $scope.checkboxOptions[key] || key })),
                vehicleTypes: Object.keys($scope.post.vehicleTypes)
                    .filter(key => $scope.post.vehicleTypes[key])
                    .map(key => ({ vehicleTypesName: $scope.vehicleCheckboxOptions[key] || key })),
                userId: $scope.user_id,
            };

            console.log("Dữ liệu gửi lên:", postData);

            // Gửi request tạo bài đăng
            const response = await $http.post('https://doantotnghiepbe-production.up.railway.app/api/upPosts', postData, {
                headers: { 'Authorization': `Bearer ${token}` } // Add token in header
            });

            const postId = response.data.postId;
            if (!postId) throw new Error('Không nhận được postId từ backend.');

            console.log('Tạo bài đăng thành công với postId:', postId);

            // Upload ảnh nếu có
            if ($scope.selectedFiles.length > 0) {
                const imageUrls = await $scope.uploadImages(postId);
                if (imageUrls.length > 0) {
                    console.log('Ảnh đã upload:', imageUrls);
                }
            } else {
                console.log('Không có ảnh nào được chọn.');
            }

            // Thông báo và chuyển hướng về trang chủ
            alert('Bài đăng đã được tạo thành công!');
            $location.path = '/'; // Chuyển hướng về trang chủ

        } catch (error) {
            console.error('Lỗi khi đăng bài:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            $scope.isLoading = false; // Tắt trạng thái loading
            $scope.$apply();
        }
    };
    
});

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