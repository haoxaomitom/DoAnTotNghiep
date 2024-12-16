let app = angular.module("app", [])
app.controller("ContactController", function ($scope, $http) {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    // lấy dữ liệu cho table
    $scope.getAll = function () {
        $http.get(`http://localhost:8080/api/contactInformation/getByUserId/${userId}`)
            .then((response) => {
                if (response.data.status) {
                    $scope.infos = response.data.data;
                }
            }).catch((err) => {
                console.log(err);

            });
    }
    $scope.detail = function (id, watched) {
        // cập nhật trạng thái đã xem
        if (!watched) {
            $http.put(`http://localhost:8080/api/contactInformation/watched/${id}`)
                .then((response) => {
                    if (response.data.status) {
                        // Tìm thông báo trong danh sách và cập nhật trạng thái isRead
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
        // lấy dữ cho modal
        $http.get(`http://localhost:8080/api/contactInformation/${id}`)
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
    // cập nhật trạng thái đã liên hệ
    $scope.updateContacted = function (contactInformationId, preContacted) {
        const contacted = $scope.contacted;
        if (contacted != preContacted) {
            $http.put(`http://localhost:8080/api/contactInformation/contacted/${contactInformationId}?contacted=${contacted}`)
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
    $scope.listWatched = function (watched) {
        $http.get(`http://localhost:8080/api/contactInformation/getByUserIdAndWatched/${userId}?watched=${watched}`)
            .then((response) => {
                if (response.data.status) {
                    $scope.infos = response.data.data;
                } else {
                    console.log("thất bại");
                }
            }).catch((err) => {
                console.log(err);

            });
    }
    $scope.listContacted = function (contacted) {
        $http.get(`http://localhost:8080/api/contactInformation/getByUserIdAndContacted/${userId}?contacted=${contacted}`)
            .then((response) => {
                if (response.data.status) {
                    $scope.infos = response.data.data;
                } else {
                    console.log("thất bại");
                }
            }).catch((err) => {
                console.log(err);

            });
    }
    $scope.delete = function (id) {
        $http.delete(`http://localhost:8080/api/contactInformation/delete/${id}`, {
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
            }).catch((err) => {

            });
    }
    $scope.selectedOption = "1"; // Mặc định là "Chưa đọc"
    // Hàm xử lý khi thay đổi giá trị trong <select>
    $scope.handleOptionChange = function () {
        switch ($scope.selectedOption) {
            case "1": // Chưa đọc
                $scope.listWatched(false); // watched = false
                break;
            case "2": // Đã đọc
                $scope.listWatched(true); // watched = true
                break;
            case "3": // Chưa liên hệ
                $scope.listContacted(false); // contacted = false
                break;
            case "4": // Đã liên hệ
                $scope.listContacted(true); // contacted = true
                break;
            case "5":// Tất cả
                $scope.getAll();
                break;
            default:
                console.log("Không hợp lệ!");
        }
    };
    // Show success toast
    $scope.showToast = function (message) {
        $scope.toastMessage = message;
        const toastElement = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    };
    // Gọi mặc định khi trang được tải
    $scope.handleOptionChange();

})