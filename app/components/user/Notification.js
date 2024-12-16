let app = angular.module("app", [])
app.controller("NotificationController", function ($scope, $http) {

    const token = localStorage.getItem("token");
    const data = {
        title: '',
        content: ''
    }
    $scope.create = function () {
        data = {
            title: $scope.title,
            content: $scope.content
        }
        $http.post(`http://localhost:8080/api/notifications/createNotificationGlobal`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.data) {
                    $scope.showToast("Gửi thông báo thành công!");
                } else {
                    $scope.showToast("Có lỗi xãy ra. Gửi thông báo thất bại!");
                }
            }).catch((err) => {

            });
    }
    // Show success toast
    $scope.showToast = function (message) {
        $scope.toastMessage = message;
        const toastElement = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    };
})