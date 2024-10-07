angular.module('parkingApp', [])
.controller('ParkingController', ['$scope', '$http', function($scope, $http) {
    // Tải dữ liệu từ JSON
    $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
    .then(function(response) {
        // Lưu dữ liệu vào $scope
        $scope.provinces = response.data;
    })
    .catch(function(error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    });

    // Xử lý khi chọn Tỉnh/Thành Phố
    $scope.onProvinceChange = function() {
        $scope.selectedDistrict = null; // Reset Quận/Huyện
        $scope.selectedWard = null;     // Reset Phường/Xã
    };

    // Xử lý khi chọn Quận/Huyện
    $scope.onDistrictChange = function() {
        $scope.selectedWard = null;     // Reset Phường/Xã
    };
}]);