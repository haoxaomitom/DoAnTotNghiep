app.controller('PostsController', ['$scope', '$window', 'PostsService', function ($scope, $window, PostsService) {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.setItem('redirectUrl', $window.location.href);
        $window.location.href = '/app/components/Login/LoginAndRegister.html';
        return; // Ngừng thực thi phần còn lại của controller
    }

    $scope.posts = []; // Tất cả bài đăng
    $scope.activePosts = []; // Bài đăng đang hoạt động
    $scope.pendingPosts = []; // Bài đăng chờ duyệt
    $scope.cancelledPosts = []; // Bài đăng bị hủy
    $scope.loading = true;

    const userId = localStorage.getItem('userId');
    let postIdToDelete = null; // Biến lưu trữ postId cần xóa
    let postIdToDelete = null; // Biến lưu trữ postId cần xóa

    // Hàm để lấy dữ liệu bài viết
    $scope.getPosts = function () {
        PostsService.getPostsByUserId(userId, token)
            .then(function (response) {
                $scope.posts = response.data;

                // Phân loại bài đăng dựa trên trạng thái
                $scope.activePosts = $scope.posts.filter(post => post.status === 'ACTIVE');
                $scope.pendingPosts = $scope.posts.filter(post => post.status === 'WAITING');
                $scope.cancelledPosts = $scope.posts.filter(post => post.status === 'REJECT');

                $scope.loading = false;
            })
            .catch(function (error) {
                $scope.loading = false;
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

    // Hàm định dạng tiền tệ
    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return "0 VND";
    };

    // Mở modal xác nhận xóa
    $scope.openDeleteModal = function (postId) {
        postIdToDelete = postId; // Lưu postId cần xóa vào biến
        $('#deleteModal').modal('show'); // Mở modal bằng Bootstrap
    };

    // Xác nhận xóa bài đăng
    $scope.confirmDelete = function () {
        PostsService.deletePost(postIdToDelete, token)
            .then(function (response) {
                $('#deleteModal').modal('hide'); // Đóng modal
                alert("Bài đăng đã được xóa thành công!");
                $scope.getPosts(); // Làm mới danh sách bài viết
            })
            .catch(function (error) {
                console.error('Error deleting post:', error);
                alert("Có lỗi xảy ra khi xóa bài đăng!");
            });
    };

    // Hàm định dạng tiền tệ
    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return "0 VND";
    };

    // Mở modal xác nhận xóa
    $scope.openDeleteModal = function (postId) {
        postIdToDelete = postId; // Lưu postId cần xóa vào biến
        $('#deleteModal').modal('show'); // Mở modal bằng Bootstrap
    };

    // Xác nhận xóa bài đăng
    $scope.confirmDelete = function () {
        PostsService.deletePost(postIdToDelete, token)
            .then(function (response) {
                $('#deleteModal').modal('hide'); // Đóng modal
                alert("Bài đăng đã được xóa thành công!");
                $scope.getPosts(); // Làm mới danh sách bài viết
            })
            .catch(function (error) {
                console.error('Error deleting post:', error);
                alert("Có lỗi xảy ra khi xóa bài đăng!");
            });
    };

    // Gọi hàm để lấy dữ liệu bài viết khi controller được khởi tạo
    $scope.getPosts();
}]);

