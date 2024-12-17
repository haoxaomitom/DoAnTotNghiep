app.controller('userPaymentController', function ($scope, $http) {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    // Cấu hình headers mặc định cho tất cả các request
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`, // Định dạng "Bearer <token>"
            'Content-Type': 'application/json'
        }
    };

    // Gọi API lấy danh sách thanh toán
    $http.get('https://doantotnghiepbe-production.up.railway.app/admin/payments/all', config).then(function (response) {
        $scope.payments = response.data;
        $scope.sortCriteria = 'paymentDate';
    }).catch(function (error) {
        console.error('Lỗi khi lấy danh sách thanh toán:', error);
    });

    // Xem chi tiết thanh toán
    $scope.viewPayment = function (paymentId) {
        $http.get(`https://doantotnghiepbe-production.up.railway.app/admin/payments/${paymentId}`, config).then(function (response) {
            $scope.selectedPayment = response.data;
            $('#paymentModal').modal('show');
        }).catch(function (error) {
            console.error('Lỗi khi xem chi tiết thanh toán:', error);
        });
    };

    // Hàm sắp xếp thanh toán (nếu cần mở rộng)
    $scope.sortPayments = function () {};
});
