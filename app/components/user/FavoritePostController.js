app.controller('FavoritesController', ['$scope', '$window', 'FavoritesService', function ($scope, $window, FavoritesService) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    $scope.favorites = [];
    $scope.loading = true;
    $scope.id_post = "";

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

    // Fetch favorites
    $scope.getFavorites = function () {
        FavoritesService.getFavoritesByUserId(userId)
            .then(function (response) {
                $scope.favorites = response.data.data;
                console.log(response.data.data.favoriteId);
                $scope.loading = false;
            }, function (error) {
                if (error.status === 401) {
                    $window.location.href = '/app/components/Login/LoginAndRegister.html';
                } else {
                    $scope.loading = false;
                    console.error('Error fetching favorites:', error);
                }
            });
    };

    // Function to format amount as Vietnamese currency
    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return "0 VND";
    };


    // Show confirmation modal and set the post to unfavorite
    $scope.confirmUnfavorite = function (favorite) {
        // Set the favorite post and user for the confirmation
        $scope.favoriteToUnfavorite = favorite;
        $('#confirmationModal').modal('show'); // Show the modal
    };

    // Perform the unfavorite action after user confirms
    $scope.toggleFavorite = function () {
        const postId = $scope.postToUnfavorite.postId;

        // Gọi API để hủy lưu bài đăng
        FavoritesService.toggleFavorite(userId, postId)
            .then(function (response) {
                $scope.isFavorite = response.data.data.isFavorite;

                // Show the toast after favorites are loaded
                const actionMessage = $scope.isFavorite ? 'Đã lưu bài đăng' : 'Đã hủy lưu bài đăng';
                $scope.showToast(actionMessage);
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

    // Fetch favorites on page load
    $scope.getFavorites();
}]);
