app.controller('PaymentController', function ($scope, $location, PaymentService, $window) {
    $scope.selectedPriceId = null;
    $scope.filteredPrices = [];
    // $scope.postId = 1;
    $scope.orderInfo = "Thông tin đơn hàng"; // Define orderInfo with appropriate content
    const queryParams = new URLSearchParams($location.absUrl().split('?')[1]);
    $scope.postId = queryParams.get('postId');
    console.log($scope.postId)

    // Fetch prices from the database
    PaymentService.getPrices().then(function (response) {
        $scope.prices = response.data;
        console.log(response.data);
        $scope.filteredPrices = $scope.prices; // Initialize with all prices
    });

    // Function to format amount as Vietnamese currency
    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
        }
        return "0 VND";
    };

    // Function to set selected price
    $scope.selectPrice = function (priceId) {
        $scope.selectedPriceId = priceId;
        const selectedPrice = $scope.prices.find(price => price.priceId === priceId);
        if (selectedPrice) {
            $scope.amount = selectedPrice.finalAmount;
        }
    };

    // Filter prices based on duration selection
    $scope.filterPrices = function () {
        if ($scope.selectedDuration === 'day') {
            $scope.filteredPrices = $scope.prices.filter(price => price.description.includes("ngày"));
        } else if ($scope.selectedDuration === 'month') {
            $scope.filteredPrices = $scope.prices.filter(price => price.description.includes("tháng"));
        } else if ($scope.selectedDuration === 'year') {
            $scope.filteredPrices = $scope.prices.filter(price => price.description.includes("năm"));
        } else {
            $scope.filteredPrices = $scope.prices; // Show all if no selection
        }
    };

    // Function to make payment
    $scope.makePayment = function (price) {
        if (!price || !$scope.postId) {
            console.error("Price or postId is not defined");
            return;
        }
    
        $scope.orderInfo = `Thanh toán cho bài đăng với ID ${$scope.postId} và giá ${price.finalAmount}`;
    
        PaymentService.createPayment(price.priceId, $scope.postId)
            .then(function (response) {
                if (response && response.data && response.data.url) {
                    console.log("Payment URL:", response.data.url);
                    $window.open(response.data.url, '_blank');

                    // $window.location.href = response.data.url; // Navigate to payment URL
                } else {
                    console.log("Payment URL is undefined", response);
                }
            }, function (error) {
                console.log("An error occurred", error);
            });
    };
    
});