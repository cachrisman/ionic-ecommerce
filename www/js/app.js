angular.module('ionic-ecommerce', ['ionic', 'ionic-ecommerce.controllers', 'ionic-ecommerce.services'])
.run(Runner)
.config(Configurator);

Runner.$inject = ['$ionicPlatform'];
function Runner($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
}

Configurator.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider'];
function Configurator($httpProvider, $stateProvider, $urlRouterProvider) {

  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common["X-CSRF-Token"] = $("meta[name=csrf-token]").attr("content");
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

  $stateProvider

  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl as home'
      }
    }
  })

  .state('tab.products', {
    url: '/products',
    views: {
      'tab-products': {
        templateUrl: 'templates/tab-products.html',
        controller: 'ProductsCtrl as products'
      }
    }
  })

  .state('tab.product-detail', {
    url: '/products/:productId',
    views: {
      'tab-products': {
        templateUrl: 'templates/product-detail.html',
        controller: 'ProductDetailCtrl as product'
      }
    }
  })

  .state('tab.cart', {
    url: '/cart',
    views: {
      'tab-cart': {
        templateUrl: 'templates/tab-cart.html',
        controller: 'CartCtrl as cart'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl as account'
      }
    }
  })

  .state('tab.login', {
    url: '/login',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-login.html',
        controller: 'LoginCtrl as login'
      }
    }
  });

  $urlRouterProvider.otherwise('/tab/home');
}
