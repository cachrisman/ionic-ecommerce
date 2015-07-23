angular.module('ionic-ecommerce.services', [])
.service('AuthService', AuthService)
.factory('ProductService', ProductService)
.factory('CartService', CartService)
.factory('LocalStorage', LocalStorage);

// Auth Service
AuthService.$inject = ['$q', '$http', 'LocalStorage', 'CONFIG'];
function AuthService($q, $http, LocalStorage, CONFIG) {
  var localStorage_token_key = CONFIG.localStorage_token_key;
  var token_header = CONFIG.token_header;
  var isAuthenticated = false;
  var authToken;

  function loadUserCredentials() {
    var token = LocalStorage.get(localStorage_token_key);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    LocalStorage.set(localStorage_token_key, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    $http.defaults.headers.common[token_header] = token;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common[token_header] = undefined;
    LocalStorage.remove(localStorage_token_key);
  }

  var login = function(email, password) {
    var endpoint = CONFIG.api_login_uri;
    var deferred = $q.defer();
    var promise = deferred.promise;
    var params = { email: email, password: password };
    $http
      .post(endpoint, params)
      .success(function(response) {
        storeUserCredentials(response.token);
        deferred.resolve(response);
      })
      .error(function(rejection) { deferred.reject(rejection); });

    promise.success = function (callback) {
      promise.then(callback);
      return promise;
    };
    promise.error = function (callback) {
      promise.then(null, callback);
      return promise;
    };
    return promise;
  };

  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    token: function() {return authToken;},
    isAuthenticated: function() {return isAuthenticated;}
  };
}

// Product Service
ProductService.$inject = ['$http', '$q', 'AuthService', 'CONFIG'];
function ProductService($http, $q, AuthService, CONFIG) {
  var service = this;
  service.endpoint = CONFIG.api_products_uri;
  service.all = all;
  service.get = get;

  function all() {
    return httpRequestHandler(service.endpoint);
  }

  function get(slug) {
    return httpRequestHandler(service.endpoint + "/" + slug);
  }

  function httpRequestHandler(url) {
    var timedOut = false,
        timeout = $q.defer(),
        result = $q.defer(),
        httpRequest;

    setTimeout(function () {
      timedOut = true;
      timeout.resolve();
    }, (1000 * CONFIG.timeout));

    httpRequest = $http({
      method: 'get',
      url: url,
      cache: true,
      timeout: timeout.promise
    });

    httpRequest.success(function(response, status, headers, config) {
      var data = {};
      data.response = response;
      data.status = status;
      data.headers = headers;
      data.config = config;
      result.resolve(data);
    });

    httpRequest.error(function(rejection, status, headers, config) {
      var data = {};
      data.status = status;
      data.headers = headers;
      data.config = config;
      data.rejection = timedOut ? 'Request took longer than ' + CONFIG.timeout + ' seconds.' : rejection;
      result.reject(data);
    });

    return result.promise;
  }
  return service;
}

// Cart Service
CartService.$inject = ['$http', '$q', 'ProductService'];
function CartService($http, $q, ProductService) {
  var service = this;
  service.products = [];
  service.cart_product_id = 0;
  service.total = 0;
  service.add = add;
  service.remove = remove;
  service.getCount = getCount;

  function add(product) {
    var newProduct = $.extend(true, {}, product);
    newProduct.cart_product_id = ++service.cart_product_id;
    service.products.push(newProduct);
    service.total += parseFloat(newProduct.price);
  }

  function remove(product) {
    service.products = service.products.filter(function (el) { return el !== product; });
    service.total -= parseFloat(product.price);
  }

  function getCount() {
    return service.products.length;
  }

  return service;
}

LocalStorage.$inject = ['$window'];
function LocalStorage($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
}
