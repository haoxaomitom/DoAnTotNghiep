// let app = angular.module('app', [])
app.controller('UpdatePostController', function ($scope, $http, $location) {
    // Retrieve userId from localStorage
    const token = localStorage.getItem('token');
    $scope.user_id = localStorage.getItem('userId');
    const queryParams = new URLSearchParams($location.absUrl().split('?')[1]);
    $scope.postId = queryParams.get('postId');
    const postId = $scope.postId;
    $scope.currentStep = 1;
    $scope.isLoading = false;
    $scope.isSubmitted = false; // kiểm tra đã đăng bài hay chưa

    $scope.tags = []; // Danh sách tiện ích hiển thị
    $scope.manualInput = ""; // Tiện ích nhập thủ công
    $scope.vehicleTags = []; // Danh sách loại xe hiển thị
    $scope.manualVehicleInput = ""; // Loại xe nhập thủ công

    $scope.checkboxOptions = {
        camera: 'Camera giám sát',
        security247: 'Bảo vệ 24/7',
        privatePath: 'Bảo vệ 24/24',
        electricParking: 'Chỗ để / sạc xe điện',
        wifi: 'Có rửa xe',
        key: 'Có khóa cổng riêng'
    };

    $scope.vehicleCheckboxOptions = {
        car: 'Ô tô',
        motorbike: 'Xe máy',
        bike: 'Xe du lịch 16 chỗ',
        electricCar: 'Xe oto điện',
        truck: 'Xe tải con',
        bigtruck: 'Xe tải trung',
        supertruck: 'Xe siêu tải trọng'
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

    // $scope.onProvinceChange = function () {
    //     $scope.selectedDistrict = null;
    //     $scope.selectedWard = null;
    // };

    // $scope.onDistrictChange = function () {
    //     $scope.selectedWard = null;
    // };

    // Thêm loại xe từ checkbox
    $scope.toggleVehicleCheckbox = function (key, label) {
        if ($scope.post.vehicleTypes[key]) {
            if (!$scope.vehicleTags.includes(label)) {
                $scope.vehicleTags.push(label); // Thêm vào tag nếu chọn
            }
        } else {
            $scope.vehicleTags = $scope.vehicleTags.filter(tag => tag !== label); // Loại khỏi tag nếu bỏ chọn
        }
    };


    // Thêm loại xe từ nhập thủ công
    $scope.addVehicleTag = function () {
        const tagText = $scope.manualVehicleInput.trim();
        if (!tagText || $scope.vehicleTags.includes(tagText)) {
            return alert('Loại xe đã tồn tại hoặc nhập rỗng!');
        }
        $scope.vehicleTags.push(tagText); // Thêm vào tag
        $scope.post.vehicleTypes[tagText] = true; // Thêm loại xe vào model
        $scope.manualVehicleInput = '';
    };


    // Xóa loại xe
    $scope.removeVehicleTag = function (tag) {
        $scope.vehicleTags = $scope.vehicleTags.filter(t => t !== tag);
        const key = Object.keys($scope.vehicleCheckboxOptions).find(k => $scope.vehicleCheckboxOptions[k] === tag);
        if (key) {
            $scope.post.vehicleTypes[key] = false; // Bỏ chọn checkbox
        } else {
            delete $scope.post.vehicleTypes[tag]; // Loại bỏ loại xe khỏi model
        }
    };


    // Thêm thẻ từ checkbox
    $scope.toggleCheckbox = function (key, label) {
        if ($scope.post.amenities[key]) {
            if (!$scope.tags.includes(label)) {
                $scope.tags.push(label); // Thêm vào tag nếu chọn
            }
        } else {
            $scope.tags = $scope.tags.filter(tag => tag !== label); // Loại khỏi tag nếu bỏ chọn
        }
    };


    // Thêm tiện ích từ nhập thủ công
    $scope.addTag = function () {
        const tagText = $scope.manualInput.trim();
        if (!tagText || $scope.tags.includes(tagText)) {
            return alert('Tiện ích đã tồn tại hoặc nhập rỗng!');
        }
        $scope.tags.push(tagText); // Thêm vào tag
        $scope.post.amenities[tagText] = true; // Thêm tiện ích vào model
        $scope.manualInput = '';
    };


    // Xóa tiện ích
    $scope.removeTag = function (tag) {
        $scope.tags = $scope.tags.filter(t => t !== tag);
        const key = Object.keys($scope.checkboxOptions).find(k => $scope.checkboxOptions[k] === tag);
        if (key) {
            $scope.post.amenities[key] = false; // Bỏ chọn checkbox
        } else {
            delete $scope.post.amenities[tag]; // Loại bỏ tiện ích khỏi model
        }
    };


    // Xử lý khi chọn file ảnh
    $scope.onFileSelect = function (files) {
        $scope.$apply(function () {
            // Add the new files to the selectedFiles array without removing old files
            Array.from(files).forEach(function (file) {
                file.preview = URL.createObjectURL(file); // Create preview URL for the file
                $scope.selectedFiles.push(file); // Add file to the array
                console.log(file)
            });
        });
    };

    $scope.removeImage = function (image) {
        // Remove the image from selectedFiles array
        const index = $scope.selectedFiles.indexOf(image);
        if (index !== -1) {
            $scope.selectedFiles.splice(index, 1);
        }
    };


    const apiUrl = `http://localhost:8080/api/posts/${postId}`;

    $scope.post = {};

    $scope.loadPostData = function () {
        $http.get(apiUrl)
            .then(function (response) {
                $scope.post = response.data;
                console.log($scope.post );
                // Populate form with data from API (province, district, ward)

                $scope.selectedProvince = $scope.provinces.find(province => province.Name === $scope.post.provinceName);
                
                $scope.selectedDistrict = $scope.selectedProvince ? $scope.selectedProvince.Districts.find(district => district.Name === $scope.post.districtName) : null;
                $scope.selectedWard = $scope.selectedDistrict ? $scope.selectedDistrict.Wards.find(ward => ward.Name === $scope.post.wardName) : null;
                $scope.post.priceUnit = $scope.post.priceUnit

                // Map amenities to checkbox model and tags
                if ($scope.post.amenities) {
                    $scope.post.amenities.forEach(amenity => {
                        const key = Object.keys($scope.checkboxOptions).find(k => $scope.checkboxOptions[k] === amenity.amenitiesName);
                        if (key) {
                            $scope.post.amenities[key] = true; // Tích checkbox
                            $scope.tags.push($scope.checkboxOptions[key]); // Thêm vào tag
                        } else {
                            // If the amenity is not in checkboxOptions, display it as a tag
                            $scope.tags.push(amenity.amenitiesName);
                        }
                    });
                }

                // Map vehicle types to checkbox model and tags
                if ($scope.post.vehicleTypes) {
                    $scope.post.vehicleTypes.forEach(vehicleType => {
                        const key = Object.keys($scope.vehicleCheckboxOptions).find(k => $scope.vehicleCheckboxOptions[k] === vehicleType.vehicleTypesName);
                        if (key) {
                            $scope.post.vehicleTypes[key] = true; // Tích checkbox
                            $scope.vehicleTags.push($scope.vehicleCheckboxOptions[key]); // Thêm vào tag
                        } else {
                            // If the vehicle type is not in vehicleCheckboxOptions, display it as a tag
                            $scope.vehicleTags.push(vehicleType.vehicleTypesName);
                        }
                    });
                }

                if ($scope.post.images) {
                    $scope.selectedFiles = $scope.selectedFiles || []; // Initialize selectedFiles if it's undefined
                    $scope.post.images.forEach(image => {
                        // Add API images to the selectedFiles array
                        const apiImage = {
                            file: { name: image.idImage, preview: image.imageUrl } // Mock a file object for display
                        };
                        $scope.selectedFiles.push(apiImage);
                    });
                }


                console.log("Post data loaded:", $scope.post);
            })
            .catch(function (error) {
                console.error("Error loading post data:", error);
                alert("Không thể tải dữ liệu bài đăng. Vui lòng thử lại.");
            });
    };


    $scope.amenities = {}; // Để ánh xạ tiện ích đến checkbox
    $scope.vehicleTypes = {}; // Để ánh xạ loại xe đến checkbox

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
        console.log("imgpostId: "+postId);
        try {
            const url = `http://localhost:8080/api/images/upload/${postId}`;  // Update URL to match the correct endpoint
            const response = await $http.post(url, formData, {
                headers: { 'Content-Type': undefined, 'Authorization': `Bearer ${token}` }, // Add token in header
                transformRequest: angular.identity
            });
            console.log("Images uploaded:", response.data);
            return response.data; // Return image URLs to update the form
        } catch (error) {
            console.error('Upload ảnh thất bại:', error);
            alert('Có lỗi xảy ra khi tải ảnh lên.');
            return [];
        }
    };


    $scope.submitPost = async function () {
        if ($scope.isLoading || $scope.isSubmitted) return; // Prevent submission if already loading or submitted

        $scope.isLoading = true; // Start loading state
        $scope.isSubmitted = true; // Mark as submitted

        try {
            // Prepare the post data
            const postData = {
                parkingName: $scope.post.parkingName,
                description: $scope.post.description,
                street: $scope.post.street,
                wardName: $scope.selectedWard ? $scope.selectedWard.Name : null,
                districtName: $scope.selectedDistrict ? $scope.selectedDistrict.Name : null,
                provinceName: $scope.selectedProvince ? $scope.selectedProvince.Name : null,
                price: $scope.post.price,
                priceUnit: $scope.post.priceUnit,
                capacity: $scope.post.capacity,
                latitude: $scope.post.latitude,
                longitude: $scope.post.longitude,
                amenities: $scope.tags.map(tag => {
                    return { amenitiesName: tag }; // Format amenities correctly
                }),
                vehicleTypes: $scope.vehicleTags.map(tag => {
                    return { vehicleTypesName: tag }; // Format vehicle types correctly
                }),
            };

            // Send the request to update the post
            const url = `http://localhost:8080/api/updatePosts/${postId}`; // Ensure the endpoint is correct
            const response = await $http.put(url, postData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // if ($scope.selectedFiles.length > 0) {
            //     const imageUrls = await $scope.uploadImages(postId);
            //     if (imageUrls.length > 0) {
            //         console.log('Ảnh đã upload:', imageUrls);
            //     }
            // } else {
            //     console.log('Không có ảnh nào được chọn.');
            // }

            // Notify success and redirect
            alert('Bài đăng đã được cập nhật thành công!');
            console.log('Cập nhật bài đăng thành công:', response.data);
            $location.path('/user/my-post');

        } catch (error) {
            console.error('Lỗi khi cập nhật bài đăng:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            $scope.isLoading = false;
            $scope.isSubmitted = false; // Reset submitted state to allow for resubmission
            $scope.$apply();
        }
    };

    $scope.loadPostData();
});

