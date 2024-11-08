app.controller('FavoritesController', ['$scope', '$window', 'FavoritesService', function ($scope, $window, FavoritesService) {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    // Hàm kiểm tra thời gian hết hạn của token
    function isTokenExpired(token) {
        if (!token) return true;

        const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã payload của JWT token
        const expirationTime = payload.exp * 1000; // Convert thành thời gian tính bằng milisecond
        return expirationTime < Date.now(); // Kiểm tra xem token có hết hạn không
    }

    // Kiểm tra token trước khi thực hiện các yêu cầu API
    if (!token || isTokenExpired(token)) {
        localStorage.setItem('redirectUrl', $window.location.href);
        $window.location.href = '/app/components/Login/LoginAndRegister.html';
        return; // Ngừng thực thi phần còn lại của controller
    }

    const userId = localStorage.getItem('userId');
    $scope.favorites = [];
    $scope.loading = true;

    // Function to get favorite data
    $scope.getFavorites = function () {
        FavoritesService.getFavoritesByUserId(userId, token)
            .then(function (response) {
                console.log("API Response:", response.data);
                $scope.favorites = response.data.data;
                $scope.loading = false;
            }, function (error) {
                if (error.status === 401) {
                    // Nếu lỗi là 401 (Unauthorized), token có thể đã hết hạn
                    $window.location.href = '/app/components/Login/LoginAndRegister.html';
                } else {
                    $scope.loading = false;
                    console.error('Error fetching favorites:', error);
                }
            });
    };

    // Format time function 
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

    // Call the function to fetch favorites when the controller is initialized
    $scope.getFavorites();
}]);