"use strict";

// uglifyjs form.js -b  --comments all 
/**
* form
*/
angular.module("fbpoc.FormCtrl", []).controller("FormCtrl", [ "$scope", "$builder", "$validator", function($scope, $builder, $validator) {
    var table = "facility";
    var name_map = {};
    var fdict = {
        //       id:"facility",
        name: "facility",
        component: "sampleInput",
        label: "New Name",
        description: "",
        placeholder: "Your name",
        required: true,
        editable: false,
        //     readonly:true,
        default_: "Hello"
    };
    var sdict = {
        component: "select",
       // id:"company",
        // editable: true,
        label: "Select",
        name: "company",
        description: "description",
        placeholder: "placeholder",
        options: [],
        required: true,
        editable: false,
        validation: "/[0-9]/"
    };
    var tdict = {
        //   id:"track",
        //   id:10,
        name: "track",
        component: "checkbox",
        label: "Pets",
        required: true,
        description: "Do you have any pets?",
        options: [ "Dog", "Cat" ],
        default_: [ false, true ]
    };
    // object list / position
    var obj_list = [ fdict, sdict, fdict, tdict ];
    var j = 0;
    $scope.defaultValue = {};
    // add form objects
    for (j = 0; j < obj_list.length; j++) {
        var obj = obj_list[j];
        name_map[j] = obj.name;
        if ("default_" in obj) {
            $scope.defaultValue[j] = obj.default_;
        }
        $builder.addFormObject("form_name", obj);
    }
    console.log(name_map);
    //var  track = $builder.addFormObject('form_name', tdict);
    // var  facility_code = $builder.addFormObject('form_name', fdict);
    $scope.form = $builder.forms["form_name"];
    // reset field options
    $builder.forms["form_name"][1].options = [ "", 1, 2, 3, 4 ];
    $scope.defaultValue[1] = 3;
    $scope.form_model = [];
    //set readonly failed
    //$("input").prop("readonly", true);
    /*
    submit
    */
    $scope.submit = function() {
        return $validator.validate($scope, "form_name").success(function() {
            var i = 0;
            while (i < $scope.form_model.length) {
                console.log($scope.form_model[i]);
                i = i + 1;
            }
            console.log($scope.form_model);
            console.log("success");
        }).error(function() {
            console.log("error");
        });
    };
} ]);