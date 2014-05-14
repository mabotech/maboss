"use strict";

//uglifyjs pocCtrl.js -b  --comments all 
/**
controller
*/
angular.module("maboss", []).controller("DashboardController", [ "$scope", "UserService", function($scope, UserService) {
    // UserService's getFriends() method
    // returns a promise
    //$scope.friends = User.getFriends( 123);
    console.log("ctrl");
} ]);