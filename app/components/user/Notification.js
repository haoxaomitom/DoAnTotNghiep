let app = angular.module("app", [])
app.controller("NotificationController", function ($scope, $http) {

    const token = localStorage.getItem("token");
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.goToFirstPage = function () {
        $scope.currentPage = 1;
        $scope.loadUsers();
    };

    $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.loadUsers();
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
            $scope.loadUsers();
        }
    };

    $scope.goToLastPage = function () {
        $scope.currentPage = $scope.totalPages;
        $scope.loadUsers();
    };
    const data = {
        title: '',
        content: ''
    }
    $scope.getNotiGlobal = function () {
        $http.get(`https://doantotnghiepbe-production.up.railway.app/api/notifications/getAllByGlobal?page=${$scope.currentPage - 1}&size=${$scope.pageSize}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.data) {
                    $scope.notifications = response.data.data;
                    $scope.totalPages = response.data.totalPages;
                } else {
                    console.log(response.data.message);

                }
            }).catch((err) => {
                $scope.showToast("Có lỗi xãy ra. Tải dữ liệu thất bại thất bại!");
                console.log(err);

            });
    }
    $scope.createNotification = function () {
        data.title = $scope.title;
        data.content = $scope.content;
        $http.post(`https://doantotnghiepbe-production.up.railway.app/api/notifications/createNotificationGlobal`, data, {
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
                $scope.showToast("Có lỗi xãy ra. Gửi thông báo thất bại!");
                console.log(err);

            });
    }
    // Show success toast
    $scope.showToast = function (message) {
        $scope.toastMessage = message;
        const toastElement = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    };
    $scope.getNotiGlobal()
})