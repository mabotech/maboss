'use strict';

// Declare app level module which depends on filters, and services
angular.module('fbpoc', [
  'ngRoute',
  'ui.bootstrap',
  //form builder
  'builder', 
  'builder.components', 
  'validator.rules',
  //controllers
  'fbpoc.BuilderCtrl',
  'fbpoc.FormCtrl'
]).
config(['$routeProvider', function($routeProvider) {

 $routeProvider.when('/builder', {templateUrl: 'app/builder.html', controller: 'BuilderCtrl'});
  
  $routeProvider.when('/form', {templateUrl: 'app/form.html', controller: 'FormCtrl'});
  
  $routeProvider.otherwise({redirectTo: '/builder'});
}]).
config(['$builderProvider',function($builder) {
    //  registerComponent
    return $builder.registerComponent("sampleInput", {
        group: "from html",
        label: "Sample",
        description: "From html template",
        placeholder: "placeholder",
        required: false,
        validationOptions: [ {
            label: "none",
            rule: "/.*/"
        }, {
            label: "number",
            rule: "[number]"
        }, {
            label: "email",
            rule: "[email]"
        }, {
            label: "url",
            rule: "[url]"
        } ],
        templateUrl: "/builder/app/components/c1/template.html",
        popoverTemplateUrl: "/builder/app/components/c1/popoverTemplate.html"
    });
}


])
;
