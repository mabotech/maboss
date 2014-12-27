angular.module('ReportsApp', [
    'ui.bootstrap',
    'angular-flot',
    'ngHandsontable'
])
    .controller(
        'ReportsCtrl', [
            '$scope',
            function($scope) {
                
                
                // sheet 1

                var room = ["室内性能试验室", "室内性能试验室", "室内性能试验室", "环境试验室", "环境试验室", "环境试验室", "结构耐久试验室"];
                
                var equipments = ["整车里程耐久试验台1#", "整车里程耐久试验台2#", "整车里程耐久试验台3#",
                    "整车高低温环境舱 \n汽车底盘测功机 \n轻型车排放分析系统 ", "常温间汽车底盘测功机\n轻型车排放分析系统 ", "四驱高温间环境舱\n汽车底盘测功机", "重型车综合性能试验台"
                ];
                
                var equipmentNos = ["640000-00046", "640000-00045", "640000-00093", "640000-00089\n640000-00090\n640000-00092", "640000-00094\n640000-00092", "", "640000-00096"];
                
                var planWorkTime = [8,12,13,4,5,6,7];
                
                 var realWorkTime = [10,8,7,4,5,6,7];
                
                var downtime  = [1,0,0,0,0,0,1];
                
                var sum = 0;
                
                for(var i=0;i<  planWorkTime.length;i++)
                {
                   sum+=realWorkTime[i] / planWorkTime[i];
                }
                
                $scope.average =(100*sum/planWorkTime.length).toFixed(2);
                
                
                var monthlyKPI10 =  [1.1957, 1.3424, 0.9239, 0.9348, 0.8967, 1.0283]
                var monthlyKPI11 =  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
                var monthlyKPI20 =  [1.0, 1.1813, 0.7639, 0.9348, 0.75, 0.8907]
                var monthlyKPI21 =  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
                var monthlyKPI30 =  [1.8261, 1.337, 0.9239, 0.913, 0.8696, 1.113]
                var monthlyKPI31 =  [1.0, 1.0, 1.0, 1.0, 1.0, 0.8571]
                var monthlyKPI40 =  [1.5, 1.6875, 0.9659, 0.9545, 0.9091, 0.786]
                var monthlyKPI41 =  [1.0, 1.0, 1.0, 1.0, 1.0, 0.8667]
                var monthlyKPI50 =  [1.3636, 1.3239, 0.9545, 0.9773, 0.9375, 0.7466]
                var monthlyKPI51 =  [1.0, 1.0, 1.0, 1.0, 1.0, 0.8667]
                var monthlyKPI60 =  [1.5682, 1.3381, 0.9659, 0.9545, 0.9091, 0.7343]
                var monthlyKPI61 =  [1.0, 1.0, 1.0, 1.0, 1.0, 0.8667]
                var monthlyKPI70 =  [1.125, 1.1927, 1.1458, 1.0938, 0.9479, 0.8007]
                var monthlyKPI71 =  [1.0, 1.0, 1.0, 1.0, 1.0, 0.9444]
                var monthlyKPI80 =  [0.7727, 1.1307, 0.9659, 0.9545, 0.9091, 0.808]
                var monthlyKPI81 =  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
                var monthlyKPI90 =  [0.9583, 1.0104, 0.8646, 0.8542, 0.7917, 0.7424]
                var monthlyKPI91 =  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
                var monthlyKPI100 =  [0.9286, 0.8929, 0.9048, 0.8929, 0.8333, 0.7286]
                var monthlyKPI101 =  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
                var monthlyKPI110 =  [0.9886, 0.983, 0.8977, 0.8864, 0.8182, 0.7269]
                var monthlyKPI111 =  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]          
                var monthlyKPI120 =  [0.9886, 0.983, 0.8977, 0.8864, 0.8182, 0.7269]
                var monthlyKPI121 =  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]      
                
                // sheet 2              
                
                
                // sheet 3
                
                //$scope.realWorkTime = Math.floor(Math.random() * 100000) / 100

                $scope.year = 2014;
                $scope.month = 12;
                
                $scope.minSpareRows = 1;
                $scope.colHeaders = true;

                $scope.db = {};
                $scope.db.items = [];
                
                // flot  dataset
                $scope.dataset = [{
                    data: [],
                    yaxis: 1,
                    label: "计划"
                }, {
                    data: [],
                    yaxis: 1,
                    label: "实报"
                }];
                $scope.dataset2 = [{
                    data: [],
                    yaxis: 1,
                    label: "计划"
                }, {
                    data: [],
                    yaxis: 1,
                    label: "实报"
                }];
                // dataset 3
                $scope.dataset3 = [{
                    data: [],
                    yaxis: 1,
                    label: "耐久1#"
                }, {
                    data: [],
                    yaxis: 1,
                    label: "耐久2#"
                }, {
                    data: [],
                    yaxis: 1,
                    label: "耐久3#"
                }];

                // flot options
                $scope.options = {
                    hoverable: true,
                    shadowSize: 2,
                    grid: {
                        hoverable: true,
                        show: true,
                        aboveData: true,
                        borderWidth: 1,
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
                        max: 16,
                        position: "right"
                    },
                    xaxis: {
                        show: true
                    },
                    legend: {
                        show: true,
                        noColumns: 5,
                        position: "ne",
                        backgroundColor: "#FFF",
                        backgroundOpacity: 0.6
                    }
                }; // End of flot options

                for (var i = 1; i < 8; i += 1) {

                    $scope.dataset[0].data.push([i, planWorkTime[i-1]]);
                    $scope.dataset[1].data.push([i + 0.3, realWorkTime[i-1]]);

                }
                
                var utilization = [1.25,0.6666666666666666,0.5384615384615384,1,1,1,1];
                
                for (var i = 1; i < 8; i += 1) {

                    $scope.dataset2[0].data.push([i, planWorkTime[i-1]]);
                    $scope.dataset2[1].data.push([i + 0.3, realWorkTime[i-1]]);
                    $scope.dataset2[3].data.push([i , utilization[i]]);

                }

                for (var i = 1; i < 13; i += 1) {

                    $scope.dataset3[0].data.push([i, 5+Math.sin(3*i)]);
                    $scope.dataset3[1].data.push([i , 4+Math.cos(i*2)]);
                     $scope.dataset3[2].data.push([i, 2+i/2+Math.cos(i*3)]);

                }
                for (var i = 0; i < 7; i++) {
                    $scope.db.items.push({
                        
                        id: i + 1,
                        
                        room: room[i],
                        equipments: equipments[i],
                        equipmentNos: equipmentNos[i],
                        equipmentType:"检测系统",
                        planWorkTime: planWorkTime[i],
                        realWorkTime: realWorkTime[i],
                        utilRate: realWorkTime[i] / planWorkTime[i],  //.toFixed(2) 
                        downtime :downtime[i],
                        operation1 :monthlyKPI10[i] || 0,
                        perfectness1:monthlyKPI11[i] || 0,
                        operation2:monthlyKPI20[i] || 0,
                        perfectness2:monthlyKPI21[i] || 0,
                        operation3:monthlyKPI30[i] || 0,
                        perfectness3:monthlyKPI31[i] || 0,
                        operation4:monthlyKPI40[i] || 0,
                        perfectness4:monthlyKPI41[i] || 0,
                        operation5:monthlyKPI50[i] || 0,
                        perfectness5:monthlyKPI51[i] || 0,
                        operation6:monthlyKPI60[i] || 0,
                        perfectness6:monthlyKPI61[i] || 0,
                        operation7:monthlyKPI70[i] || 0,
                        perfectness7:monthlyKPI71[i] || 0,
                        operation8:monthlyKPI80[i] || 0,
                        perfectness8:monthlyKPI81[i] || 0,
                        operation9:monthlyKPI90[i] || 0,
                        perfectness9:monthlyKPI91[i] || 0,
                        operation10:monthlyKPI100[i] || 0,
                        perfectness10:monthlyKPI101[i] || 0,
                        operation11:monthlyKPI110[i] || 0,
                        perfectness11:monthlyKPI111[i] || 0,
                        operation12:monthlyKPI120[i] || 0,
                        perfectness12:monthlyKPI121[i] || 0,                        
                        note:""
                    });
                }

                //console.log(JSON.stringify($scope.db.items));
                
                // grid
                $scope.db.dynamicColumns = [{
                        data: 'id',
                        title: 'ID',
                        width: 30,
                        readOnly: true
                    }, {
                        data: 'room',
                        title: '检测试验单位',
                        width: 120,
                        readOnly: true
                    }, {
                        data: 'equipments',
                        title: '设备仪器名称',
                        width: 150,
                        readOnly: true
                    }, {
                        data: 'equipmentNos',
                        title: '资源编号',
                        width: 150,
                        readOnly: true
                    }, {
                        data: 'planWorkTime',
                        title: '计划工时（小时）',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'realWorkTime',
                        title: '实报工时（小时）',
                        type: 'numeric',
                        width: 100,
                        readOnly: true
                    }
                ]; // End of grid defination
                    

                // grid
                $scope.db.dynamicColumns2 = [{
                        data: 'id',
                        title: 'ID',
                        width: 30,
                        readOnly: true
                    }, {
                        data: 'room',
                        title: '检测试验单位',
                        width: 120,
                        readOnly: true
                    }, {
                        data: 'equipments',
                        title: '设备仪器名称',
                        width: 150,
                        readOnly: true
                    }, {
                        data: 'equipmentNos',
                        title: '资产编号<br/>Resources No',
                        width: 150,
                        readOnly: true
                    }, {
                        data: 'equipmentType',
                        title: '类别',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'planWorkTime',
                        title: '计划工时（小时）',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'realWorkTime',
                        title: '实报工时（小时）',
                        type: 'numeric',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'utilRate',
                        title: '设备利用率(%)',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'downtime',
                        title: '停工时间<br/>(小时)',
                        type: 'numeric',
                        //format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'note',
                        title: '备注',
                        //format: '0.00%',
                        width: 100,
                        readOnly: false
                    }
                ]; // End of grid defination                    
                    

// grid
                $scope.db.dynamicColumns3 = [{
                        data: 'id',
                        title: 'ID',
                        width: 30,
                        readOnly: true
                    }, {
                        data: 'room',
                        title: '试验室名称',
                        width: 120,
                        readOnly: true
                    }, {
                        data: 'equipments',
                        title: '主要仪器设备名称',
                        width: 150,
                        readOnly: true
                    }, {
                        data: 'equipmentNos',
                        title: '资产编号<br/>Resources No',
                        width: 150,
                        readOnly: true
                    }, {
                        data: 'equipmentType',
                        title: '类别',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'planWorkTime',
                        title: '计划工时（小时）',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'realWorkTime',
                        title: '实报工时（小时）',
                        type: 'numeric',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'utilRate',
                        title: '设备利用率(%)',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'downtime',
                        title: '停工时间<br/>(小时)',
                        type: 'numeric',
                        //format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'operation1',
                        title: '1月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness1',
                        title: '1月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'operation2',
                        title: '2月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness2',
                        title: '2月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'operation3',
                        title: '3月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness3',
                        title: '3月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'operation4',
                        title: '4月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness4',
                        title: '4月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'operation5',
                        title: '5月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness5',
                        title: '5月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'operation6',
                        title: '6月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness6',
                        title: '6月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    }, {
                        data: 'operation7',
                        title: '7月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness7',
                        title: '7月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'operation8',
                        title: '8月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness8',
                        title: '8月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'operation9',
                        title: '9月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness9',
                        title: '9月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'operation10',
                        title: '10月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness10',
                        title: '10月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'operation11',
                        title: '11月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness11',
                        title: '11月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'operation12',
                        title: '12月<br/>运转率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'perfectness12',
                        title: '12月<br/>完好率',
                        type: 'numeric',
                        format: '0.00%',
                        width: 100,
                        readOnly: true
                    },{
                        data: 'note',
                        title: '备注',
                        //format: '0.00%',
                        width: 100,
                        readOnly: false
                    }
                ]; // End of grid defination                          
                    
                //flot options
                $scope.options3 = {

                    hoverable: true,
                    shadowSize: 2,
                    grid: {
                        show: true,
                        aboveData: true,
                        borderWidth: 0,
                        color: "#444444"
                        //backgroundColor: "#1F1F1F"
                    },
                    yaxis: {
                        min: 0,
                        max: 13.51
                    },
                    xaxis: {
                        show: true
                    },
                    legend: {
                        show: true,
                        noColumns: 5,
                        position: "ne",
                        backgroundColor: "#FFF",
                        backgroundOpacity: 0.6
                    }
                }; // End of flot options
            }
        ]
);
