
moment.locale('fr');

var app = angular.module('demoApp', ['multipleDatePicker']);

app.controller('demoController', ['$scope', function($scope){
  $scope.logInfos = function(time, selected) {
    //alert(moment(time).format('YYYY-M-DD') + ' has been ' + (selected ? '' : 'un') + 'selected');
      
    
      console.log($scope.month);
      
  }
  
  $scope.doMonth = function(a1, a2){
  //	alert(a1);
  	  console.log(a1.format("YYYY-MM"));
  	  console.log(a2.format("YYYY-MM"));	  
  	  
};

  $scope.doDate = function(event, date){
    if(event.type == 'click') {
     // alert(moment(date).format('YYYY-M-DD') + ' has been ' + (date.selected ? 'un' : '') + 'selected');
        
          console.log($scope.month);
        
    } else {
      console.log(moment(date) + ' has been ' + event.type + 'ed')
      
    }
  };

  $scope.oneDayOff = [moment().date(14).valueOf()];
  $scope.selectedDays = [moment().date(4).valueOf(), moment().date(5).valueOf(), moment().date(8).valueOf()];
}]);
