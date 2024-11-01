app.controller('PaymentController', function ($scope, PaymentService, $window) {
    $scope.selectedPriceId = null;
    $scope.filteredPrices = [];
    $scope.postId = 1;

    // Fetch prices from the database
    PaymentService.getPrices().then(function (response) {
        $scope.prices = response.data;
        $scope.filteredPrices = $scope.prices; // Initialize with all prices
    });

    // Function to format amount as Vietnamese currency
    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
        }
        return "0 VND";
    };

    // Function to set selected price and calculate discount
    $scope.selectPrice = function(priceId) {
        $scope.selectedPriceId = priceId;
        const selectedPrice = $scope.prices.find(price => price.priceId === priceId);
        if (selectedPrice) {
            $scope.amount = selectedPrice.amount;
            $scope.discountPercentage = selectedPrice.discountPercentage || 0; // Use discountPercentage from Price table
        }
    };

    // Calculate discounted amount based on specific discount percentage
    $scope.calculateDiscountedAmount = function (amount, discountPercentage) {
        if (amount && discountPercentage) {
            return amount - (amount * discountPercentage / 100);
        }
        return amount;
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
        const discountedAmount = $scope.calculateDiscountedAmount(price.amount, price.discountPercentage);
        PaymentService.createPayment(discountedAmount, $scope.orderInfo, $scope.postId, price.priceId)
            .then(function (response) {
                if (response.data && response.data.url) { // Ensure the URL exists in the response
                    $window.location.href = response.data.url; // Navigate to payment URL
                } else {
                    console.log("Payment URL is undefined", response);
                }
            }, function (error) {
                console.log("An error occurred", error);
            });
    };
    

});
