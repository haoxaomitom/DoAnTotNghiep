let app = angular.module('parkingApp', []);

app.controller('ContactController', function ($scope, $http, $window) {

    $scope.fullName = '';
    $scope.phoneNumber = '';
    $scope.typeCar = '';
    $scope.contactTime = '';
    $scope.description = '';


    $scope.saveContactInfo = function () {
        const token = localStorage.getItem("token")
        const data = {
            fullName: $scope.fullName,
            phoneNumber: $scope.phoneNumber,
            typeCar: $scope.typeCar,
            contactTime: $scope.contactTime,
            description: $scope.description
        }
        console.log(data);
        if (token) {
            $http.post(`http://localhost:8080/api/contactInformation/create/1`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                if (response.data.status) {
                    alert("thành công");
                } else {

                    alert(response.data.message);
                }
            }).catch((err) => {
                console.log(err);

            });
        } else {
            localStorage.setItem('redirectUrl', $window.location.href);
            $window.location.href = '/app/components/Login/LoginAndRegister.html';
        }
    }

})