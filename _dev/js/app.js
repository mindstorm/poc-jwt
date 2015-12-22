/*
 * ANGULAR APP
 ****************************************************/
var app = angular.module("App", ["ui.router", "ngMaterial"]);


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
      },
    }
  })

  .state("about", {
    url: "/about",
    views: {
      main: {
        templateUrl: "views/about.html",
        controller: "DefaultCtrl"
      },
    }
  })

  .state("contact", {
    url: "/contact",
    views: {
      main: {
        templateUrl: "views/contact.html",
        controller: "DefaultCtrl"
      },
    }
  });

  $urlRouterProvider.otherwise("/login");

  // interceptor
  $httpProvider.interceptors.push("httpResponseInterceptor");

}]);


app.factory("httpResponseInterceptor", ["$q", "$injector", function ($q, $injector) {
  "use strict";
  var httpResponseInterceptor = {
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
  return httpResponseInterceptor;
}]);


/* default controller
 * ------------------------------------------------ */
app.controller("DefaultCtrl", ["$scope", function ($scope) {
  "use strict";

  $scope.dummy = "Hello Angular World!";

}]);


/* login controller
 * ------------------------------------------------ */
app.controller("LoginCtrl", ["$scope", "$http", function ($scope, $http) {
  "use strict";

  $scope.user = {
    name: "test",
    password: "test"
  };

  $scope.submit = function () {
    $http.post("api/login", $scope.user).then(function (response) {
      console.log(response);
    });
  };

}]);