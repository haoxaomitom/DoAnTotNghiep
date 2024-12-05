app.controller('UpPostController', function ($scope, $http, UpPostService) {
    $scope.user_id = 1;
    $scope.currentStep = 1;
    $scope.isLoading = false// Biến trạng thái loading
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
        amenities: [],
        images: [], // Store image URLs here
        vehicleTypes: []
    };

    $scope.checkboxOptions = {
        'Camera giám sát': 'Camera giám sát',
        'Bảo vệ 24/7': 'Bảo vệ 24/7',
        'Lối đi riêng': 'Lối đi riêng',
        'Chỗ để xe điện': 'Chỗ để xe điện',
        'Wifi': 'Wifi'
    };

    $scope.selectedFiles = [];
    $scope.selectedAmenities = {}; // To keep track of selected amenities
    $scope.manualInput = ""; // For manual input of amenities

    // Function to move to the next step
    $scope.nextStep = function () {
        if ($scope.currentStep < 6) {
            $scope.currentStep++;
        }
    };
    $scope.prevStep = function() {
        if ($scope.currentStep > 1) {
            $scope.currentStep--;
        }
    };

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
    // Prepare the amenities data to send to the backend
    $scope.preparePostData = function () {
        const selectedAmenities = [];
        for (let key in $scope.selectedAmenities) {
            if ($scope.selectedAmenities[key]) { // If the checkbox or manual input is selected
                selectedAmenities.push({ amenitiesName: key });
            }
        }
        return selectedAmenities;
    };

    // Add amenities from the checkbox options
    $scope.toggleCheckbox = function (key) {
        $scope.selectedAmenities[key] = !$scope.selectedAmenities[key];
    };

    // Add tag from manual input
    $scope.addTag = function () {
        const tagText = $scope.manualInput.trim();
        if (tagText && !$scope.selectedAmenities[tagText]) {
            $scope.selectedAmenities[tagText] = true;
            $scope.manualInput = ''; // Clear manual input after adding
        } else if (tagText === '') {
            alert('Vui lòng nhập tên tiện ích!');
        } else {
            alert('Tiện ích này đã tồn tại!');
        }
    };

    // Remove tag from selected amenities
    $scope.removeTag = function (tag) {
        delete $scope.selectedAmenities[tag];
    };

    // Hàm xử lý khi chọn file ảnh
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
            const url = `http://localhost:8080/api/upPosts/images/${postId}`;
            
            const response = await $http.post(url, formData, {
                headers: { 'Content-Type': undefined }, // Angular will set the correct Content-Type for FormData
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
    
    

    // Submit the post after images are uploaded



    $scope.submitPost = async function () {
        if ($scope.isLoading) return; // Ngăn việc nhấn nhiều lần
        $scope.isLoading = true; // Bắt đầu loading
        $scope.post.province_name = $scope.selectedProvince ? $scope.selectedProvince.Name : null;
        $scope.post.district_name = $scope.selectedDistrict ? $scope.selectedDistrict.Name : null;
        $scope.post.ward_name = $scope.selectedWard ? $scope.selectedWard.Name : null;
        try {
            // Tạo dữ liệu bài đăng
            const postData = {
                parkingName: $scope.post.parking_name,
                description: $scope.post.description,
                street: $scope.post.street,
                wardName: $scope.post.ward_name,
                districtName: $scope.post.district_name,
                provinceName: $scope.post.province_name,
                price: $scope.post.price,
                priceUnit: $scope.post.price_unit,
                capacity: $scope.post.capacity,
                latitude: $scope.post.latitude,
                longitude: $scope.post.longitude,
                amenities: $scope.preparePostData(),
                vehicleTypes: $scope.post.vehicleTypes,
                userId: $scope.user_id,
            };
    
            console.log("request bài đăng");
            const response = await $http.post('http://localhost:8080/api/upPosts', postData);
    
            const postId = response.data.postId;
            if (!postId) throw new Error('Không nhận được postId từ backend.');
    
            console.log('Tạo bài đăng thành công với postId:', postId);
    
            if ($scope.selectedFiles.length > 0) {
                const imageUrls = await $scope.uploadImages(postId);
                if (imageUrls.length > 0) {
                    console.log('Ảnh đã upload:', imageUrls);
                }
            } else {
                console.log('Không có ảnh nào được chọn.');
            }
    
            alert('Bài đăng đã được tạo thành công!');
        } catch (error) {
            console.error('Lỗi khi đăng bài:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            $scope.isLoading = false; 
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