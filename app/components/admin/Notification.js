let app = angular.module('notificationApp', []);

// app.directive('bootstrapMultiselect', function () {
//     return {
//         restrict: 'A',
//         link: function (scope, element, attrs) {
//             // Apply bootstrap-multiselect
//             element.multiselect({
//                 includeSelectAllOption: true,
//                 enableFiltering: true,
//                 buttonWidth: '100%',
//                 nonSelectedText: 'Chọn người nhận'
//             });

//             // Refresh multiselect when the model changes
//             scope.$watch(attrs.ngModel, function () {
//                 element.multiselect('refresh');
//             });
//         }
//     };
// });

app.controller('NotificationController', function ($scope, $http) {
    $scope.notification = {
        isGlobal: 'true',
        userId: [],
        title: '',
        content: ''
    };

    $scope.users = [];
    const token = localStorage.getItem("token");
    $http.get("http://localhost:8080/api/users/getAllUsers", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((response) => {
            if (response.data.status) {
                $scope.users = response.data.data;
                console.log($scope.notification);
                $(document).ready(function () {
                    $('#users').select2({
                        placeholder: 'Chọn người nhận',
                        allowClear: true,
                        multiple: true
                    });
                });

            }
        }).catch((err) => {
            console.log(err);
        });
    // Watch the userId model and update selectedUsers input
    $scope.$watch('notification.userId', function (newValue) {
        if (newValue && newValue.length > 0) {
            // Join the selected users' usernames with a comma
            $scope.notification.selectedUsers = newValue.map(userId => {
                let user = $scope.users.find(u => u.userId === userId);
                return user ? user.username : '';
            }).join(', ');
        } else {
            $scope.notification.selectedUsers = ''; // Clear when no user is selected
        }
    });
    // Function to handle user selection
    $scope.toggleUserSelection = function (user) {
        const index = $scope.notification.userId.indexOf(user.userId);
        if (index === -1) {
            // User is not selected, so add to the selection
            $scope.notification.userId.push(user.userId);
        } else {
            // User is already selected, so remove from the selection
            $scope.notification.userId.splice(index, 1);
        }
    };

    // Check if a user is selected
    $scope.isSelected = function (user) {
        return $scope.notification.userId.indexOf(user.userId) !== -1;
    };


    // Function to handle changes to "Cho tất cả"
    $scope.toggleUserSelection = function () {
        if ($scope.notification.isGlobal === 'true') {
            // Clear user selection if "Cho tất cả" is true
            $scope.notification.userId = [];
            $scope.notification.selectedUsers = '';
        }
    };

    // Submit form (example logic)
    $scope.submitForm = function () {
        console.log('Notification Data:', $scope.notification);
        alert('Form submitted successfully!');
    };
});