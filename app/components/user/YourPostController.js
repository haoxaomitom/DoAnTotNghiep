app.controller('PostsController', ['$scope', '$window', 'PostsService', function ($scope, $window, PostsService) {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.setItem('redirectUrl', $window.location.href);
        $window.location.href = '/app/components/Login/LoginAndRegister.html';
        return; // Ngừng thực thi phần còn lại của controller
    }

    $scope.posts = []; // Định nghĩa posts
    $scope.loading = true;
    const userId = localStorage.getItem('userId');

    // Hàm để lấy dữ liệu bài viết
    $scope.getPosts = function () {
        PostsService.getPostsByUserId(userId, token) // Gửi token vào service
            .then(function (response) {
                // Giả sử response.data là mảng các bài viết
                $scope.posts = response.data; // Lưu trữ dữ liệu bài viết
                $scope.loading = false; // Set loading thành false khi dữ liệu đã được lấy
            }, function (error) {
                $scope.loading = false; // Set loading thành false khi có lỗi
                console.error('Error fetching posts:', error);
            });
    };

    // Hàm định dạng thời gian
    $scope.formatTimeAgo = function (date) {
        let now = new Date();
        let createdAt = new Date(date);
        let timeDiff = Math.floor((now - createdAt) / 1000);

        if (isNaN(timeDiff)) return "Invalid time";

        if (timeDiff < 60) return timeDiff + " giây trước";
        if (timeDiff < 3600) return Math.floor(timeDiff / 60) + " phút trước";
        if (timeDiff < 86400) return Math.floor(timeDiff / 3600) + " giờ trước";
        return Math.floor(timeDiff / 86400) + " ngày trước";
    };

    // Gọi hàm để lấy dữ liệu bài viết khi controller được khởi tạo
    $scope.getPosts();
}]);