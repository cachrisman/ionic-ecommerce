angular.module('ionic-ecommerce.services', [])

.factory('LoginService', function($http, $q) {
  var LoginService = {};
  var endpoint = "http://localhost:3000/api/login";
  LoginService.loginUser = function(name, password) {
    var deferred = $q.defer();
    var promise = deferred.promise;
    $http
      .post(endpoint, { params: { user: name, password: password }})
      .success(function(response) { deferred.resolve(response); })
      .error(function(rejection) { deferred.reject(rejection); });

    promise.success = function (fn) {
      promise.then(fn);
      return promise;
    };
    promise.error = function (fn) {
      promise.then(null, fn);
      return promise;
    };
    return promise;
  };
  return LoginService;
})

.factory('UserService', function($window) {
  var UserService = {};
  UserService.set = function(token) {
    $window.sessionStorage.token = token;
  };
  UserService.current_user = function() {
    return $window.sessionStorage.token;
  };
  return UserService;
})

.factory('Products', function($http, $q, UserService) {
  // var endpoint = "/js/products.json"
  var endpoint = "http://localhost:3000/api/products";
  var ProductService = {};
  ProductService.all = function() {
    var deferred = $q.defer();
    $http
      .get(endpoint, {
        headers: {
          "X-Spree-Token": UserService.current_user()
        }
      })
      .success(function(response) {
        deferred.resolve(response);
      })
      .error(function(rejection) {
        deferred.reject(rejection);
      });
    return deferred.promise;
  };
  ProductService.get = function(id) {
    var deferred = $q.defer();
    $http
      .get(endpoint + "/" + id, {
        params: {
          token: UserService.current_user().token
        }
      })
      .success(function(response) {
        deferred.resolve(response);
      })
      .error(function(rejection) {
        deferred.reject(rejection);
      });
    return deferred.promise;
  };
  return ProductService;
});
