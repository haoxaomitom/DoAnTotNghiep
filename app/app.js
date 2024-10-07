var app = angular.module('parkingApp', []);

app.controller('ParkingController', ['$scope', '$http', function($scope, $http) {
    $scope.posts = [];
    $scope.districts = [
        { id: 1, name: 'Quận 1', count: 10 },
        { id: 2, name: 'Quận 2', count: 15 },
        { id: 3, name: 'Quận 3', count: 8 },
        // Các quận khác
    ];
    $scope.selectedDistrict = '';
    $scope.selectedType = '';
    $scope.sortPrice = '';
    $scope.searchText = '';
    $scope.loading = false;

    // Hàm gọi API để lấy danh sách bài đăng
    $scope.getPosts = function() {
        $scope.loading = true;

        // Gọi API để lấy danh sách bài đăng mà không truyền tham số
        $http.get('http://localhost:8080/api/posts')
            .then(function(response) {
                $scope.posts = response.data;
            })
            .finally(function() {
                $scope.loading = false;
            });
    };

    // Hàm để tính thời gian trôi qua
    $scope.formatTimeAgo = function(dateString) {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInSeconds = Math.floor((now - postDate) / 1000); // Sự khác biệt tính bằng giây

        if (diffInSeconds < 60) {
            return `${diffInSeconds} giây trước`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ trước`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày trước`;
        }
    };
    
    // Lấy danh sách bài đăng khi tải trang
    $scope.getPosts();
}]);
