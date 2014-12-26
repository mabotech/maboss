angular.module('ReportsApp',
	[
        'ui.bootstrap',
        'angular-flot',
		'ngHandsontable'
	])
	.controller(
		'ReportsCtrl', [
			'$scope',
			function ($scope) {

     			var room = ["室内性能试验室", "室内性能试验室", "室内性能试验室", "环境试验室", "环境试验室", "环境试验室", "结构耐久试验室"];
				var equipments = ["整车里程耐久试验台1#", "整车里程耐久试验台2#", "整车里程耐久试验台3#", 
                        "整车高低温环境舱 \n汽车底盘测功机 \n轻型车排放分析系统 ", "常温间汽车底盘测功机\n轻型车排放分析系统 ", "四驱高温间环境舱\n汽车底盘测功机", "重型车综合性能试验台"];
				var equipmentNos = ["640000-00046", "640000-00045", "640000-00093", "640000-00089\n640000-00090\n640000-00092", "640000-00094\n640000-00092", "", "640000-00096"];

                $scope.realWorkTime = Math.floor(Math.random() * 100000) / 100
                    
				$scope.minSpareRows = 1;
				$scope.colHeaders = true;

				$scope.db = {};
				$scope.db.items = [];
                    
                    
$scope.dataset = [{ data: [], yaxis: 1, label: "计划" }, { data: [], yaxis: 1, label: "实报" }];
$scope.dataset2 = [{ data: [], yaxis: 1, label: "计划" }, { data: [], yaxis: 1, label: "实报" }];
$scope.dataset3 = [{ data: [], yaxis: 1, label: "计划" }, { data: [], yaxis: 1, label: "实报" }];

  $scope.options = {
       hoverable:true,
        shadowSize:2,
    grid: {
          hoverable:true,
                show: true,
                aboveData: true,
                  borderWidth:1,
               color: "#ccc",
            /*      backgroundColor:"#1F1F1F"*/
              },
      series: {
				bars: {
					show: true,
					barWidth: 0.3,
					align: "center"
				}
			},
      yaxis: {
				min: 0,
				max: 6,
                position: "right"
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
  
  
  for (var i = 1; i < 8; i += 1) {
      
    $scope.dataset[0].data.push([i, 1+Math.sin(i)]);
        $scope.dataset[1].data.push([i+0.3, 1+Math.cos(i)]);
      
  }     
  for (var i = 1; i < 8; i += 1) {
      
    $scope.dataset2[0].data.push([i, 1+Math.sin(i+2)]);
        $scope.dataset2[1].data.push([i+0.3, 1+Math.cos(2+i)]);
      
  }  

  for (var i = 1; i < 8; i += 1) {
      
    $scope.dataset3[0].data.push([i, 1+Math.sin(3+i)]);
        $scope.dataset3[1].data.push([i+0.3, 1+Math.cos(3+i)]);
      
  }    
				for (var i = 0; i < 7; i++) {
					$scope.db.items.push(
						{
							id: i + 1,
				 
								room: room[i],
								equipments: equipments[i],
				 
							equipmentNos: equipmentNos[i],
							realWorkTime: Math.floor(Math.random() * 100000) / 100,
							//isActive: Math.floor(Math.random() * products.length) / 2 == 0 ? 'Yes' : 'No',
							planWorkTime: Math.floor(Math.random() *100), 
                            realWorkTime: Math.floor(Math.random() *100) 
						}
					);
				}
                
                console.log(JSON.stringify($scope.db.items));

				$scope.db.dynamicColumns = [
					{
						data: 'id',
						title: 'ID',  width: 30, readOnly: true},
					{
						data: 'room',
						title: '检测试验单位', width: 120,
						readOnly: true
					},
					{
						data: 'equipments',
						title: '设备仪器名称', width: 150,
						readOnly: true
					},
					{data: 'equipmentNos', title: '资源编号', width: 150,readOnly: true},
					{data: 'planWorkTime', title: '计划工时（小时）', width: 100,readOnly: true},
					{data: 'realWorkTime', title:'实报工时（小时）', type: 'numeric', width: 100, readOnly: true}
                    // {data: 'isActive', type: 'checkbox', title: 'Is active', checkedTemplate: 'Yes', uncheckedTemplate: 'No', width:65}
				];
                
                    
                    
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
              /*
              series: {
				stack: stack,
                 /*
					lines: {
						show: lines,
						fill: true,
                        fillColor: { colors: [ { opacity: 0.9 }, { opacity: 0.9 } ] },
						steps: steps
					},
                    * /
					bars: {
						show: bars,
                         lineWidth: 1,
                        fill: true,
						barWidth: 0.5
					}
				}, */
              
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
                    
                    
                /*
				setInterval(function () {
					if( $scope.db.dynamicColumns[0].title == 'ID') {
						$scope.db.dynamicColumns[3].readOnly = true;
						$scope.db.dynamicColumns.shift();
						$scope.afterChange = function () {
//							console.log('afterChange: ','when ID column has been removed');
						};

					} else {
						$scope.db.dynamicColumns[2].readOnly = false;
						$scope.db.dynamicColumns.unshift({data: 'id', title: 'ID'});
						$scope.afterChange = function () {
//							console.log('afterChange: ','when ID column has been added');
						};
					}
					$scope.$apply();
				}, 3000);
                    */
			}
		]
	);