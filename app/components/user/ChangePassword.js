app.controller("ChangePasswordController", function ($scope, $http) {
    $scope.oldPasswordFieldType = 'password';
    $scope.newPasswordFieldType = 'password';
    $scope.confirmPasswordFieldType = 'password';

    $scope.oldPassword = "";
    $scope.newPassword = "";
    $scope.confirm = "";

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Toggle visibility of password fields
    $scope.togglePasswordVisibility = function (field) {
        if (field === 'oldPassword') {
            $scope.oldPasswordFieldType = $scope.oldPasswordFieldType === 'password' ? 'text' : 'password';
        } else if (field === 'newPassword') {
            $scope.newPasswordFieldType = $scope.newPasswordFieldType === 'password' ? 'text' : 'password';
        } else if (field === 'confirm') {
            $scope.confirmPasswordFieldType = $scope.confirmPasswordFieldType === 'password' ? 'text' : 'password';
        }
    };

    // Validation logic
    $scope.validateForm = function () {
        $scope.message = "";
        if (!$scope.newPassword || !$scope.oldPassword || !$scope.confirm) {
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

    $scope.changePassword = function () {
        // Check form validity
        if (!$scope.validateForm()) {
            return;
        }

        const data = {
            oldPassword: $scope.oldPassword,
            newPassword: $scope.newPassword,
            confirm: $scope.confirm
        };

        $http.put(`https://doantotnghiepbe-production.up.railway.app/api/users/${userId}/changePassword`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (response.data.status) {
                alert(response.data.message);
                $scope.message = "";
            } else {
                $scope.message = response.data.message;
            }
        }).catch((err) => {
            console.error(err);
            $scope.message = "Có lỗi xảy ra. Vui lòng thử lại.";
        });
    };
});
