'use strict';
angular.module("fbpoc.FormCtrl", [])

.controller('FormCtrl', function($scope, $builder, $validator) {
    
    var table = "facility";
    
    var name_map = {}
 
    var fdict = {
 //       id:"facility",
      name:"facility",
      component: 'textInput',
      label: 'New Name',
      description: '',
      placeholder: 'Your name',
      required: true,
      editable: false, 
   //     readonly:true,
        default_:"Hello"
    };    
    
    var sdict = {component:"select",
       // editable: true,
        label: "Select",
        name:"company",
        "description":"description",
        "placeholder":"placeholder",
        options: [],
        required: true,
        editable: false, 
        validation: "/[0-9]/"
        };
        
        
    var tdict =  {
     //   id:"track",
     //   id:10,
      name:"track",
      component: 'checkbox',
      label: 'Pets',
           required: true,
      description: 'Do you have any pets?',
      options: ['Dog', 'Cat'], 
        default_:[false, true]
    };
    
    var obj_list = [fdict, sdict,fdict,tdict];
    
    var j = 0
    
    $scope.defaultValue = {};
        
    while(j < obj_list.length){
        
        
        var obj = obj_list[j];
        
        name_map[j] = obj.name
        
        if ("default_" in obj){
            
            $scope.defaultValue[j] = obj.default_;
            
            }
        
        $builder.addFormObject('form_name', obj);
            if ("readonly" in obj){
                
             //   var id  = "#form_name" + j;
                
              //  $(id).attr("readonly", "readonly");
                
                }
        j = j +1;
        }
    
        
        console.log(name_map);
    //var  track = $builder.addFormObject('form_name', tdict);
   // var  facility_code = $builder.addFormObject('form_name', fdict);
  
    $scope.form = $builder.forms['form_name'];
        
        $builder.forms['form_name'][1].options = ['', 1,2,3,4];
        
          $scope.defaultValue[1] = 3;
    
    $scope.form_model = [];
 
         $('input').val='sss';//('readonly', true);
        
    $scope.submit = function() {
      return $validator.validate($scope, 'form_name')
        .success(function() {
            var i = 0
            while(i<$scope.form_model.length){             
              
                
                console.log($scope.form_model[i]);
                  i = i +1;
                
                }
            
            console.log($scope.form_model);
            console.log('success');
      })
        .error(function() {
            console.log('error');
      });
    };
    
    //
  });