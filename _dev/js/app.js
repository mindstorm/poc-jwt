/*
 * ANGULAR APP
 ****************************************************/
var app = angular.module("App", ["ui.router", "ngMaterial", "satellizer"]);


/* ui routes
 * ------------------------------------------------ */
app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $httpProvider) {
  "use strict";


  $stateProvider.state("login", {
    url: "/login",
    views: {
      main: {
        templateUrl: "views/login.html",
        controller: "LoginCtrl"
      }
    }
  })

  .state("about", {
    url: "/about",
    views: {
      main: {
        templateUrl: "views/about.html",
        controller: "AboutCtrl"
      }
    }
  })

  .state("contact", {
    url: "/contact",
    views: {
      main: {
        templateUrl: "views/contact.html",
        controller: "DefaultCtrl"
      }
    }
  });

  $urlRouterProvider.otherwise("/login");

  // interceptor
  $httpProvider.interceptors.push("httpResponseInterceptor");

}]);


// satellizer
app.config(function ($authProvider) {
  "use strict";

  $authProvider.baseUrl = ".";
  $authProvider.loginUrl = "api/login";

});


/* HTTP Response Interceptor
 * ------------------------------------------------ */
app.factory("httpResponseInterceptor", ["$q", "$injector", function ($q, $injector) {
  "use strict";
  return {
    responseError: function (response) {

      var mdDialog = $injector.get("$mdDialog");
      mdDialog.show(
        mdDialog.alert({
          title: "Error",
          content: response.statusText,
          ok: "OK"
        })
      );

      return $q.reject(response);
    }
  };
}]);


/* default controller
 * ------------------------------------------------ */
app.controller("DefaultCtrl", ["$scope", function ($scope) {
  "use strict";

  $scope.dummy = "Hello Angular World!";

}]);


/* login controller
 * ------------------------------------------------ */
app.controller("LoginCtrl", ["$scope", "$http", "$auth", function ($scope, $http, $auth) {
  "use strict";

  $scope.authenticated = {
    status: $auth.isAuthenticated(),
    data: $auth.getPayload()
  };

  $scope.user = {
    name: "test",
    password: "test"
  };

  $scope.submit = function () {
    $auth.login($scope.user)
      .then(function () {

        // re-set data
        $scope.authenticated = {
          status: $auth.isAuthenticated(),
          data: $auth.getPayload()
        };

      })
      .catch(function (response) {
        console.error(response);
      });
  };

  $scope.logout = function () {
    if (!$auth.isAuthenticated()) {
      return;
    }

    $auth.logout().then(function () {

      // re-set data
      $scope.authenticated = {
        status: $auth.isAuthenticated(),
        data: $auth.getPayload()
      };

    });
  };

}]);


/* about controller
 * ------------------------------------------------ */
app.controller("AboutCtrl", ["$scope", "$http", "$auth", function ($scope, $http) {
  "use strict";

  // get data
  $http.get("api/data").then(function(response) {
    $scope.items = response.data;
  });
  
}]);