"use strict";

// uglifyjs builder.js -b  --comments all  
var module = angular.module("fbpoc.BuilderCtrl", [ "builder", "builder.components", "validator.rules" ]);

/**
  *  registerComponent
  */
  /*
module.run([ "$builder", function($builder) {
    return $builder.registerComponent("sampleInput", {
        group: "from html",
        label: "Sample",
        description: "From html template",
        placeholder: "placeholder",
        required: false,
        validationOptions: [ {
            label: "none",
            rule: "/.* /"
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
        templateUrl: "app/components/c1/template.html",
        popoverTemplateUrl: "app/components/c1/popoverTemplate.html"
    });
} ]);
*/
/**
  *  BuilderCtrl
  */
module.controller("BuilderCtrl", function($scope, $timeout, $builder, $validator) {
    var checkbox, textbox, rtext;
    // readonly
    //$scope.r = 1;
    $scope.get_readonly = function() {
        console.log("readonly");
        return true;
    };
    //obj
    
    $scope.r = 0;
    
    textbox = $builder.addFormObject("default", {
        component: "textInput",
        label: "Name",
        name:"n_input",
        description: "Your name",
        placeholder: "Your name",
        required: true,
        editable: false,
         readonly:false
    });
    //obj
    checkbox = $builder.addFormObject("default", {
        component: "checkbox",
        name:"n_checkbox",
        label: "Pets",
        description: "Do you have any pets?",
        options: [ "Dog", "Cat" ]
    });
    // readonly test
    rtext = $builder.addFormObject("default", {
        component: "sampleInput",
        name:"mabo",
     //   readonly:true,
        placeholder:"test readonly"
    });
    
    var vchange = function(){
        
        console.log("timer",rtext.readonly);
        
        if (rtext.readonly == true){
        rtext.readonly = false;
        }else{
            rtext.readonly = true;
            }
            
            $timeout(vchange, 6000);
            
    };

    $timeout(vchange, 6000);

    $scope.form = $builder.forms["default"];
    $scope.form_json = JSON.stringify($scope.form, null, 4);
    /*
    watch
    */
    $scope.$watch("form", function(newVal, oldVal) {
        // console.log(JSON.stringify(newVal), oldVal);
        $scope.form_json = JSON.stringify($scope.form, null, 4);
    }, true);
    // <- $watch, the third parameter for compare value, not reference.
    // JSON.stringify  (  , null, 4)
    $scope.input = [];
    $scope.input_json = JSON.stringify($scope.form, null, 4);
    /*
    watch
    */
    $scope.$watch("input", function(newVal, oldVal) {
        // console.log(JSON.stringify(newVal), oldVal);
        $scope.input_json = typeof( JSON.stringify($scope.input, null, 4) );
    }, true);
    $scope.defaultValue = {};
    $scope.defaultValue[textbox.id] = "default value";
    $scope.defaultValue[checkbox.id] = [ true, true ];
    /*
    submit
    */
    $scope.submit = function() {
        return $validator.validate($scope, "default").success(function() {
            return console.log("success");
        }).error(function() {
            return console.log("error");
        });
    };
});