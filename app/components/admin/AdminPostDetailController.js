app.controller('PostController', ['$scope', 'PostDetailService', '$location', function($scope, PostDetailService, $location) {
    $scope.currentPost = {}; // Biến lưu thông tin bài đăng

    // Lấy ID từ URL (hoặc từ nguồn khác)
    const urlParams = new URLSearchParams($location.absUrl());
    const postId = urlParams.get('id'); // Giả sử bạn truy cập URL như http://localhost:4200/admin/postDetail?id=123
    const idPost = 1;
    // Hàm lấy dữ liệu bài đăng
    $scope.loadPost = function() {
        if (idPost) {
            PostDetailService.getPostById(idPost)
                .then(function(response) {
                    $scope.currentPost = response.data; // Gán dữ liệu vào currentPost
                    console.log(response.data)
                })
                .catch(function(error) {
                    console.error('Error loading post:', error);
                    alert('Không thể tải dữ liệu bài đăng. Vui lòng thử lại sau.');
                });
        } else {
            alert('Không tìm thấy ID bài đăng.');
        }
    };

    // Gọi hàm loadPost khi controller được khởi chạy
    $scope.loadPost();
}]);
