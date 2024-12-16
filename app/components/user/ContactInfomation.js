let app = angular.module('parkingApp', []);

app.controller('ContactController', function ($scope, $http, $window) {

    $scope.fullName = '';
    $scope.phoneNumber = '';
    $scope.typeCar = '';
    $scope.contactTime = '';
    $scope.description = '';
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    


    $scope.saveContactInfo = function () {

        const data = {
            fullName: $scope.fullName,
            // user: userId,
            // post: postId,
            phoneNumber: $scope.phoneNumber,
            typeCar: $scope.typeCar,
            contactTime: $scope.contactTime,
            description: $scope.description
        }
        console.log(data);
        console.log(postId);
        if (token) {
            $http.post(`http://localhost:8080/api/contactInformation/create/${postId}`, data, {
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