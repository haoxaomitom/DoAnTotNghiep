let app = angular.module("app", []);
app.controller("ForgotPasswordController", function ($scope, $http) {
    $scope.oldPasswordFieldType = 'password';
    $scope.newPasswordFieldType = 'password';
    $scope.confirmPasswordFieldType = 'password';

    $scope.oldPassword = "";
    $scope.newPassword = "";
    $scope.confirm = "";

    // Toggle visibility of password fields
    $scope.togglePasswordVisibility = function (field) {
        if (field === 'newPassword') {
            $scope.newPasswordFieldType = $scope.newPasswordFieldType === 'password' ? 'text' : 'password';
        } else if (field === 'confirm') {
            $scope.confirmPasswordFieldType = $scope.confirmPasswordFieldType === 'password' ? 'text' : 'password';
        }
    };

    // Validation logic
    $scope.validateForm = function () {
        $scope.message = "";
        if (!$scope.newPassword || !$scope.confirm) {
            $scope.message = "Vui lòng điền đầy đủ các trường.";
            return false;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test($scope.newPassword)) {
            $scope.message = "Mật khẩu mới phải ít nhất 6 ký tự, bao gồm cả chữ và số.";
            return false;
        }
        if ($scope.newPassword !== $scope.confirm) {
            $scope.message = "Mật khẩu nhập lại không khớp.";
            return false;
        }
        return true;
    };

    $scope.resetPassword = function () {
        // Check form validity
        if (!$scope.validateForm()) {
            return;
        }

        // Lấy token từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            $scope.message = "Không tìm thấy token. Vui lòng kiểm tra lại.";
            return;
        }

        // Payload gửi đến API
        const payload = {
            token: token,
            newPassword: $scope.newPassword
        };

        // Gửi yêu cầu đến API
        $http.post(`https://doantotnghiepbe-production.up.railway.app/api/users/reset-password?token=${payload.token}&newPassword=${payload.newPassword}`)
            .then(function (response) {
                if (response.data.message) {
                    $scope.showToast("Đổi mật khẩu nhành công!");
                } else {
                    $scope.showToast("Có lỗi xãy ra. Vui lòng thử lại!");
                }

            })
            .catch(function (error) {
                // Xử lý lỗi
                console.error(error);
                $scope.message = error.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
            });
    };
    $scope.showToast = function (message) {
        $scope.toastMessage = message;
        const toastElement = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    };


});
