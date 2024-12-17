let app = angular.module('myApp', []);
app.controller('ApprovalPostController', function($scope, $http) {

    // Khởi tạo các biến
    $scope.approvalPosts = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.totalPages = 0;
    $scope.userId = localStorage.getItem("userId"); // Giả sử đây là ID của admin hoặc người thực hiện

    // Lấy tất cả bài viết với phân trang
    $scope.getAllApprovalPosts = function(page, size) {
        $http.get('https://doantotnghiepbe-production.up.railway.app/api/approval-posts', { params: { page: page, size: size } })
            .then(function(response) {
                // Lặp qua từng bài viết và chuyển đổi reviewedAt
                $scope.approvalPosts = response.data.content.map(function(post) {
                    // Chuyển đổi reviewedAt thành định dạng hợp lệ
                    post.reviewedAtFormatted = post.reviewedAt ? new Date(post.reviewedAt).toLocaleString('en-GB') : 'N/A';
                    return post;
                });
                console.log($scope.approvalPosts);
                $scope.totalPages = response.data.totalPages;
                $scope.currentPage = response.data.number;
            })
            .catch(function(error) {
                console.error("Lỗi khi lấy danh sách bài viết:", error);
            });
    };
    

    // Duyệt bài viết
    $scope.approvePost = function(postId, userId) {
        $http.post(`https://doantotnghiepbe-production.up.railway.app/api/approval-posts/approve/${postId}`, null, { params: { userId: userId } })
            .then(function(response) {
                alert("Bài viết đã được duyệt!");
                $scope.getAllApprovalPosts($scope.currentPage, $scope.pageSize); // Refresh danh sách
            })
            .catch(function(error) {
                console.error("Lỗi khi duyệt bài viết:", error);
            });
    };

    // Từ chối bài viết
    $scope.rejectPost = function(postId, rejectionReason, userId) {
        rejectionReason = prompt("Nhập lý do từ chối:");
        if (rejectionReason) {
            $http.post(`https://doantotnghiepbe-production.up.railway.app/api/approval-posts/reject/${postId}`, null, { 
                params: { rejectionReason: rejectionReason, userId: userId } 
            })
            .then(function(response) {
                alert("Bài viết đã bị từ chối!");
                $scope.getAllApprovalPosts($scope.currentPage, $scope.pageSize); // Refresh danh sách
            })
            .catch(function(error) {
                console.error("Lỗi khi từ chối bài viết:", error);
            });
        }
    };

    // Hàm xem chi tiết bài viết
    $scope.viewDetails = function(item) {
        alert(`Chi tiết bài viết:\nID: ${item.approvalPostId}\nTrạng thái: ${item.status}\nLý do: ${item.rejectionReason || 'N/A'}`);
    };

    // Hàm chuyển trang
    $scope.changePage = function(newPage) {
        if (newPage >= 0 && newPage < $scope.totalPages) {
            $scope.getAllApprovalPosts(newPage, $scope.pageSize);
        }
    };

    // Khởi chạy lần đầu
    $scope.getAllApprovalPosts($scope.currentPage, $scope.pageSize);
});
