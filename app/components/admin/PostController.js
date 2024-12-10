var app = angular.module('myApp', []);

app.controller('PostController', function ($scope, $http, $window) {
    $scope.posts = [];
    $scope.page = 0;
    $scope.size = 5; // Số lượng bài đăng mỗi trang
    $scope.totalPages = 0;
    $scope.showAddPostModal = false; // Trạng thái modal
    $scope.newPost = {}; // Dữ liệu bài đăng mới
    $scope.currentPost = {}; // Dữ liệu chi tiết bài đăng
    $scope.searchQuery = ""; // Biến tìm kiếm

    // Lấy danh sách bài đăng (trang quản lý bài đăng)
    $scope.loadPosts = function (page) {
        $scope.page = page || $scope.page; // Cập nhật trang hiện tại
        const sortParam = `${$scope.sortField},${$scope.sortDirection}`; // Tham số sắp xếp
        $http.get(`http://localhost:8080/api/posts?page=${$scope.page}&size=${$scope.size}&sort=${sortParam}`)
            .then(function (response) {
                $scope.posts = response.data.content; // Gán dữ liệu vào posts
                $scope.totalPages = response.data.totalPages; // Cập nhật tổng số trang
            }, function (error) {
                console.error("Error fetching posts:", error);
                alert("Không thể tải dữ liệu bài đăng. Vui lòng thử lại!");
            });
    };

    // Lấy thông tin chi tiết bài đăng (trang chi tiết quản lý bài đăng)
    $scope.loadPostDetail = function () {
        const postId = new URLSearchParams($window.location.search).get("id"); // Lấy ID từ query string
        if (!postId) {
            alert("Không tìm thấy bài đăng!");
            return;
        }

        console.log("Post ID:", postId); // Log the postId to check if it's extracted correctly

        $http.get(`http://localhost:8080/api/posts/${postId}`)
            .then(function (response) {
                console.log("Response data:", response.data); // Log the response data to see what we are getting
                $scope.currentPost = response.data; // Gán dữ liệu chi tiết vào currentPost
            }, function (error) {
                console.error("Error fetching post detail:", error);
                alert("Không thể tải chi tiết bài đăng. Vui lòng thử lại!");
            });
    };

    // Thêm bài đăng mới
    $scope.createPost = function () {
        $http.post('http://localhost:8080/api/posts', $scope.newPost)
            .then(function () {
                $scope.loadPosts($scope.page); // Tải lại danh sách bài đăng sau khi thêm
                $scope.showAddPostModal = false; // Đóng modal
                alert("Thêm bài đăng thành công!");
            }, function (error) {
                console.error("Error creating post:", error);
                alert("Không thể thêm bài đăng. Vui lòng kiểm tra thông tin!");
            });
    };

    $scope.goBackToPreviousPage = function () {
        $window.history.back(); // Quay lại trang trước đó

        // Reload lại trang sau khi quay về (nếu cần)
        setTimeout(() => {
            $window.location.reload();
        }, 100); // Đảm bảo reload sau khi điều hướng
    };


    // Xem chi tiết bài đăng
    $scope.viewDetails = function (post) {
        $window.location.href = `Admin - Chi tiết quản lý bài đăng.html?id=${post.idPost}`;
    };

    // Xóa bài đăng
    $scope.deletePost = function (post) {
        const confirmDelete = confirm("Bạn có chắc muốn xóa bài đăng này?");
        if (confirmDelete) {
            $http.delete(`http://localhost:8080/api/posts/${post.idPost}`)
                .then(function () {
                    $scope.loadPosts($scope.page); // Tải lại danh sách bài đăng sau khi xóa
                    alert("Bài đăng đã được xóa!");
                }, function (error) {
                    console.error("Error deleting post:", error);
                    alert("Không thể xóa bài đăng.");
                });
        }
    };

    // Tìm kiếm bài đăng
    $scope.searchPosts = function () {
        if ($scope.searchQuery.trim() === "") {
            alert("Vui lòng nhập từ khóa để tìm kiếm!");
            return;
        }

        $http.get(`http://localhost:8080/api/posts/search?query=${$scope.searchQuery}&page=${$scope.page}&size=${$scope.size}`)
            .then(function (response) {
                $scope.posts = response.data.content;
                $scope.totalPages = response.data.totalPages;
            }, function (error) {
                console.error("Error searching posts:", error);
                alert("Không tìm thấy bài đăng phù hợp!");
            });
    };

    $scope.updateDetailPost = function () {
        if (!$scope.currentPost.idPost) {
            alert("Không thể cập nhật bài đăng: ID không hợp lệ.");
            return;
        }

        $http.put(`http://localhost:8080/api/posts/${$scope.currentPost.idPost}`, $scope.currentPost)
            .then(function () {
                alert("Bài đăng đã được cập nhật thành công!");
                setTimeout(() => {
                    $window.location.reload();
                }, 100);
            })
            .catch(function (error) {
                console.error("Lỗi cập nhật bài đăng:", error);
                alert("Không thể cập nhật bài đăng.");
            });
    };

    $scope.deleteDetailPost = function () {
        if (!$scope.currentPost.idPost) {
            alert("Không thể xóa bài đăng: ID không hợp lệ.");
            return;
        }

        const confirmDelete = confirm("Bạn có chắc muốn xóa bài đăng này?");
        if (confirmDelete) {
            $http.delete(`http://localhost:8080/api/posts/${$scope.currentPost.idPost}`)
                .then(function () {
                    alert("Bài đăng đã được xóa thành công!");
                    setTimeout(() => {
                        $window.location.reload();
                    }, 100);
                    $scope.currentPost = {}; // Reset dữ liệu bài đăng
                })
                .catch(function (error) {
                    console.error("Lỗi xóa bài đăng:", error);
                    alert("Không thể xóa bài đăng.");
                });
        }
    };
    // Thêm các biến
    $scope.sortField = 'idPost'; // Trường mặc định để sắp xếp
    $scope.sortDirection = 'asc'; // Hướng sắp xếp mặc định

    // Hàm để sắp xếp
    $scope.sortPosts = function (field) {
        if ($scope.sortField === field) {
            // Đổi hướng sắp xếp nếu cùng một cột được chọn
            $scope.sortDirection = $scope.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Đặt cột mới và hướng mặc định
            $scope.sortField = field;
            $scope.sortDirection = 'asc';
        }
        $scope.loadPosts(); // Tải lại danh sách bài đăng với sắp xếp mới
    };

    // Hàm để cập nhật icon
    $scope.getSortIcon = function (field) {
        if ($scope.sortField === field) {
            return $scope.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
        }
        return 'fa-sort';
    };


    // Khởi động trang quản lý bài đăng
    $scope.loadPosts(0); // Tải trang đầu tiên khi không phải trang chi tiết

    // Kiểm tra và tải chi tiết nếu là trang chi tiết
    const postId = new URLSearchParams($window.location.search).get("id");
    if (postId) {
        $scope.loadPostDetail(); // Tải dữ liệu chi tiết nếu có ID bài đăng
    }
});
