// let app = angular.module("app", [])
app.controller("ContactController", function ($scope, $http) {

    const userId = localStorage.getItem("userId");
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

    $scope.getAll = function () {
        $http.get(`https://doantotnghiepbe-production.up.railway.app/api/contactInformation/getByUserId/${userId}?page=${$scope.currentPage - 1}&size=${$scope.pageSize}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.infos = response.data.data;
                    $scope.totalPages = response.data.totalPages;
                } else {
                    console.log(response.data.message);

                }
            }).catch((err) => {
                console.log(err);
            });
    }

    $scope.listWatched = function (watched) {
        $http.get(`https://doantotnghiepbe-production.up.railway.app/api/contactInformation/getByUserIdAndWatched/${userId}?watched=${watched}&page=${$scope.currentPage - 1}&size=${$scope.pageSize}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.infos = response.data.data;
                    $scope.totalPages = response.data.totalPages;
                } else {
                    console.log(response.data.message);

                }
            }).catch((err) => {
                console.log(err);
            });
    }

    $scope.listContacted = function (contacted) {
        $http.get(`https://doantotnghiepbe-production.up.railway.app/api/contactInformation/getByUserIdAndContacted/${userId}?contacted=${contacted}&page=${$scope.currentPage - 1}&size=${$scope.pageSize}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.infos = response.data.data;
                    $scope.totalPages = response.data.totalPages;
                } else {
                    console.log(response.data.message);

                }
            }).catch((err) => {
                console.log(err);
            });
    }

    $scope.detail = function (id, watched) {
        if (!watched) {
            $http.put(`https://doantotnghiepbe-production.up.railway.app/api/contactInformation/watched/${id}`)
                .then((response) => {
                    if (response.data.status) {
                        $scope.totalPages = response.data.totalPages;
                        const contactInfo = $scope.infos.find(info => info.contactInformationId === id);
                        if (contactInfo) {
                            contactInfo.watched = true;
                        }
                    } else {
                        console.log(response.data.message);
                    }
                }).catch(err => {
                    console.log("Lỗi cập nhật trạng thái watched:", err);
                });
        }
        $http.get(`https://doantotnghiepbe-production.up.railway.app/api/contactInformation/${id}`)
            .then((response) => {
                if (response.data.status) {
                    $scope.infoDetail = response.data.data;
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

    $scope.updateContacted = function (contactInformationId, preContacted) {
        const contacted = $scope.contacted;
        if (contacted !== preContacted) {
            $http.put(`https://doantotnghiepbe-production.up.railway.app/api/contactInformation/contacted/${contactInformationId}?contacted=${contacted}`)
                .then((response) => {
                    if (response.data.status) {
                        const contactInfo = $scope.infos.find(info => info.contactInformationId === contactInformationId);
                        if (contactInfo) {
                            contactInfo.contacted = contacted;
                        }
                    } else {
                        console.log("thất bại");
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }
    }

    $scope.delete = function (id) {
        $http.delete(`https://doantotnghiepbe-production.up.railway.app/api/contactInformation/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.infos = $scope.infos.filter(info => info.contactInformationId !== id);
                    $scope.showToast("Xóa thành công!");
                } else {
                    $scope.showToast("Có lỗi xãy ra xóa thất bại!");
                }
            }).catch((err) => { });
    }

    $scope.selectedOption = "1";
    $scope.handleOptionChange = function () {
        switch ($scope.selectedOption) {
            case "1":
                $scope.getAll();
                break;
            case "2":
                $scope.listWatched(false);
                break;
            case "3":
                $scope.listWatched(true);
                break;
            case "4":
                $scope.listContacted(false);
                break;
            case "5":
                $scope.listContacted(true);
                break;
            default:
                console.log("Không hợp lệ!");
        }
    };

    $scope.showToast = function (message) {
        $scope.toastMessage = message;
        const toastElement = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    };

    $scope.handleOptionChange();
});
