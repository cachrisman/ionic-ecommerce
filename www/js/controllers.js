angular.module('ionic-ecommerce.controllers', [])

.controller('HomeCtrl', function( $scope) {})

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

.controller('AccountCtrl', function($scope, $state, AuthService) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.logged_in = AuthService.isAuthenticated();
    console.log("logged in: ", $scope.logged_in ? "true" : "false" );
    $scope.token = AuthService.token();
    console.log("$scope.token: ", $scope.token);
  });

  $scope.logout = function(){
    AuthService.logout();
    $scope.user = {};
    $scope.token = null;
    $scope.logged_in = AuthService.isAuthenticated();
    // $state.go('tab.account', {}, {reload: true});
    $state.reload('tab.account');
  };
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.login = function(user) {
    AuthService.login(user.email, user.password)
      .success(function(data) {
        $scope.user = {};
        // $scope.logged_in = AuthService.isAuthenticated();
        // $scope.token = data.token;
        console.log("successful login; token: " + data.token);
        $state.go('tab.account', {}, {reload: true});
        // $state.reload('tab.account');
      })
      .error(function(data) {
        console.log("login failed", data.error);
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: data.error
        });
      });
  };
});
