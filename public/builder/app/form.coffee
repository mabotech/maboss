"use strict"

# uglifyjs form.js -b  --comments all
###
form
###
angular.module("fbpoc.FormCtrl", []).controller "FormCtrl", [
    "$scope"
    "$builder"
    "$validator"
    ($scope, $builder, $validator) ->
        table = "facility"
        name_map = {}
        fdict =            
            #       id:"facility",
            name: "facility"
            component: "textInput"
            label: "New Name"
            description: ""
            placeholder: "Your name"
            required: true
            editable: false            
            #     readonly:true,
            default_: "Hello"

        sdict =
            component: "select"            
            # editable: true,
            label: "Select"
            name: "company"
            description: "description"
            placeholder: "placeholder"
            options: []
            required: true
            editable: false
            validation: "/[0-9]/"

        tdict =            
            #   id:"track",
            #   id:10,
            name: "track"
            component: "checkbox"
            label: "Pets"
            required: true
            description: "Do you have any pets?"
            options: [
                "Dog"
                "Cat"
            ]
            default_: [
                false
                true
            ]

        
        # object list / position
        obj_list = [
            fdict
            sdict
            fdict
            tdict
        ]
        $scope.defaultValue = {}
        
        # add form objects
        j = 0
        while j < obj_list.length
            obj = obj_list[j]
            name_map[j] = obj.name
            $scope.defaultValue[j] = obj.default_    if "default_" of obj
            $builder.addFormObject "form_name", obj
            j++
        
        #if ("readonly" in obj) {}
        #   j = j + 1;
        console.log name_map
        
        #var  track = $builder.addFormObject('form_name', tdict);
        # var  facility_code = $builder.addFormObject('form_name', fdict);
        $scope.form = $builder.forms["form_name"]
        
        # reset field options
        $builder.forms["form_name"][1].options = [
            ""
            1
            2
            3
            4
        ]
        $scope.defaultValue[1] = 3
        $scope.form_model = []
        
        #set readonly failed
        #$("input").prop("readonly", true);
        #
        #    submit
        #
        $scope.submit = ->
            $validator.validate($scope, "form_name").success(->
                i = 0
                while i < $scope.form_model.length
                    console.log $scope.form_model[i]
                    i = i + 1
                console.log $scope.form_model
                console.log "success"
                return
            ).error ->
                console.log "error"
                return

]
