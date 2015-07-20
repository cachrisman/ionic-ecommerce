angular.module('ionic-ecommerce.controllers', [])
.controller('TabCtrl', TabCtrl)
.controller('HomeCtrl', HomeCtrl)
.controller('ProductsCtrl', ProductsCtrl)
.controller('ProductDetailCtrl', ProductDetailCtrl)
.controller('CartCtrl', CartCtrl)
.controller('AccountCtrl', AccountCtrl)
.controller('LoginCtrl', LoginCtrl);

// Tab Controller
TabCtrl.$inject = ['$scope', 'CartService', 'CONFIG'];
function TabCtrl(   $scope,   CartService,   CONFIG) {
  var vm = this;
  vm.count = CartService.getCount();
  vm.messages = CONFIG.tabs;

  $scope.$watch(function(){ return CartService.getCount();}, function(current, original) {
    vm.count = current;
  });
}

// Home Controller
HomeCtrl.$inject = [];
function HomeCtrl() {}
  vm.messages = CONFIG.home;

//Products Controller
ProductsCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', 'AuthService', 'ProductService', 'CONFIG'];
function ProductsCtrl(   $state,   $ionicLoading,   $ionicPopup,   AuthService,   ProductService,   CONFIG) {
  var vm = this;
  vm.messages = CONFIG.products;

  if (!AuthService.isAuthenticated()) {
    var popup = $ionicPopup.alert({
      title: 'Not Authenticated!',
      template: 'Please login in first'
    });
    popup.then(function(){$state.go('login');});
  } else {
    $ionicLoading.show();
    ProductService.all()
    .then(function(response) {
        vm.all = response.products;
        for (var key in vm.all) {
          var product = vm.all[key];
          product.image = CONFIG.image_root + product.master.images[0].mini_url;
        }
        $ionicLoading.hide();
      },
      function(rejection) {
        console.log("ProductsCtrl Products.all error: " + rejection.error);
      });
  }
}

// Product Detail Controller
ProductDetailCtrl.$inject = ['$stateParams', '$state', '$ionicLoading', '$ionicPopup' ,'CONFIG', 'AuthService', 'ProductService', 'CartService', ];
function ProductDetailCtrl(   $stateParams,   $state,   $ionicLoading,   $ionicPopup,   CONFIG,   AuthService,   ProductService,   CartService) {
  var vm = this;
  vm.messages = CONFIG.product;
  vm.addedToCart = false;
  var slug = $stateParams.slug;
  vm.addToCart = addToCart;

  if (!AuthService.isAuthenticated()) {
    var popup = $ionicPopup.alert({
      title: 'Not Authenticated!',
      template: 'Please login in first'
    });
    popup.then(function(){$state.go('login');});
  } else {
    $ionicLoading.show();
    ProductService.get(slug)
    .then(function(response) {
        vm.name = response.name;
        vm.price = response.price;
        vm.description = response.description;
        vm.image = CONFIG.image_root + response.master.images[0].product_url;
        vm.product = response;
        $ionicLoading.hide();
      },
      function(rejection) {
        $ionicLoading.hide();
        var popup = $ionicPopup.alert({
          title: 'Error!',
          template: rejection.error
        });
        popup.then(function(){$state.go('products');});
      });
  }

  function addToCart(product) {
    CartService.add(product);
    vm.addedToCart = true;
  }
}

// Cart Controller
CartCtrl.$inject = ['$scope', '$state', 'CartService', 'CONFIG'];
function CartCtrl(   $scope,   $state,   CartService,   CONFIG) {
  var vm = this;
  vm.messages = CONFIG.cart;
  vm.remove = remove;

  $scope.$on('$ionicView.enter', function(e) {
    vm.products = CartService.products;
    vm.total = CartService.total;
    for (var key in vm.products) {
      var product = vm.products[key];
      product.image = CONFIG.image_root + product.master.images[0].mini_url;
    }
  });

  function remove(product) {
    CartService.remove(product);
    vm.total = CartService.total;
    $state.reload();
  }

  function checkout(total) {

  }
}


// Account Controller
AccountCtrl.$inject = ['$scope', '$state', 'AuthService', 'CONFIG'];
function AccountCtrl(   $scope,   $state,   AuthService,   CONFIG) {
  var vm = this;
  vm.messages = CONFIG.account;
  vm.logout = logout;

  $scope.$on('$ionicView.enter', function(e) {
    vm.logged_in = AuthService.isAuthenticated();
    vm.token = AuthService.token();
  });

  function logout() {
    AuthService.logout();
    vm.user = null;
    vm.token = null;
    vm.logged_in = AuthService.isAuthenticated();
    $state.reload('account');
  }
}

// Login Controller
LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', 'AuthService', 'CONFIG'];
function LoginCtrl(   $state,   $ionicLoading,   $ionicPopup,   AuthService,   CONFIG) {
  var vm = this;
  vm.messages = CONFIG.login;
  vm.go = go;

  function go(user) {
    $ionicLoading.show();
    vm.user = null;
    AuthService.login(user.email, user.password)
      .success(function(data) {
        console.log("successful login; token: " + data.token);
        $state.go('account', {}, {reload: true});
        $ionicLoading.hide();
      })
      .error(function(data) {
        console.log("login failed", data.error);
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: data.error
        });
      });
  }
}




