angular.module('ionic-ecommerce')

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner></ion-spinner>',
  // template: '<ion-spinner class="spinner-positive"></ion-spinner>',
  noBackdrop: false,
})

.constant('CONFIG', {
  api_login_uri: "http://localhost:3000/api/login.json",
  api_products_uri: "http://localhost:3000/api/products",
  localStorage_token_key: "ionic-ecommerce-api-key",
  token_header: "X-Spree-Token"
});
