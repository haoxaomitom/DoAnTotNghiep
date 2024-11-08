var app = angular.module('paymentApp', []);  

angular.module('paymentApp').controller('SuccessController', function($scope, $http, $window) {
    // Function to get the transaction reference from the URL
    function getTxnRef() {
        const urlParams = new URLSearchParams($window.location.search);
        return urlParams.get('txnRef');
    }
    
    // Function to fetch payment details
    $scope.fetchPaymentDetails = function() {
        const txnRef = getTxnRef();
        console.log('Transaction Reference:', txnRef); // Debug log
        if (txnRef) {
            $http.get(`http://127.0.0.1:8080/api/vnpay/payment/details/${txnRef}`)
                .then(function(response) {
                    // Handle successful response
                    $scope.paymentDetails = response.data;
                    console.log('Payment Details:', $scope.paymentDetails);
                })
                .catch(function(error) {
                    // Handle error response
                    console.error('Error fetching payment details:', error);
                    $scope.paymentDetails = {}; // Reset to empty object on error
                });
        } else {
            $scope.paymentDetails = {}; // Reset to empty object if txnRef is not found
        }
    };

    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return "0";
    };

    // Call the fetchPaymentDetails function when the controller is initialized
    $scope.fetchPaymentDetails();
});
