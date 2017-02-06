# Ionic-Ecommerce

##About
Ionic-Ecommerce is a project using the [Ionic Framework](http://ionicframework.com/) and [AngularJS](http://www.angularjs.org) to make a mobile frontend to an ecommerce store.  It can be deployed as a mobile site for an ecommerce store, or built into native iOS and Android apps which will access the products, account, login, logout, cart, and checkout functions of the ecommerce site.

The backend server is at (http://ionic-ecommerce.herokuapp.com) and its repo is at (https://github.com/cachrisman/ionic-ecommerce-server)

##Libraries & Frameworks
- Ruby on Rails
- Spree Ecommerce
- Angular
- Ionic

##Installation
Backend
```
git clone https://github.com/cachrisman/ionic-ecommerce-server.git
cd ionic-ecommerce-server
bundle install
spree install -A
rake db:migrate
rails server
```
Frontend
```
git clone https://github.com/cachrisman/ionic-ecommerce.git
cd ionic-ecommerce
npm install --save
bower install --save
```
Change the file `ionic-ecommerce/www/js/constants.js` to reflect your local environment
```
ionic serve -l
```

you can also emulate the app running on iOS if you have Xcode installed:
```
ionic emulate ios
```

## Documentation

## Future Direction
