var app = angular.module('parkingApp', []);

app.controller('ParkingController', ['$scope', '$http', 'ItemService', 'LocationService', 'PostService', function($scope, $http, ItemService, LocationService, PostService) {
    $scope.posts = [];
    $scope.currentPage = 0; // Bắt đầu từ trang đầu tiên
    $scope.pageSize = 5; // Số lượng post trên mỗi trang
    $scope.totalPagesCount = 0; // Tổng số trang từ API

    // Hàm lấy dữ liệu post từ API với phân trang
    $scope.getPosts = function() {
        // Gọi API từ service
        ItemService.getPosts($scope.currentPage, $scope.pageSize).then(function(response) {
            $scope.posts = response.data.content;
            $scope.totalPagesCount = response.data.totalPages;
            console.log($scope.posts);
        });
    };

    // Chuyển đến trang tiếp theo
    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPagesCount - 1) {
            $scope.currentPage++;
            $scope.getPosts();
        }
    };

    // Quay lại trang trước
    $scope.previousPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.getPosts();
        }
    };

    $scope.districts = [
        { id: 1, name: 'Quận 1', count: 10 },
        { id: 2, name: 'Quận 2', count: 15 },
        { id: 3, name: 'Quận 3', count: 8 },
        // Other districts
    ];

    // Fetch provinces and set default selections
    $scope.getProvinces = function() {
        LocationService.getProvinces().then(function(response) {
            $scope.provinces = response.data;
            
            // Tìm tỉnh thành "Thành phố Hồ Chí Minh"
            $scope.selectedProvince = $scope.provinces.find(province => province.Name === 'Thành phố Hồ Chí Minh');
            
            $scope.selectedWard = null; // Giá trị mặc định
            $scope.selectedDistrict = null; // Giá trị mặc định
        }).catch(function(error) {
            console.error('Error loading data:', error);
        });
    };
    

    // Handle district change
    $scope.onDistrictChange = function() {
        $scope.selectedWard = null; // Reset ward when changing district
    };
    $scope.loadDistrictPostCounts = function() {
        PostService.getPostsCountByDistrict().then(function(response) {
            $scope.districtPostCounts = response.data;
        }).catch(function(error) {
            console.error('Error loading district post counts:', error);
        });
    };
    

    
    // Format time function
    $scope.formatTimeAgo = function(date) {
        let now = new Date();
        let createdAt = new Date(date); // Chuyển đổi chuỗi thành đối tượng Date
        let timeDiff = Math.floor((now - createdAt) / 1000);
        
        if (isNaN(timeDiff)) return "Thời gian không hợp lệ"; // Kiểm tra nếu timeDiff không hợp lệ
        
        if (timeDiff < 60) return timeDiff + " giây trước";
        if (timeDiff < 3600) return Math.floor(timeDiff / 60) + " phút trước";
        if (timeDiff < 86400) return Math.floor(timeDiff / 3600) + " giờ trước";
        return Math.floor(timeDiff / 86400) + " ngày trước";
    };
    

    $scope.getPosts();
    $scope.getProvinces();
    $scope.loadDistrictPostCounts();
    
}]);
