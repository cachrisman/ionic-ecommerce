angular.module('ionic-ecommerce.controllers', [])

.controller('HomeCtrl', function($scope) {})

.controller('ProductsCtrl', function($scope, Products) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  Products.all().then(
    function(response) {
      $scope.products = response.products;
    },
    function(rejection) {
      console.log("ProductsCtrl Products.all error: " + rejection.error);
    });
})

.controller('ProductDetailCtrl', function($scope, $stateParams, Products) {
  var id = $stateParams.productId;
  Products.get(id).then(
    function(response) {
      $scope.product = response;
    },
    function(rejection) {
      console.log("ProductDetailCtrl Products.get error: " + rejection);
    });
})

.controller('CartCtrl', function($scope, $stateParams, Products) {})

.controller('AccountCtrl', function($scope, UserService) {})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, UserService, LoginService) {
  $scope.user = {};
  $scope.login = function() {
    LoginService.loginUser($scope.user.email, $scope.user.password)
      .success(function(data) {
        console.log(data);
        $state.go('tab.account');
      })
      .error(function(data) {
        console.log(data);
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
  };

});
