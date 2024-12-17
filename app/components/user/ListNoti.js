let app = angular.module("app", [])
app.controller("NotificationController", function ($scope, $http) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId")
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

    // lấy dữ liệu cho table
    $scope.getAll = function () {
        $http.get(`http://localhost:8080/api/notifications/getAllByGlobalAndUser?userId=${userId}&page=${$scope.currentPage - 1}&size=${$scope.pageSize}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.notifications = response.data.data;
                    $scope.totalPages = response.data.totalPages;
                } else {
                    console.log(response.data.message);
                }
            }).catch((err) => {
                console.log(err);

            });
    }
    $scope.getByIsRead = function (isRead) {
        $http.get(`http://localhost:8080/api/notifications/getAllByGlobalAndUserAndIsRead?userId=${userId}&isRead=${isRead}&page=${$scope.currentPage - 1}&size=${$scope.pageSize}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.notifications = response.data.data;
                    $scope.totalPages = response.data.totalPages;
                    console.log($scope.notifications);

                } else {
                    console.log(response.data.message);
                }
            }).catch((err) => {
                console.log(err);

            });
    }
    // lấy dữ liệu cho modal
    $scope.detail = function (notificationId, isRead) {
        // cập nhật trạng thái đã xem
        if (!isRead) {
            $http.put(`http://localhost:8080/api/notifications/isRead/${notificationId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.data.status) {
                        // Tìm thông báo trong danh sách và cập nhật trạng thái isRead
                        const notification = $scope.notifications.find(noti => noti.notificationId === notificationId);
                        if (notification) {
                            notification.isRead = true;
                        }
                    } else {
                        console.log(response.data.message);
                    }

                }).catch(err => {
                    console.log("Lỗi cập nhật trạng thái isRead:", err);
                });
        }
        // lấy dữ liệu cho modal
        $http.get(`http://localhost:8080/api/notifications/getById?id=${notificationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.notification = response.data.data;
                } else {
                    console.log("Lỗi tải thông báo");
                }
            }).catch((err) => {
                console.log(err);

            });
    }


    $scope.selectedOption = "1";
    // Hàm xử lý khi thay đổi giá trị trong <select>
    $scope.handleOptionChange = function () {
        switch ($scope.selectedOption) {
            case "1": // Tất cả
                $scope.getAll();
                break;
            case "2": // Đã đọc
                $scope.getByIsRead(true);
                break;
            case "3": // Chưa đọc
                $scope.getByIsRead(false);
                break;
            default:
                console.log("Không hợp lệ!");
        }
    };
    // Gọi mặc định khi trang được tải
    $scope.handleOptionChange();
})