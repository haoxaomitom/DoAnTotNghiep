var app = angular.module('app', []);

app.controller('ImagesController', ['$scope', 'ImagesService', function ($scope, ImagesService) {
    $scope.post = {
        postId: 1, // Giả sử postId là 1, có thể thay đổi theo thực tế
        images: []
    };

    // Hàm xử lý chọn ảnh từ người dùng
    $scope.onFileSelect = function (files) {
        if (files && files.length) {
            $scope.post.images = files; // Gán mảng ảnh đã chọn
        }
    };

    // Hàm gửi dữ liệu ảnh lên server
    $scope.submitPost = function () {
        ImagesService.uploadImages($scope.post)
            .then(function (response) {
                alert("Đăng tin thành công!");
            })
            .catch(function (error) {
                alert("Có lỗi xảy ra!");
            });
    };
}]);

app.service('ImagesService', ['$http', function ($http) {
    var service = {};

    // Hàm upload ảnh lên server
    service.uploadImages = function (post) {
        var formData = new FormData();
        // Thêm các dữ liệu cần thiết vào formData
        formData.append("postId", post.postId);

        // Thêm tất cả các hình ảnh vào formData
        angular.forEach(post.images, function (image) {
            formData.append("files", image);  // Thay 'images' thành 'files' để khớp với backend
        });

        // Gửi formData qua API
        return $http.post('http://localhost:8080/api/images/uploadData', formData, {
            headers: {
                'Content-Type': undefined // Để Angular tự động xử lý multipart
            }
        });
    };

    return service;
}]);