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
                {id: '00045', name: '耐久 1', src: '/grid/p1.png',status:"故障",color:"#FF4136",data:"35",downtime:"0.1",runtime:"0:20",color2:"#FF4136",status2:"."},
                {id: '00046', name: '耐久 2', src: '/grid/p1.png',status:"运行",color:"#00FF00",data:"76",downtime:"0.2",runtime:"1:10",color2:"#00FF00",status2:"."},
                {id: '00093', name: '耐久 3', src: '/grid/p1.png',status:"闲置",color:"#FFF000",data:"53",downtime:"0.3",runtime:"0:25",color2:"#FFF000",status2:"."},
                {id: '00096', name: '重鼓 1', src: '/grid/p3.png',status:"占用",color:"#39CCCC",data:"27",downtime:"0.2",runtime:"1:52",color2:"#F012BE",status2:"车辆维护"},
                {id: '00094', name: '排放 1', src: '/grid/p1.png',status:"维护",color:"#FF00FF",data:"56",downtime:"0.4",runtime:"0:10",color2:"#FF00FF",status2:"."},
                {id: '00090', name: '高低温 1', src: '/grid/p2.png',status:"运行",color:"#00FF00",data:"67",downtime:"0.5",runtime:"0:20",color2:"#00FF00",status2:"."},
                {id: '00097', name: '四驱转鼓 1', src: '/grid/p5.png',status:"闲置",color:"#FFFF00",data:"55",downtime:"0.1",runtime:"1:26",color2:"#FFFF00",status2:"."},
          //       {id: 'e-8', name: '四驱转鼓 2', src: '/grid/p5.png',status:"闲置",color:"#FFFF00",data:"37",downtime:"0.6",runtime:"3:05"},
            //    {id: 'photo-7', name: '', src: '/grid/p6.png'},
              //  {id: 'photo-6', name: 'Awesome photo', src: '/grid/p1.png'},
             //   {id: 'photo-7', name: 'Awesome 2', src: '/grid/p1.png'},
        ];
                
                
           $scope.dataset = [{ data: [], yaxis: 1 },{ data: [], yaxis:1 },{ data: [], yaxis: 1 },{ data: [], yaxis:1 },{ data: [], yaxis:1 }];
               
            $scope.dataset2 = [
                    { label:"故障",data: [], yaxis: 1,color:"#FF4136" },
                    { label:"闲置",data: [], yaxis:1,color:"#FFDC00" },
                    { label:"维护",data: [], yaxis: 1 ,color:"#B10DC9" },
                    { label:"运行",data: [], yaxis:1,color:"#2ECC40"  },
                    {label:"休息", data: [], yaxis:1 ,color:"#0074D9" }];
          
          var stack = 0,
			bars = false,
			lines = true,
			steps = false;
          
          $scope.options2 = {
           
               hoverable:true,
                  shadowSize:2,
              grid: {
                show: true,
                aboveData: true,
                  borderWidth:0,
                color: "#444444",
                  backgroundColor:"#1F1F1F"
              },
              series: {
					stack: stack,
                 
					lines: {
						show: lines,
						fill: true,
                        fillColor: { colors: [ { opacity: 0.9 }, { opacity: 0.9 } ] },
						steps: steps
					},
					bars: {
						show: bars,
                         lineWidth: 1,
                        fill: true,
						barWidth: 0.5
					}
				},
              
       yaxis: {
				min: 0,
				max: 3.51
			},
			xaxis: {
				show: true
			},
            legend: {
              show: true,
                noColumns:5,
                 position: "ne" ,
                backgroundColor:"#FFF",
                backgroundOpacity:0.6
            }
          };

          
          $scope.options = {
            
               hoverable:true,
                  shadowSize:2,
              grid: {
                show: true,
                aboveData: true,
                  borderWidth:0,
                color: "#444444",
                  backgroundColor:"#1F1F1F"
              },
              series: {
					stack: stack,
                 
					lines: {
						show: true,
						fill: false,
                        fillColor: { colors: [ { opacity: 0.9 }, { opacity: 0.9 } ] },
						steps: steps
					},
					bars: {
						show: false,
                         lineWidth: 1,
                        fill: true,
                          fillColor: { colors: [ { opacity: 0.9 }, { opacity: 0.9 } ] },
						barWidth: 0.4
					}
				},
              
       yaxis: {
				min: 0,
				max: 3.51
			},
			xaxis: {
				show: true
			},
            legend: {
              show: true,
                noColumns:5,
                 position: "ne" ,
                backgroundColor:"#FFF",
                backgroundOpacity:0.6
            }
          };
          
          
        function update(){
            
            $scope.dataset = [
                    { label:"故障",data: [], yaxis: 1 },
                    { label:"闲置",data: [], yaxis:1},
                    { label:"维护",data: [], yaxis: 1  },
                    { label:"运行",data: [], yaxis:1  },
                    {label:"占用", data: [], yaxis:1 }];
            
          for (var i = 0; i < 10; i += 1) {
            // console.log(i);
              var v1 = Math.abs(Math.sin( Math.random(i)))
                $scope.dataset[0].data.push([i, v1]);
              var v2 = Math.abs(Math.sin(i+Math.random(1)))
                $scope.dataset[1].data.push([i, v2]);
              var v3 =  Math.abs(Math.sin(i+1+Math.random(2)))
                $scope.dataset[2].data.push([i,v3]);
              var v4 = Math.abs(Math.sin(i+2+Math.random(3)))
                $scope.dataset[3].data.push([i, v4]);
              
            //   $scope.dataset[4].data.push([i, 3.5-v1-v2-v3-v4]);
          }        


           $scope.dataset2 = [
                    { label:"故障",data: [], yaxis: 1,color:"#FF4136" },
                    { label:"闲置",data: [], yaxis:1,color:"#FFDC00" },
                    { label:"维护",data: [], yaxis: 1 ,color:"#B10DC9" },
                    { label:"运行",data: [], yaxis:1,color:"#2ECC40"  },
                    {label:"占用", data: [], yaxis:1 ,color:"#0074D9" }];
            
          for (var i = 0; i < 10; i += 1) {
            // console.log(i);
              var v1 = Math.abs(Math.sin( Math.random(i)))
                $scope.dataset2[0].data.push([i, v1]);
              var v2 = Math.abs(Math.sin(i+Math.random(1)))
                $scope.dataset2[1].data.push([i, v2]);
              var v3 =  Math.abs(Math.sin(i+1+Math.random(2)))
                $scope.dataset2[2].data.push([i,v3]);
              var v4 = Math.abs(Math.sin(i+2+Math.random(3)))
                $scope.dataset2[3].data.push([i, v4]);
              
            //   $scope.dataset[4].data.push([i, 3.5-v1-v2-v3-v4]);
          }      

          
                $scope.$apply(  )
         // plot.draw()
          //console.log(1);
          
          for(var j=0 ;j<7; j++){
           $scope.photos[j].data = Math.round(100*Math.random(100));
         }
         
         moment.locale('zh');
          $scope.current_time = moment().format('dddd, YYYY-MM-DD, h:mm:ss a');//    "2014-08-27 13:42";
          setTimeout(update, 4000)
      }
      
      update()
                
         

    },
 


]);