var app = angular.module('myApp', []);

app.controller('ApprovalController', function ($scope, $http) {
    const apiUrl = "http://localhost:8080/api/approval-posts";

    $scope.items = [];
    $scope.sortField = 'id';
    $scope.reverseSort = false;
    $scope.searchField = 'status';
    $scope.searchText = '';

    // Load data từ backend
    $scope.loadItems = function () {
        $http.get(apiUrl).then(function (response) {
            $scope.items = response.data.map(item => {
                try {
                    // Parse rejectionReason nếu là JSON hợp lệ
                    item.rejectionReason = item.rejectionReason ? JSON.parse(item.rejectionReason).reason : 'N/A';
                } catch (e) {
                    console.error("Error parsing rejectionReason:", e);
                    item.rejectionReason = 'Invalid format';
                }

                // Nếu status là "Waiting", xóa thông tin "reviewedBy"
                if (item.status === 'Waiting') {
                    item.reviewedByUsername = '';
                    item.reviewedAt = '';
                }

                return item;
            });
        }, function (error) {
            console.error("Error loading data:", error);
            $scope.items = []; // Xóa dữ liệu nếu lỗi xảy ra
        });
    };

    // Approve bài đăng
    $scope.approve = function (item) {
        $http.put(`${apiUrl}/approve/${item.approvalPostId}`)
            .then(function () {
                alert('Bài đăng đã được duyệt!');
                $scope.loadItems(); // Tải lại danh sách bài viết
            })
            .catch(function (error) {
                console.error("Error approving post:", error);
                alert('Không thể duyệt bài đăng. Vui lòng thử lại.');
            });
    };
    

    // Reject bài đăng
    $scope.reject = function (item) {
        const reason = "Thông tin không hợp lệ"; // Lý do từ chối
        const username = "admin"; // Tên người dùng hiện tại
    
        $http.put(`${apiUrl}/reject/${item.approvalPostId}`, 
            { reason: reason, username: username }, 
            { headers: { "Content-Type": "application/json" } }
        )
        .then(function () {
            alert('Bài đăng đã bị từ chối!');
            $scope.loadItems(); // Tải lại danh sách
        })
        .catch(function (error) {
            console.error("Error rejecting post:", error);
            alert(`Không thể từ chối bài đăng. Lỗi: ${error.status} - ${error.data?.message || 'Chi tiết không xác định'}`);
        });
    };
    
    
    
    
    
        

    // Thiết lập trường sắp xếp
    $scope.setSortField = function (field) {
        if ($scope.sortField === field) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortField = field;
            $scope.reverseSort = false;
        }
    };

    // Xem chi tiết bài đăng
    $scope.viewDetails = function (item) {
        window.location.href = `Admin - Chi tiết quản lý bài đăng.html?id=${item.approvalPostId}`;
    };

    // Perform tìm kiếm
    $scope.search = function () {
        if (!$scope.searchText) {
            alert('Vui lòng nhập từ khóa để tìm kiếm.');
        }
    };

    // Khởi tạo dữ liệu
    $scope.loadItems();
});
