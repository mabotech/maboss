'use strict';
/* Main */
function CViewCtrl($scope, $routeParams, $http, $timeout, $location) {
  $scope.header = {
    name: 'header.html',
    url: 'template/main_header.html'
  };
  $scope.left_navbar = {
    name: 'navbar.html',
    url: 'template/left_navbar.html'
  };
  $scope.years = [2010, 2011, 2012, 2013, 2014, 2015];
  //var loc = $location;
  $scope.menu = function () {
    angular.element("#ln05").addClass("active");
  }
  $scope.data_type = 1;
  $scope.get_class = function (val) {
    if (val == $scope.data_type) {
      return "btn btn-primary";
    } else {
      return "btn";
    }
  }
  $scope.goto_url = function (url) {
    $location.url(url);
    $scope.$apply(); // cause d3.js  : http://stackoverflow.com/questions/13054944/location-not-working-in-angular-using-d3-js
  }
  $scope.goto_month = function (year, month) {
    //alert(year+"-"+month);
    month=month+1;
    if(month<10){
      month="0"+month;
    }
    var url = "/avl_report/#/monthlogevents/" + year + "-" +month;
    //gotourl(url);
    // alert(d);
    window.open(url, '_self').focus();
  }
  /* ========================= d3 =========================*/
  var width = 880,
    height = 136,
    cellSize = 13; // cell size
  var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".2%"),
    format = d3.time.format("%Y-%m-%d");
  var color = d3.scale.quantize().domain([0, 100]).range(d3.range(11).map(function (d) {
    return "q" + (10 - d) + "-11";
  }));
  var svg = d3.select(".calendar").selectAll("svg").data(d3.range(2010, 2015)).enter().append("svg").attr("width", width).attr("height", height).attr("class", "RdYlGn").append("g").attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
  svg.append("text").attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)").style("text-anchor", "middle").text(function (d) {
    return d;
  }).style("cursor", "pointer").on("click", function (d) {
    alert(d)
  });
  svg.append("text").attr("transform", "translate(" + (5 + cellSize * 53) + "," + cellSize * 1.7 + ")")
  //.style("text-anchor", "middle")
  .text(function (d) {
    return 'M';
  })
  svg.append("text").attr("transform", "translate(" + (5 + cellSize * 53) + "," + cellSize * 3.7 + ")")
  //.style("text-anchor", "middle")
  .text(function (d) {
    return 'W';
  })
  svg.append("text").attr("transform", "translate(" + (5 + cellSize * 53) + "," + cellSize * 5.7 + ")")
  //.style("text-anchor", "middle")
  .text(function (d) {
    return 'F';
  })
  var rect = svg.selectAll(".day").data(function (d) {
    return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
  }).enter().append("rect").attr("class", "day").attr("width", cellSize - 1).attr("height", cellSize - 1).attr("x", function (d) {
    return week(d) * cellSize;
  }).attr("y", function (d) {
    return day(d) * cellSize;
  }).datum(format);
  //.style("cursor", "pointer")
  //.on("click", function(d) {
  // alert(d);
  //window.open("http://www.stackoverflow.com/?"+d, '_blank').focus();
  //  });
  //.on("mouseover",tip.show) 
  //.on('mouseout', tip.hide);
  rect.append("title").text(function (d) {
    return d;
  });
  svg.selectAll(".month").data(function (d) {
    return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
  }).enter().append("path").attr("class", "month").attr("d", monthPath);
  d3.csv("avl.csv", function (error, csv) {
    var data = d3.nest().key(function (d) {
      return d.Date;
    }).rollup(function (d) {
      return d[0].Running / d[0].Total;
    }) // value
    .map(csv);
    var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
      //console.log(data[d]);
      return '<div><b>' + d + "</b> : " + percent(data[d]) + '</div>'
    }).offset([-12, 0])
    svg.call(tip);
    var rainbow = new Rainbow();
    rainbow.setSpectrum('red', 'yellow', 'green');
    rainbow.setNumberRange(0.0, 1.0);
    rect.filter(function (d) {
      return d in data;
    }).style("fill", function (d) {
      return '#' + rainbow.colourAt(data[d]);
    }).style("cursor", "pointer").on("click", function (d) {
      tip.hide();
      var url = "/daylogevents/" + d;
      $scope.goto_url(url);
      //window.open(url, '_self').focus();
    }).attr("class", function (d) { //class
      //return {"background":"blue"};
      return "day " + color(data[d]);
    }) //color
    .on("mouseover", tip.show).on('mouseout', tip.hide).select("title").text(function (d) {
      return ""; /* d + ": " + percent(data[d]); */
    })
  });
  var month_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var month_text = svg.selectAll(".mt")
  //append("text")
  .data(function (d) {
    return _.map(d3.range(0, 12), function (item) {
      return [d, item]
    });
  }).enter().append("text").attr("x", function (m) {
    return 30 + m[1] * 56;
  }).attr("y", -7).text(function (m) {
    return month_short[m[1]];
  }).style("cursor", "pointer").on("click", function (m) {
    var url = "";
    var month = 1 + m[1];
    if (m[1] < 9) {
      url = "/monthlogevents/" + m[0] + "-0" + month;
    } else {
      url = "/monthlogevents/" + m[0] + "-" + month;
    }
    $scope.goto_url(url);
  });

  function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = +day(t0),
      w0 = +week(t0),
      d1 = +day(t1),
      w1 = +week(t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize + "H" + w0 * cellSize + "V" + 7 * cellSize + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize + "H" + (w1 + 1) * cellSize + "V" + 0 + "H" + (w0 + 1) * cellSize + "Z";
  }
  d3.select(self.frameElement).style("height", "2910px");
  /* ========================= d3 =========================*/
}
CViewCtrl.$inject = ['$scope', '$routeParams', '$http', '$timeout', '$location'];
