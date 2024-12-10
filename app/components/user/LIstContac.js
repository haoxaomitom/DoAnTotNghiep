let app = angular.module("app", [])
app.controller("ContactController", function ($scope, $http) {

    $http.get("http://localhost:8080/api/contactInformation/getByUserId/1")
        .then((response) => {
            if (response.data.status) {
                $scope.infos = response.data.data;

            }
        }).catch((err) => {
            console.log(err);

        });
    $scope.detail = function (id) {
        $http.get(`http://localhost:8080/api/contactInformation/${id}`)
            .then((response) => {
                if (response.data.status) {
                    $scope.infoDetail = response.data.data;
                    console.log($scope.infoDetail);


                    $scope.fullName = $scope.infoDetail.fullName;
                    $scope.phoneNumber = $scope.infoDetail.phoneNumber;
                    $scope.typeCar = $scope.infoDetail.typeCar;
                    $scope.contactTime = $scope.infoDetail.contactTime;
                    $scope.description = $scope.infoDetail.description;
                    $scope.contacted = $scope.infoDetail.contacted;

                }
            }).catch((err) => {
                console.log(err);

            });
    }
    $scope.updateContacted = function (contactInformationId) {
        const contacted = $scope.contacted;
        console.log(contacted);

        $http.put(`http://localhost:8080/api/contactInformation/contacted/${contactInformationId}?contacted=${contacted}`)
            .then((response) => {
                if (response.data.status) {
                    console.log("thành công");

                } else {
                    console.log("thất bại");

                }
            }).catch((err) => {
                console.log(err);

            });
    }
})