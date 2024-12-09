// PostController.js
angular.module('postApp')
    .controller('PostController', ['$scope', 'postService', function($scope, postService) {
        
        $scope.post = {
            title: '',
            description: '',
            facilities: {
                camera: false,
                lock: false,
                charging: false,
                security247: false,
                roof: false,
                security2424: false,
                carwash: false
            },
            otherFacilities: ''
        };

        // Hàm lưu bài đăng
        $scope.savePost = function() {
            // Kiểm tra xem tất cả các trường có hợp lệ không
            if ($scope.post.title && $scope.post.description) {
                postService.createPost($scope.post).then(function(response) {
                    alert('Bài đăng đã được lưu thành công!');
                    // Reset form nếu cần
                    $scope.post = {
                        title: '',
                        description: '',
                        facilities: {
                            camera: false,
                            lock: false,
                            charging: false,
                            security247: false,
                            roof: false,
                            security2424: false,
                            carwash: false
                        },
                        otherFacilities: ''
                    };
                }).catch(function(error) {
                    alert('Có lỗi xảy ra khi lưu bài đăng.');
                    console.error(error);
                });
            } else {
                alert('Vui lòng điền đầy đủ thông tin tiêu đề và mô tả!');
            }
        };

    }]);
