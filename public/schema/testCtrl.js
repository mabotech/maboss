
angular.module('test',['schemaForm']).controller('TestCtrl', function($scope,$http){

  //$scope.tests = [
    /*
    { name: "Simple", data: 'data/simple.json' },
    { name: "Complex Key Support", data: 'data/complex-keys.json' },
    { name: "Array", data: 'data/array.json' },
    { name: "Tab Array", data: 'data/tabarray.json' },
    { name: "TitleMap Examples", data: 'data/titlemaps.json' },
    { name: "Kitchen Sink", data: 'data/sink.json' }
    */
 // ];

 // $scope.selectedTest = $scope.tests[0];

    /*
  $scope.$watch('selectedTest',function(val){
    if (val) {
      $http.get(val.data).then(function(res){
        $scope.schema = res.data.schema;
        $scope.form   = res.data.form;
        $scope.schemaJson = JSON.stringify($scope.schema,undefined,2);
        $scope.formJson   = JSON.stringify($scope.form,undefined,2);
        $scope.modelData = res.data.model || {};
      });
    }
  });
*/
       $http.get('schema_form.json').then(function(res){
        $scope.schema = res.data.schema;
        $scope.form   = res.data.form;
       // $scope.schemaJson = JSON.stringify($scope.schema,undefined,2);
     //   $scope.formJson   = JSON.stringify($scope.form,undefined,2);
        $scope.modelData = res.data.model || {};
      });
      
      
  $scope.decorator = 'bootstrap-decorator';

  $scope.itParses     = true;
  $scope.itParsesForm = true;

/*
  $scope.$watch('schemaJson',function(val,old){
    if (val && val !== old) {
      try {
        $scope.schema = JSON.parse($scope.schemaJson);
        $scope.itParses = true;
      } catch (e){
        $scope.itParses = false;
      }
    }
  });
  */
/*
  $scope.$watch('formJson',function(val,old){
    if (val && val !== old) {
      try {
        $scope.form = JSON.parse($scope.formJson);
        $scope.itParsesForm = true;
      } catch (e){
        $scope.itParsesForm = false;
      }
    }
  });
*/
  $scope.pretty = function(){
    return JSON.stringify($scope.modelData,undefined,2,2);
  };
/*
  $scope.log = function(msg){
    console.log("Simon says",msg);
  };

  $scope.sayNo = function() {
    alert('Noooooooo');
  };

  $scope.say = function(msg) {
    alert(msg);
  };
  */

  $scope.submitForm = function(form, model) {
    // First we broadcast an event so all fields validate themselves
    $scope.$broadcast('schemaFormValidate');
    // Then we check if the form is valid
    if (form.$valid) {
        console.log(JSON.stringify(form));
        var v = {"table":"ttt", cols:model};
        console.log(JSON.stringify(v));
     // alert('You did it!');
    }
  }

});