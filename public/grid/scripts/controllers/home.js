/*
 * angular-deckgrid-demo
 *
 * Copyright(c) 2013 André K?nig <akoenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author André K?nig (andre.koenig@posteo.de)
 *
 */

angular.module('kanban.deckgrid').controller('HomeController', [

    '$scope',
  //  'flot',
    
    function initialize ($scope) {

        'use strict';

        $scope.photos = [
                {id: '00045', name: '耐久 1', src: '/grid/p1.png',status:"故障",color:"#FF0000",data:"35",downtime:"0.1",runtime:"0:20"},
                {id: '00046', name: '耐久 2', src: '/grid/p1.png',status:"运行",color:"#00FF00",data:"76",downtime:"0.2",runtime:"1:10"},
                {id: '00093', name: '耐久 3', src: '/grid/p1.png',status:"闲置",color:"#FFF000",data:"53",downtime:"0.3",runtime:"0:25"},
                {id: '00096', name: '重鼓 1', src: '/grid/p2.png',status:"故障",color:"#FF0000",data:"27",downtime:"0.2",runtime:"1:52"},
                {id: '00094', name: '排放 1', src: '/grid/p1.png',status:"维护",color:"#FF00FF",data:"56",downtime:"0.4",runtime:"0:10"},
                {id: '00090', name: '高低温 1', src: '/grid/p3.png',status:"运行",color:"#00FF00",data:"67",downtime:"0.5",runtime:"0:20"},
                {id: '00097', name: '四驱转鼓 1', src: '/grid/p5.png',status:"闲置",color:"#FFFF00",data:"55",downtime:"0.1",runtime:"1:26"},
          //       {id: 'e-8', name: '四驱转鼓 2', src: '/grid/p5.png',status:"闲置",color:"#FFFF00",data:"37",downtime:"0.6",runtime:"3:05"},
            //    {id: 'photo-7', name: '', src: '/grid/p6.png'},
              //  {id: 'photo-6', name: 'Awesome photo', src: '/grid/p1.png'},
             //   {id: 'photo-7', name: 'Awesome 2', src: '/grid/p1.png'},
        ];
                
                
          $scope.dataset = [{ data: [], yaxis: 1 },{ data: [], yaxis:1 },{ data: [], yaxis: 1 },{ data: [], yaxis:1 }];
          
          var stack = 0,
			bars = false,
			lines = true,
			steps = false;
          
          $scope.options = {
              
              series: {
					stack: stack,
					lines: {
						show: lines,
						fill: true,
						steps: steps
					},
					bars: {
						show: bars,
						barWidth: 0.2
					}
				},
              /*
       yaxis: {
				min: -1,
				max: 1
			},
			xaxis: {
				show: true
			},*/
            legend: {
              show: true
            }
          };

        function update(){
            
            $scope.dataset = [{ data: [], yaxis: 1 },{ data: [], yaxis:1 },{ data: [], yaxis: 1 },{ data: [], yaxis:1 }];
            
          for (var i = 0; i < 14; i += 0.8) {
            // console.log(i);
                $scope.dataset[0].data.push([i, Math.abs(Math.sin( Math.random(i)))]);
                $scope.dataset[1].data.push([i, Math.abs(Math.sin(i+Math.random(1)))]);
                $scope.dataset[2].data.push([i, Math.abs(Math.sin(i+1+Math.random(2)))]);
                $scope.dataset[3].data.push([i, Math.abs(Math.sin(i+2+Math.random(3)))]);
          }                
                $scope.$apply(  )
         // plot.draw()
          //console.log(1);
          setTimeout(update, 1000)
      }
      
      update()
                
         

    },
 


]);