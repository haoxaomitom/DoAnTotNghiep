let app = angular.module("app", [])
app.controller("NotificationController", function ($scope, $http) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId")
    $http.get(`http://localhost:8080/api/notifications/getAllByGlobalAndUser?userId=${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((response) => {
            console.log(response.data.status);

            if (response.data.status) {
                $scope.notifications = response.data.data;
                console.log($scope.notifications);

            } else {
                console.log(response.data.message);
            }
        }).catch((err) => {
            console.log(err);

        });
    $scope.detail = function (notificationId) {
        $http.get(`http://localhost:8080/api/notifications/getById?id=${notificationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.notification = response.data.data;
                    console.log($scope.notification);

                } else {
                    console.log("Lỗi");

                }
            }).catch((err) => {
                console.log(err);

            });
    }
})