var app = angular.module('app', []);

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
    // const baseUrl = 'http://localhost:8080/api/images';

    // Upload ảnh
    this.uploadImages = function (images, postId) {
        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`file`, image); // Dùng file key để gửi
        });
        formData.append('postId', postId);

        return $http.post(`http://localhost:8080/api/images/upload`, formData, {
            headers: { 'Content-Type': undefined }
        });
    };

}]);

