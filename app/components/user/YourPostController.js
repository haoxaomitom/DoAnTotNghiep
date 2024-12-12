app.controller('PostsController', ['$scope', '$window', 'PostsService', function ($scope, $window, PostsService) {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

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

    let postIdToDelete = null; // Biến lưu trữ postId cần xóa

    // Hàm để lấy dữ liệu bài viết
    // $scope.getPosts = function () {
    //     if ($scope.loading || !$scope.hasMoreData) return;

    //     $scope.loading = true;

    //     PostsService.getPostsByUserId(userId)
    //         .then(function (response) {
    //             const data = response.data;
    //             console.log(response.data);
    //             // Gộp dữ liệu mới vào danh sách bài đăng
    //             $scope.posts = $scope.posts.concat(data.content);

    //             // Phân loại bài đăng dựa trên trạng thái
    //             $scope.activePosts = $scope.posts.filter(post => post.status === 'ACTIVE');
    //             $scope.pendingPosts = $scope.posts.filter(post => post.status === 'WAITING');
    //             $scope.cancelledPosts = $scope.posts.filter(post => post.status === 'REJECT');

    //             // Kiểm tra xem còn dữ liệu để tải không
    //             // $scope.hasMoreData = $scope.page < data.totalPages - 1;
    //             $scope.page++; // Tăng chỉ số trang
    //             $scope.loading = false;
    //         })
    //         .catch(function (error) {
    //             $scope.loading = false;
    //             console.error('Error fetching posts:', error);
    //         });
    // };

    $scope.getPosts = function (status) {
        $scope.loading = true;

        PostsService.getPostsByStatus(userId, status, $scope.page, $scope.size)
            .then(function (response) {
                const data = response.data;

                // Thêm từng bài viết mới vào cuối mảng bài viết cũ
                data.content.forEach(post => {
                    $scope.posts.push(post); // Thêm vào danh sách chung
                    // Phân loại bài viết theo trạng thái
                    if (post.status === 'ACTIVE') {
                        $scope.activePosts.push(post);
                    } else if (post.status === 'WAITING') {
                        $scope.pendingPosts.push(post);
                    } else if (post.status === 'REJECT') {
                        $scope.cancelledPosts.push(post);
                    }
                });

                // Kiểm tra còn dữ liệu không
                $scope.hasMoreData = $scope.page < data.totalPages - 1;
                $scope.page++;

                $scope.loading = false;
            })
            .catch(function (error) {
                $scope.loading = false;
                console.error('Error fetching posts by status:', error);
            });
    };



    $scope.selectTab = function (status) {
        // Reset về trang đầu tiên và các mảng dữ liệu
        $scope.page = 0; // Reset trang
        $scope.posts = []; // Reset danh sách bài viết
        $scope.activePosts = []; // Reset bài viết đang hoạt động
        $scope.pendingPosts = []; // Reset bài viết chờ duyệt
        $scope.cancelledPosts = []; // Reset bài viết bị hủy
        $scope.selectedStatus = status; // Lưu trạng thái đã chọn

        $scope.getPosts(status); // Gọi API lấy bài viết theo trạng thái
    };



    angular.element(window).on('scroll', function () {
        if ($scope.loading || !$scope.hasMoreData) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const offsetHeight = document.documentElement.offsetHeight;
        const innerHeight = window.innerHeight;

        // Kiểm tra nếu cuộn gần cuối trang
        if (scrollTop + innerHeight >= offsetHeight - 50) {
            $scope.getPosts($scope.selectedStatus);
        }
    });


    // Hàm tính số ngày bài đăng còn lại
    $scope.calculateRemainingDays = function (topPostEnd) {
        if (!topPostEnd) return null; // Nếu không có giá trị, trả về null

        const now = new Date(); // Lấy thời gian hiện tại
        const endDate = new Date(topPostEnd); // Chuyển đổi `topPostEnd` sang đối tượng Date

        const timeDiff = endDate - now; // Tính hiệu thời gian (milliseconds)

        if (timeDiff <= 0) return null; // Nếu đã hết hạn, trả về null

        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Chuyển đổi milliseconds sang ngày
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

    // Gọi hàm để lấy dữ liệu bài viết khi controller được khởi tạo
    $scope.getPosts();

}]);
