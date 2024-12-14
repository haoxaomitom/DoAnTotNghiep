app.controller('FavoritesController', ['$scope', '$window', 'FavoritesService', function ($scope, $window, FavoritesService) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    $scope.page = 0; // Trang bắt đầu
    $scope.size = 5; // Số lượng mục trên mỗi trang
    $scope.posts = []; // Danh sách yêu thích
    $scope.totalPages = 0; // Tổng số trang
    $scope.loading = false;
    $scope.id_post = "";
    $scope.hasMoreData = true; // Kiểm tra còn dữ liệu hay không
    $scope.isEmpty = false; // Ban đầu không rỗng

    function isTokenExpired(token) {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        return expirationTime < Date.now();
    }

    if (!token || isTokenExpired(token)) {
        localStorage.setItem('redirectUrl', $window.location.href);
        $window.location.href = '/app/components/Login/LoginAndRegister.html';
        return;
    }

    // Hàm tải thêm dữ liệu


    $scope.loadMoreFavorites = function () {
        if ($scope.loading || !$scope.hasMoreData) return;

        $scope.loading = true;
        FavoritesService.getFavoritesByUserId(userId, $scope.page, $scope.size)
            .then(function (response) {
                const data = response.data.content;
                if ($scope.page === 0 && data.length === 0) {
                    // Nếu trang đầu tiên mà không có dữ liệu
                    $scope.isEmpty = true;
                    $scope.hasMoreData = false;
                } else {
                    $scope.posts = $scope.posts.concat(data);
                    $scope.page++;
                    $scope.hasMoreData = $scope.page < response.data.totalPages;
                }
                $scope.loading = false;
            }, function (error) {
                $scope.loading = false;
                if (error.status === 401) {
                    $window.location.href = '/app/components/Login/LoginAndRegister.html';
                } else {
                    console.error('Error fetching favorites:', error);
                }
            });
    };


    // Sự kiện khi cuộn xuống cuối trang
    $scope.onScroll = function () {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        if (scrollTop + clientHeight >= scrollHeight - 10) { // Gần cuối trang
            $scope.loadMoreFavorites();
        }
    };

    // Lắng nghe sự kiện cuộn
    window.addEventListener('scroll', $scope.onScroll);

    // Function to format amount as Vietnamese currency
    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return "0 VND";
    };


    // Show confirmation modal and set the post to unfavorite
    $scope.confirmUnfavorite = function (post) {
        console.log(post); // Kiểm tra dữ liệu

        $scope.postToUnfavorite = post;
        $('#confirmationModal').modal('show');
    };

    // Perform the unfavorite action after user confirms
    $scope.toggleFavorite = function () {
        const postId = $scope.postToUnfavorite.postId;

        // Gọi API để hủy lưu bài đăng
        FavoritesService.toggleFavorite(userId, postId)
            .then(function (response) {
                const actionMessage = 'Đã hủy lưu bài đăng';
                $scope.showToast(actionMessage);

                // Ẩn modal xác nhận
                $('#confirmationModal').modal('hide');

                // Loại bỏ bài đăng khỏi danh sách $scope.posts
                $scope.posts = $scope.posts.filter(post => post.postId !== postId);

                // Nếu danh sách rỗng, đánh dấu là không còn dữ liệu
                if ($scope.posts.length === 0) {
                    $scope.isEmpty = true;
                    $scope.hasMoreData = false;
                }
            })
            .catch(function (error) {
                console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
                $scope.showToast('Lỗi khi thay đổi trạng thái yêu thích');
            });
    };

    // Show success toast
    $scope.showToast = function (message) {
        $scope.toastMessage = message;
        const toastElement = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    };

    $scope.loadMoreFavorites();
}]);
