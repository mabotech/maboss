'use strict';


var module =  angular.module('fbpoc.BuilderCtrl', ['builder', 'builder.components', 'validator.rules']);

module.run([
    '$builder', function($builder) {
      return $builder.registerComponent('sampleInput', {
        group: 'from html',
        label: 'Sample',
        description: 'From html template',
        placeholder: 'placeholder',
        required: false,
        validationOptions: [
          {
            label: 'none',
            rule: '/.*/'
          }, {
            label: 'number',
            rule: '[number]'
          }, {
            label: 'email',
            rule: '[email]'
          }, {
            label: 'url',
            rule: '[url]'
          }
        ],
        templateUrl: 'app/template.html',
        popoverTemplateUrl: 'app/popoverTemplate.html'
      });
    }
  ]);

    module.controller('BuilderCtrl', function($scope, $builder, $validator) {
        
    var checkbox, textbox;
        
    textbox = $builder.addFormObject('default', {
      component: 'textInput',
      label: 'Name',
      description: 'Your name',
      placeholder: 'Your name',
      required: true,
      editable: false
    });
    
    checkbox = $builder.addFormObject('default', {
      component: 'checkbox',
      label: 'Pets',
      description: 'Do you have any pets?',
      options: ['Dog', 'Cat']
    });
    
    $builder.addFormObject('default', {
      component: 'sampleInput'
    });
    
    $scope.form = $builder.forms['default'];
    $scope.input = [];
    $scope.defaultValue = {};
    $scope.defaultValue[textbox.id] = 'default value';
    $scope.defaultValue[checkbox.id] = [true, true];
        
     $scope.submit = function() {
      return $validator.validate($scope, 'default').success(function() {
        return console.log('success');
      }).error(function() {
        return console.log('error');
      });
    };
    
    
  });

