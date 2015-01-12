define('components/partials', ['angular'], function(angular) { 
angular.module('grafana').run(['$templateCache', function($templateCache) { 
  'use strict';

  $templateCache.put('app/features/annotations/partials/editor.html',
    "<div ng-controller=\"AnnotationsEditorCtrl\" ng-init=\"init()\">\n" +
    "\n" +
    "\t<div class=\"dashboard-editor-header\">\n" +
    "\t\t<div class=\"dashboard-editor-title\">\n" +
    "\t\t\t<i class=\"icon icon-bolt\"></i>\n" +
    "\t\t\tAnnotations\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div ng-model=\"editor.index\" bs-tabs style=\"text-transform:capitalize;\">\n" +
    "\t\t\t<div ng-repeat=\"tab in ['Overview', 'Add', 'Edit']\" data-title=\"{{tab}}\">\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"dashboard-editor-body\">\n" +
    "\t\t<div class=\"editor-row row\" ng-if=\"editor.index == 0\">\n" +
    "\t\t\t<div class=\"span6\">\n" +
    "\t\t\t\t<div ng-if=\"annotations.length === 0\">\n" +
    "\t\t\t\t\t<em>No annotations defined</em>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<table class=\"grafana-options-table\">\n" +
    "\t\t\t\t\t<tr ng-repeat=\"annotation in annotations\">\n" +
    "\t\t\t\t\t\t<td style=\"width:90%\">\n" +
    "\t\t\t\t\t\t\t<i class=\"icon-bolt\"></i> &nbsp;\n" +
    "\t\t\t\t\t\t\t{{annotation.name}}\n" +
    "\t\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t\t<td style=\"width: 1%\">\n" +
    "\t\t\t\t\t\t\t<a ng-click=\"edit(annotation)\" class=\"btn btn-success btn-mini\">\n" +
    "\t\t\t\t\t\t\t\t<i class=\"icon-edit\"></i>\n" +
    "\t\t\t\t\t\t\t\tEdit\n" +
    "\t\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t\t<td style=\"width: 1%\"><i ng-click=\"_.move(annotations,$index,$index-1)\" ng-hide=\"$first\" class=\"pointer icon-arrow-up\"></i></td>\n" +
    "\t\t\t\t\t\t<td style=\"width: 1%\"><i ng-click=\"_.move(annotations,$index,$index+1)\" ng-hide=\"$last\" class=\"pointer icon-arrow-down\"></i></td>\n" +
    "\t\t\t\t\t\t<td style=\"width: 1%\">\n" +
    "\t\t\t\t\t\t\t<a ng-click=\"removeAnnotation(annotation)\" class=\"btn btn-danger btn-mini\">\n" +
    "\t\t\t\t\t\t\t\t<i class=\"icon-remove\"></i>\n" +
    "\t\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t</tr>\n" +
    "\t\t\t\t</table>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div ng-if=\"editor.index == 1 || (editor.index == 2 && !currentIsNew)\">\n" +
    "\t\t\t<div class=\"editor-row\">\n" +
    "\t\t\t\t<div class=\"editor-option\">\n" +
    "\t\t\t\t\t<label class=\"small\">Name</label>\n" +
    "\t\t\t\t\t<input type=\"text\" class=\"input-medium\" ng-model='currentAnnotation.name' placeholder=\"name\"></input>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"editor-option\">\n" +
    "\t\t\t\t\t<label class=\"small\">Datasource</label>\n" +
    "\t\t\t\t\t<select ng-model=\"currentAnnotation.datasource\" ng-options=\"f.name as f.name for f in datasources\" ng-change=\"datasourceChanged()\"></select>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"editor-option\">\n" +
    "\t\t\t\t\t<label class=\"small\">Icon color</label>\n" +
    "\t\t\t\t\t<spectrum-picker ng-model=\"currentAnnotation.iconColor\"></spectrum-picker>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"editor-option\">\n" +
    "\t\t\t\t\t<label class=\"small\">Icon size</label>\n" +
    "\t\t\t\t\t<select class=\"input-mini\" ng-model=\"currentAnnotation.iconSize\" ng-options=\"f for f in [7,8,9,10,13,15,17,20,25,30]\"></select>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<editor-opt-bool text=\"Grid line\" model=\"currentAnnotation.showLine\"></editor-opt-bool>\n" +
    "\t\t\t\t<div class=\"editor-option\">\n" +
    "\t\t\t\t\t<label class=\"small\">Line color</label>\n" +
    "\t\t\t\t\t<spectrum-picker ng-model=\"currentAnnotation.lineColor\"></spectrum-picker>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div ng-include src=\"currentDatasource.editorSrc\">\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"dashboard-editor-footer\">\n" +
    "\t\t<button ng-show=\"editor.index === 1\" type=\"button\" class=\"btn btn-success\" ng-click=\"add()\">Add</button>\n" +
    "\t\t<button ng-show=\"editor.index === 2\" type=\"button\" class=\"btn btn-success pull-left\" ng-click=\"update();\">Update</button>\n" +
    "\t\t<button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"close_edit();dismiss();dashboard.refresh();\">Close</button>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/features/elasticsearch/partials/annotations.editor.html',
    "<div class=\"editor-row\">\n" +
    "\t<div class=\"section\">\n" +
    "\t\t<h5>Index name</h5>\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<input type=\"text\" class=\"span4\" ng-model='currentAnnotation.index' placeholder=\"events-*\"></input>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"section\">\n" +
    "\t\t<h5>Search query (lucene) <tip>Use [[filterName]] in query to replace part of the query with a filter value</h5>\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<input type=\"text\" class=\"span6\" ng-model='currentAnnotation.query' placeholder=\"tags:deploy\"></input>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"editor-row\">\n" +
    "  <div class=\"section\">\n" +
    "\t\t<h5>Field mappings</h5>\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<label class=\"small\">Time</label>\n" +
    "\t\t\t<input type=\"text\" class=\"input-small\" ng-model='currentAnnotation.timeField' placeholder=\"@timestamp\"></input>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<label class=\"small\">Title</label>\n" +
    "\t\t\t<input type=\"text\" class=\"input-small\" ng-model='currentAnnotation.titleField' placeholder=\"desc\"></input>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<label class=\"small\">Tags</label>\n" +
    "\t\t\t<input type=\"text\" class=\"input-small\" ng-model='currentAnnotation.tagsField' placeholder=\"tags\"></input>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<label class=\"small\">Text</label>\n" +
    "\t\t\t<input type=\"text\" class=\"input-small\" ng-model='currentAnnotation.textField' placeholder=\"\"></input>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/features/graphite/partials/annotations.editor.html',
    "<div class=\"editor-row\">\n" +
    "\t<div class=\"editor-option\">\n" +
    "\t\t<label class=\"small\">Graphite target expression</label>\n" +
    "\t\t<input type=\"text\" class=\"span10\" ng-model='currentAnnotation.target' placeholder=\"\"></input>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"editor-row\">\n" +
    "\t<div class=\"editor-option\">\n" +
    "\t\t<label class=\"small\">Graphite event tags</label>\n" +
    "\t\t<input type=\"text\" ng-model='currentAnnotation.tags' placeholder=\"\"></input>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('app/features/graphite/partials/query.editor.html',
    "<div class=\"editor-row\">\n" +
    "\n" +
    "\t<div  ng-repeat=\"target in panel.targets\"\n" +
    "        class=\"grafana-target\"\n" +
    "        ng-class=\"{'grafana-target-hidden': target.hide}\"\n" +
    "        ng-controller=\"GraphiteQueryCtrl\"\n" +
    "        ng-init=\"init()\">\n" +
    "\n" +
    "    <div class=\"grafana-target-inner\">\n" +
    "      <ul class=\"grafana-target-controls\">\n" +
    "        <li ng-show=\"parserError\">\n" +
    "          <a bs-tooltip=\"parserError\" style=\"color: rgb(229, 189, 28)\" role=\"menuitem\">\n" +
    "            <i class=\"icon icon-warning-sign\"></i>\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "          <a class=\"pointer\" tabindex=\"1\" ng-click=\"showTextEditor = !showTextEditor\">\n" +
    "            <i class=\"icon icon-pencil\"></i>\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li class=\"dropdown\">\n" +
    "          <a  class=\"pointer dropdown-toggle\"\n" +
    "              data-toggle=\"dropdown\"\n" +
    "              tabindex=\"1\">\n" +
    "            <i class=\"icon icon-cog\"></i>\n" +
    "          </a>\n" +
    "          <ul class=\"dropdown-menu pull-right\" role=\"menu\">\n" +
    "            <li role=\"menuitem\">\n" +
    "              <a  tabindex=\"1\"\n" +
    "                  ng-click=\"duplicate()\">\n" +
    "                Duplicate\n" +
    "              </a>\n" +
    "            </li>\n" +
    "\t\t\t\t\t\t<li role=\"menuitem\">\n" +
    "              <a  tabindex=\"1\"\n" +
    "                  ng-click=\"moveMetricQuery($index, $index-1)\">\n" +
    "                Move up\n" +
    "              </a>\n" +
    "            </li>\n" +
    "\t\t\t\t\t\t<li role=\"menuitem\">\n" +
    "\t\t\t\t\t\t\t<a  tabindex=\"1\"\n" +
    "                  ng-click=\"moveMetricQuery($index, $index+1)\">\n" +
    "                Move down\n" +
    "              </a>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "          <a class=\"pointer\" tabindex=\"1\" ng-click=\"removeDataQuery(target)\">\n" +
    "            <i class=\"icon icon-remove\"></i>\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <ul class=\"grafana-segment-list\">\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\" style=\"min-width: 15px; text-align: center\">\n" +
    "\t\t\t\t\t{{targetLetters[$index]}}\n" +
    "        </li>\n" +
    "        <li>\n" +
    "          <a  class=\"grafana-target-segment\"\n" +
    "              ng-click=\"target.hide = !target.hide; get_data();\"\n" +
    "              role=\"menuitem\">\n" +
    "            <i class=\"icon-eye-open\"></i>\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <input  type=\"text\"\n" +
    "              class=\"grafana-target-text-input span10\"\n" +
    "              ng-model=\"target.target\"\n" +
    "              focus-me=\"showTextEditor\"\n" +
    "              spellcheck='false'\n" +
    "              ng-model-onblur ng-change=\"targetTextChanged()\"\n" +
    "              ng-show=\"showTextEditor\" />\n" +
    "\n" +
    "      <ul class=\"grafana-segment-list\" role=\"menu\" ng-hide=\"showTextEditor\">\n" +
    "        <li ng-repeat=\"segment in segments\" role=\"menuitem\" graphite-segment></li>\n" +
    "\t\t\t\t<li ng-repeat=\"func in functions\">\n" +
    "          <span graphite-func-editor class=\"grafana-target-segment grafana-target-function\">\n" +
    "          </span>\n" +
    "        </li>\n" +
    "        <li class=\"dropdown\" graphite-add-func>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      <div class=\"clearfix\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<section class=\"grafana-metric-options\">\n" +
    "\t<div class=\"grafana-target\">\n" +
    "\t\t<div class=\"grafana-target-inner\">\n" +
    "\t\t\t<ul class=\"grafana-segment-list\">\n" +
    "\t\t\t\t<li class=\"grafana-target-segment grafana-target-segment-icon\">\n" +
    "\t\t\t\t\t<i class=\"icon-wrench\"></i>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\tCache timeout\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li>\n" +
    "\t\t\t\t\t<input type=\"text\"\n" +
    "\t\t\t\t\t\t\t\tclass=\"input-mini grafana-target-segment-input\"\n" +
    "\t\t\t\t\t\t\t\tng-model=\"panel.cacheTimeout\"\n" +
    "\t\t\t\t\t\t\t\tbs-tooltip=\"'Graphite parameter to override memcache default timeout (unit is seconds)'\"\n" +
    "\t\t\t\t\t\t\t\tdata-placement=\"right\"\n" +
    "\t\t\t\t\t\t\t\tspellcheck='false'\n" +
    "\t\t\t\t\t\t\t\tplaceholder=\"60\">\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\tMax data points\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li>\n" +
    "\t\t\t\t\t<input type=\"text\"\n" +
    "\t\t\t\t\t\t\t\tclass=\"input-mini grafana-target-segment-input\"\n" +
    "\t\t\t\t\t\t\t\tng-model=\"panel.maxDataPoints\"\n" +
    "\t\t\t\t\t\t\t\tbs-tooltip=\"'Override max data points, automatically set to graph width in pixels.'\"\n" +
    "\t\t\t\t\t\t\t\tdata-placement=\"right\"\n" +
    "\t\t\t\t\t\t\t\tng-model-onblur ng-change=\"get_data()\"\n" +
    "\t\t\t\t\t\t\t\tspellcheck='false'\n" +
    "\t\t\t\t\t\t\t\tplaceholder=\"auto\">\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t\t<div class=\"clearfix\"></div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"grafana-target-inner\">\n" +
    "\t\t\t<ul class=\"grafana-segment-list\">\n" +
    "\t\t\t\t<li class=\"grafana-target-segment grafana-target-segment-icon\">\n" +
    "\t\t\t\t\t<i class=\"icon-info-sign\"></i>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t<a ng-click=\"toggleEditorHelp(1);\" bs-tooltip=\"'click to show helpful info'\" data-placement=\"bottom\">\n" +
    "\t\t\t\t\t\tshorter legend names\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t<a ng-click=\"toggleEditorHelp(2);\" bs-tooltip=\"'click to show helpful info'\" data-placement=\"bottom\">\n" +
    "\t\t\t\t\t\tseries as parameters\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t<a ng-click=\"toggleEditorHelp(3)\" bs-tooltip=\"'click to show helpful info'\" data-placement=\"bottom\">\n" +
    "\t\t\t\t\t\tstacking\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t<a ng-click=\"toggleEditorHelp(4)\" bs-tooltip=\"'click to show helpful info'\" data-placement=\"bottom\">\n" +
    "\t\t\t\t\t\ttemplating\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t<a ng-click=\"toggleEditorHelp(5)\" bs-tooltip=\"'click to show helpful info'\" data-placement=\"bottom\">\n" +
    "\t\t\t\t\t\tmax data points\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t\t<div class=\"clearfix\"></div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    " </div>\n" +
    "</section>\n" +
    "\n" +
    "<div class=\"editor-row\">\n" +
    "\t<div class=\"pull-left\" style=\"margin-top: 30px;\">\n" +
    "\n" +
    "\t\t<div class=\"grafana-info-box span8\" ng-if=\"editorHelpIndex === 1\">\n" +
    "\t\t\t<h5>Shorter legend names</h5>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>alias() function to specify a custom series name</li>\n" +
    "\t\t\t\t<li>aliasByNode(2) to alias by a specific part of your metric path</li>\n" +
    "\t\t\t\t<li>aliasByNode(2, -1) you can add multiple segment paths, and use negative index</li>\n" +
    "\t\t\t\t<li>groupByNode(2, 'sum') is useful if you have 2 wildcards in your metric path and want to sumSeries and group by</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"grafana-info-box span8\" ng-if=\"editorHelpIndex === 2\">\n" +
    "\t\t\t<h5>Series as parameter</h5>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>Some graphite functions allow you to have many series arguments</li>\n" +
    "\t\t\t\t<li>Use #[A-Z] to use a graphite query as parameter to a function</li>\n" +
    "\t\t\t\t<li>\n" +
    "\t\t\t\t\tExamples:\n" +
    "\t\t\t\t\t<ul>\n" +
    "\t\t\t\t\t\t<li>asPercent(#A, #B)</li>\n" +
    "\t\t\t\t\t\t<li>prod.srv-01.counters.count - asPercent(#A) : percentage of count in comparison with A query</li>\n" +
    "\t\t\t\t\t\t<li>prod.srv-01.counters.count - sumSeries(#A) : sum count and series A </li>\n" +
    "\t\t\t\t\t\t<li>divideSeries(#A, #B)</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li>If a query is added only to be used as a parameter, hide it from the graph with the eye icon</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"grafana-info-box span6\" ng-if=\"editorHelpIndex === 3\">\n" +
    "\t\t\t<h5>Stacking</h5>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>You find the stacking option under Display Styles tab</li>\n" +
    "\t\t\t\t<li>When stacking is enabled make sure null point mode is set to 'null as zero'</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"grafana-info-box span6\" ng-if=\"editorHelpIndex === 4\">\n" +
    "\t\t\t<h5>Templating</h5>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>You can use a template variable in place of metric names</li>\n" +
    "\t\t\t\t<li>You can use a template variable in place of function parameters</li>\n" +
    "\t\t\t\t<li>You enable the templating feature in Dashboard settings / Feature toggles </li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"grafana-info-box span6\" ng-if=\"editorHelpIndex === 5\">\n" +
    "\t\t\t<h5>Max data points</h5>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>Every graphite request is issued with a maxDataPoints parameter</li>\n" +
    "\t\t\t\t<li>Graphite uses this parameter to consolidate the real number of values down to this number</li>\n" +
    "\t\t\t\t<li>If there are more real values, then by default they will be consolidated using averages</li>\n" +
    "\t\t\t\t<li>This could hide real peaks and max values in your series</li>\n" +
    "\t\t\t\t<li>You can change how point consolidation is made using the consolidateBy graphite function</li>\n" +
    "\t\t\t\t<li>Point consolidation will effect series legend values (min,max,total,current)</li>\n" +
    "\t\t\t\t<li>If you override maxDataPoint and set a high value performance can be severely effected</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/features/influxdb/partials/annotations.editor.html',
    "<div class=\"editor-row\">\n" +
    "\t<div class=\"section\">\n" +
    "\t\t<h5>InfluxDB Query <tip>Example: select text from events where $timeFilter</tip></h5>\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<input type=\"text\" class=\"span10\" ng-model='currentAnnotation.query' placeholder=\"select text from events where $timeFilter\"></input>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"editor-row\">\n" +
    "  <div class=\"section\">\n" +
    "\t\t<h5>Column mappings <tip>If your influxdb query returns more than one column you need to specify the column names bellow. An annotation event is composed of a title, tags, and an additional text field.</tip></h5>\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<label class=\"small\">Title</label>\n" +
    "\t\t\t<input type=\"text\" class=\"input-small\" ng-model='currentAnnotation.titleColumn' placeholder=\"\"></input>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<label class=\"small\">Tags</label>\n" +
    "\t\t\t<input type=\"text\" class=\"input-small\" ng-model='currentAnnotation.tagsColumn' placeholder=\"\"></input>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"editor-option\">\n" +
    "\t\t\t<label class=\"small\">Text</label>\n" +
    "\t\t\t<input type=\"text\" class=\"input-small\" ng-model='currentAnnotation.textColumn' placeholder=\"\"></input>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('app/features/influxdb/partials/query.editor.html',
    "<div class=\"editor-row\">\n" +
    "\n" +
    "  <div  ng-repeat=\"target in panel.targets\"\n" +
    "        class=\"grafana-target\"\n" +
    "        ng-class=\"{'grafana-target-hidden': target.hide}\"\n" +
    "        ng-controller=\"InfluxQueryCtrl\"\n" +
    "        ng-init=\"init()\">\n" +
    "\n" +
    "    <div class=\"grafana-target-inner-wrapper\">\n" +
    "      <div class=\"grafana-target-inner\">\n" +
    "        <ul class=\"grafana-target-controls\">\n" +
    "          <li class=\"dropdown\">\n" +
    "            <a class=\"pointer dropdown-toggle\"\n" +
    "               data-toggle=\"dropdown\"\n" +
    "               tabindex=\"1\">\n" +
    "              <i class=\"icon icon-cog\"></i>\n" +
    "            </a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu pull-right\" role=\"menu\">\n" +
    "\t\t\t\t\t\t\t<li role=\"menuitem\"><a tabindex=\"1\" ng-click=\"duplicate()\">Duplicate</a></li>\n" +
    "\t\t\t\t\t\t\t<li role=\"menuitem\"><a tabindex=\"1\" ng-click=\"showQuery()\" ng-hide=\"target.rawQuery\">Raw query mode</a></li>\n" +
    "\t\t\t\t\t\t\t<li role=\"menuitem\"><a tabindex=\"1\" ng-click=\"hideQuery()\" ng-show=\"target.rawQuery\">Query editor mode</a></li>\n" +
    "\t\t\t\t\t\t\t<li role=\"menuitem\"><a tabindex=\"1\" ng-click=\"moveMetricQuery($index, $index-1)\">Move up </a></li>\n" +
    "\t\t\t\t\t\t\t<li role=\"menuitem\"><a tabindex=\"1\" ng-click=\"moveMetricQuery($index, $index+1)\">Move down</a></li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<a class=\"pointer\" tabindex=\"1\" ng-click=\"removeDataQuery(target)\">\n" +
    "\t\t\t\t\t\t\t<i class=\"icon icon-remove\"></i>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\n" +
    "\t\t\t\t<ul class=\"grafana-segment-list\">\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<a class=\"grafana-target-segment\" ng-click=\"target.hide = !target.hide; get_data();\" role=\"menuitem\">\n" +
    "\t\t\t\t\t\t\t<i class=\"icon-eye-open\"></i>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "\n" +
    "\t\t\t\t<!-- Raw Query mode  -->\n" +
    "\t\t\t\t<ul class=\"grafana-segment-list\" ng-show=\"target.rawQuery\">\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<input type=\"text\"\n" +
    "               class=\"grafana-target-text-input span10\"\n" +
    "               ng-model=\"target.query\"\n" +
    "               placeholder=\"select ...\"\n" +
    "               focus-me=\"target.rawQuery\"\n" +
    "               spellcheck='false'\n" +
    "               data-min-length=0 data-items=100\n" +
    "               ng-model-onblur\n" +
    "\t\t\t\t\t\t\t ng-blur=\"get_data()\">\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\n" +
    "\t\t\t\t<!-- Query editor mode -->\n" +
    "        <ul class=\"grafana-segment-list\" role=\"menu\" ng-hide=\"target.rawQuery\">\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\tseries\n" +
    "\t\t\t\t\t</li>\n" +
    "          <li>\n" +
    "            <input type=\"text\"\n" +
    "                   class=\"grafana-target-text-input span8\"\n" +
    "                   ng-model=\"target.series\"\n" +
    "                   spellcheck='false'\n" +
    "                   bs-typeahead=\"listSeries\"\n" +
    "                   match-all=\"true\"\n" +
    "                   min-length=\"3\"\n" +
    "                   placeholder=\"series name\"\n" +
    "                   data-min-length=0 data-items=100\n" +
    "                   ng-blur=\"seriesBlur()\">\n" +
    "          </li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\talias\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"input-medium grafana-target-text-input\" ng-model=\"target.alias\"\n" +
    "\t\t\t\t\t\tspellcheck='false' placeholder=\"alias\" ng-blur=\"get_data()\">\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"grafana-target-inner\">\n" +
    "\t\t\t\t<!-- Raw Query mode  -->\n" +
    "\t\t\t\t<ul class=\"grafana-segment-list\" ng-show=\"target.rawQuery\">\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\t<i class=\"icon-eye-open invisible\"></i>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "            alias\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <input type=\"text\"\n" +
    "                   class=\"input-medium grafana-target-text-input\"\n" +
    "                   ng-model=\"target.alias\"\n" +
    "                   spellcheck='false'\n" +
    "                   placeholder=\"alias\"\n" +
    "                   ng-blur=\"get_data()\">\n" +
    "          </li>\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\tgroup by time\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"input-mini grafana-target-text-input\" ng-model=\"target.interval\"\n" +
    "\t\t\t\t\t\t\t\t\t spellcheck='false' placeholder=\"{{interval}}\" data-placement=\"right\"\n" +
    "\t\t\t\t\t\t\t\t\t bs-tooltip=\"'Leave blank for auto handling based on time range and panel width'\"\n" +
    "\t\t\t\t\t\t\t\t\t ng-model-onblur ng-change=\"get_data()\" >\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\n" +
    "\t\t\t\t<!-- Query editor mode -->\n" +
    "        <ul class=\"grafana-segment-list\" role=\"menu\" ng-hide=\"target.rawQuery\">\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\t<i class=\"icon-eye-open invisible\"></i>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\tselect\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<span influxdb-func-editor class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\twhere\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"input-medium grafana-target-text-input\" ng-model=\"target.condition\"\n" +
    "\t\t\t\t\t\t\t\t\t bs-tooltip=\"'Add a where clause'\" data-placement=\"right\" spellcheck='false' placeholder=\"column ~= value\" ng-blur=\"get_data()\">\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\tgroup by time\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"input-mini grafana-target-text-input\" ng-model=\"target.interval\"\n" +
    "\t\t\t\t\t\t\t\t\t spellcheck='false' placeholder=\"{{interval}}\" data-placement=\"right\"\n" +
    "\t\t\t\t\t\t\t\t\t bs-tooltip=\"'Leave blank for auto handling based on time range and panel width'\"\n" +
    "\t\t\t\t\t\t\t\t\t ng-model-onblur ng-change=\"get_data()\" >\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\t\t<i class=\"icon-plus\"></i>\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"input-small grafana-target-text-input\" ng-model=\"target.groupby_field\" bs-tooltip=\"'Add a group by column or leave blank'\"\n" +
    "\t\t\t\t\t\t\t\t\t placeholder=\"column\" spellcheck=\"false\" bs-typeahead=\"listColumns\" data-min-length=0 ng-blur=\"get_data()\">\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<a class=\"grafana-target-segment pointer\" data-toggle=\"dropdown\" bs-tooltip=\"'Insert missing values, important when stacking'\" data-placement=\"right\">\n" +
    "\t\t\t\t\t\t\t<span ng-show=\"target.fill\">\n" +
    "\t\t\t\t\t\t\t\tfill ({{target.fill}})\n" +
    "\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t<span ng-show=\"!target.fill\">\n" +
    "\t\t\t\t\t\t\t\tno fill\n" +
    "\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t  </a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<li><a ng-click=\"target.fill = ''\">no fill</a></li>\n" +
    "\t\t\t\t\t\t\t<li><a ng-click=\"target.fill = 'null'\">fill (null)</a></li>\n" +
    "\t\t\t\t\t\t\t<li><a ng-click=\"target.fill = '0'\">fill (0)</a></li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<section class=\"grafana-metric-options\">\n" +
    "\t<div class=\"grafana-target\">\n" +
    "\t\t<div class=\"grafana-target-inner\">\n" +
    "\t\t\t<ul class=\"grafana-segment-list\">\n" +
    "\t\t\t\t<li class=\"grafana-target-segment grafana-target-segment-icon\">\n" +
    "\t\t\t\t\t<i class=\"icon-wrench\"></i>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\tgroup by time\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li>\n" +
    "\t\t\t\t\t<input type=\"text\" class=\"input-medium grafana-target-text-input\" ng-model=\"panel.interval\" ng-blur=\"get_data();\"\n" +
    "\t\t\t\t\t       spellcheck='false' placeholder=\"example: >10s\">\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t<i class=\"icon-question-sign\" bs-tooltip=\"'Set a low limit by having a greater sign: example: >60s'\" data-placement=\"right\"></i>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t\t<div class=\"clearfix\"></div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"grafana-target-inner\">\n" +
    "\t\t\t<ul class=\"grafana-segment-list\">\n" +
    "\t\t\t\t<li class=\"grafana-target-segment grafana-target-segment-icon\">\n" +
    "\t\t\t\t\t<i class=\"icon-info-sign\"></i>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t<a ng-click=\"toggleEditorHelp(1);\" bs-tooltip=\"'click to show helpful info'\" data-placement=\"bottom\">\n" +
    "\t\t\t\t\t\talias patterns\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t<a ng-click=\"toggleEditorHelp(2)\" bs-tooltip=\"'click to show helpful info'\" data-placement=\"bottom\">\n" +
    "\t\t\t\t\t\tstacking &amp; and fill\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t<a ng-click=\"toggleEditorHelp(3)\" bs-tooltip=\"'click to show helpful info'\" data-placement=\"bottom\">\n" +
    "\t\t\t\t\t\tgroup by time\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t\t<div class=\"clearfix\"></div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</section>\n" +
    "\n" +
    "<div class=\"editor-row\">\n" +
    "\t<div class=\"pull-left\" style=\"margin-top: 30px;\">\n" +
    "\n" +
    "\t\t<div class=\"grafana-info-box span6\" ng-if=\"editorHelpIndex === 1\">\n" +
    "\t\t\t<h5>Alias patterns</h5>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>$s = series name</li>\n" +
    "\t\t\t\t<li>$g = group by</li>\n" +
    "\t\t\t\t<li>$[0-9] part of series name for series names seperated by dots.</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"grafana-info-box span6\" ng-if=\"editorHelpIndex === 2\">\n" +
    "\t\t\t<h5>Stacking and fill</h5>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>When stacking is enabled it important that points align</li>\n" +
    "\t\t\t\t<li>If there are missing points for one series it can cause gaps or missing bars</li>\n" +
    "\t\t\t\t<li>You must use fill(0), and select a group by time low limit</li>\n" +
    "\t\t\t\t<li>Use the group by time option below your queries and specify for example &gt;10s if your metrics are written every 10 seconds</li>\n" +
    "\t\t\t\t<li>This will insert zeros for series that are missing measurements and will make stacking work properly</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"grafana-info-box span6\" ng-if=\"editorHelpIndex === 3\">\n" +
    "\t\t\t<h5>Group by time</h5>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>Group by time is important, otherwise the query could return many thousands of datapoints that will slow down Grafana</li>\n" +
    "\t\t\t\t<li>Leave the group by time field empty for each query and it will be calculated based on time range and pixel width of the graph</li>\n" +
    "\t\t\t\t<li>If you use fill(0) or fill(null) set a low limit for the auto group by time interval</li>\n" +
    "\t\t\t\t<li>The low limit can only be set in the group by time option below your queries</li>\n" +
    "\t\t\t\t<li>You set a low limit by adding a greater sign before the interval</li>\n" +
    "\t\t\t\t<li>Example: &gt;60s if you write metrics to InfluxDB every 60 seconds</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('app/features/opentsdb/partials/query.editor.html',
    "<div class=\"editor-row\" style=\"margin-top: 10px;\">\n" +
    "  <div  ng-repeat=\"target in panel.targets\"\n" +
    "        class=\"grafana-target\"\n" +
    "        ng-class=\"{'grafana-target-hidden': target.hide}\"\n" +
    "        ng-controller=\"OpenTSDBQueryCtrl\"\n" +
    "        ng-init=\"init()\">\n" +
    "\n" +
    "    <div class=\"grafana-target-inner-wrapper\">\n" +
    "      <div class=\"grafana-target-inner\">\n" +
    "        <ul class=\"grafana-target-controls\">\n" +
    "          <li class=\"dropdown\">\n" +
    "            <a  class=\"pointer dropdown-toggle\"\n" +
    "                data-toggle=\"dropdown\"\n" +
    "                tabindex=\"1\">\n" +
    "              <i class=\"icon icon-cog\"></i>\n" +
    "            </a>\n" +
    "            <ul class=\"dropdown-menu pull-right\" role=\"menu\">\n" +
    "              <li role=\"menuitem\">\n" +
    "                <a  tabindex=\"1\"\n" +
    "                    ng-click=\"duplicate()\">\n" +
    "                  Duplicate\n" +
    "                </a>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <a class=\"pointer\" tabindex=\"1\" ng-click=\"removeDataQuery(target)\">\n" +
    "              <i class=\"icon icon-remove\"></i>\n" +
    "            </a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <ul class=\"grafana-segment-list\">\n" +
    "          <li>\n" +
    "            <a  class=\"grafana-target-segment\"\n" +
    "                ng-click=\"target.hide = !target.hide; get_data();\"\n" +
    "                role=\"menuitem\">\n" +
    "              <i class=\"icon-eye-open\"></i>\n" +
    "            </a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <ul class=\"grafana-segment-list\" role=\"menu\">\n" +
    "          <li>\n" +
    "            <input type=\"text\"\n" +
    "                   class=\"grafana-target-segment-input\"\n" +
    "                   ng-model=\"target.metric\"\n" +
    "                   spellcheck='false'\n" +
    "                   bs-typeahead=\"suggestMetrics\"\n" +
    "                   placeholder=\"metric name\"\n" +
    "                   data-min-length=0 data-items=100\n" +
    "                   ng-blur=\"targetBlur()\"\n" +
    "                   >\n" +
    "            <a bs-tooltip=\"target.errors.metric\"\n" +
    "               style=\"color: rgb(229, 189, 28)\"\n" +
    "               ng-show=\"target.errors.metric\">\n" +
    "              <i class=\"icon-warning-sign\"></i>\n" +
    "            </a>\n" +
    "          </li>\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "            Aggregator\n" +
    "          </li>\n" +
    "          <li>\n" +
    "            <select ng-model=\"target.aggregator\"\n" +
    "                    class=\"grafana-target-segment-input input-small\"\n" +
    "                    ng-options=\"agg for agg in aggregators\"\n" +
    "                    ng-change=\"targetBlur()\">\n" +
    "            </select>\n" +
    "            <a bs-tooltip=\"target.errors.aggregator\"\n" +
    "               style=\"color: rgb(229, 189, 28)\"\n" +
    "               ng-show=\"target.errors.aggregator\">\n" +
    "              <i class=\"icon-warning-sign\"></i>\n" +
    "            </a>\n" +
    "          </li>\n" +
    "\n" +
    "          <li class=\"grafana-target-segment\">\n" +
    "              Rate:\n" +
    "              <input type=\"checkbox\"\n" +
    "                     class=\"grafana-target-option-checkbox\"\n" +
    "                     ng-model=\"target.shouldComputeRate\"\n" +
    "                     ng-change=\"targetBlur()\"\n" +
    "                     >\n" +
    "          </li>\n" +
    "          <li class=\"grafana-target-segment\" ng-hide=\"!target.shouldComputeRate\">\n" +
    "            Counter:\n" +
    "            <input type=\"checkbox\"\n" +
    "                   class=\"grafana-target-option-checkbox\"\n" +
    "                   ng-disabled=\"!target.shouldComputeRate\"\n" +
    "                   ng-model=\"target.isCounter\"\n" +
    "                   ng-change=\"targetBlur()\">\n" +
    "          </li>\n" +
    "          <li class=\"grafana-target-segment\" ng-hide=\"!target.isCounter\">\n" +
    "            Counter Max:\n" +
    "          </li>\n" +
    "          <li ng-hide=\"!target.isCounter\">\n" +
    "            <input type=\"text\"\n" +
    "                   class=\"grafana-target-segment-input input-medium\"\n" +
    "                   ng-disabled=\"!target.shouldComputeRate\"\n" +
    "                   ng-model=\"target.counterMax\"\n" +
    "                   spellcheck='false'\n" +
    "                   placeholder=\"Counter max value\"\n" +
    "                   ng-blur=\"targetBlur()\"\n" +
    "                   />\n" +
    "          </li>\n" +
    "          <li class=\"grafana-target-segment\" ng-hide=\"!target.isCounter\">\n" +
    "            Counter Reset Value:\n" +
    "          </li>\n" +
    "          <li ng-hide=\"!target.isCounter\">\n" +
    "            <input type=\"text\"\n" +
    "                   class=\"grafana-target-segment-input input-medium\"\n" +
    "                   ng-disabled=\"!target.shouldComputeRate\"\n" +
    "                   ng-model=\"target.counterResetValue\"\n" +
    "                   spellcheck='false'\n" +
    "                   placeholder=\"Counter reset value\"\n" +
    "                   ng-blur=\"targetBlur()\"\n" +
    "                   />\n" +
    "          </li>\n" +
    "          <li class=\"grafana-target-segment\">\n" +
    "            Alias:\n" +
    "          </li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<input type=\"text\"\n" +
    "                   class=\"grafana-target-segment-input input-medium\"\n" +
    "                   ng-model=\"target.alias\"\n" +
    "                   spellcheck='false'\n" +
    "                   placeholder=\"series alias\"\n" +
    "                   data-min-length=0 data-items=100\n" +
    "                   ng-blur=\"targetBlur()\"\n" +
    "                   />\n" +
    "          </li>\n" +
    "\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"grafana-target-inner\">\n" +
    "        <ul class=\"grafana-segment-list\" role=\"menu\">\n" +
    "\n" +
    "          <li class=\"grafana-target-segment\">\n" +
    "            Downsample:\n" +
    "            <input type=\"checkbox\"\n" +
    "                   class=\"grafana-target-option-checkbox\"\n" +
    "                   ng-model=\"target.shouldDownsample\"\n" +
    "                   ng-change=\"targetBlur(target)\"\n" +
    "                   >\n" +
    "          </li>\n" +
    "\n" +
    "          <li ng-hide=\"!target.shouldDownsample\">\n" +
    "            <input type=\"text\"\n" +
    "                   class=\"input-small grafana-target-segment-input\"\n" +
    "                   ng-disabled=\"!target.shouldDownsample\"\n" +
    "                   ng-model=\"target.downsampleInterval\"\n" +
    "                   ng-change=\"targetBlur()\"\n" +
    "                   placeholder=\"interval\"\n" +
    "                   >\n" +
    "          </li>\n" +
    "\n" +
    "          <li class=\"grafana-target-segment\" ng-hide=\"!target.shouldDownsample\">\n" +
    "            Aggregator\n" +
    "          </li>\n" +
    "\n" +
    "          <li ng-hide=\"!target.shouldDownsample\">\n" +
    "            <select ng-model=\"target.downsampleAggregator\"\n" +
    "                    class=\"grafana-target-segment-input input-small\"\n" +
    "                    ng-options=\"agg for agg in aggregators\"\n" +
    "                    ng-change=\"targetBlur()\">\n" +
    "            </select>\n" +
    "          </li>\n" +
    "\n" +
    "          <li class=\"grafana-target-segment\">\n" +
    "              Tags:\n" +
    "          </li>\n" +
    "          <li ng-repeat=\"(key, value) in target.tags track by $index\" class=\"grafana-target-segment\">\n" +
    "            {{key}}&nbsp;=&nbsp;{{value}}\n" +
    "            <a ng-click=\"removeTag(key)\">\n" +
    "              <i class=\"icon-remove\"></i>\n" +
    "            </a>\n" +
    "          </li>\n" +
    "\n" +
    "          <li class=\"grafana-target-segment\" ng-hide=\"addTagMode\">\n" +
    "            <a ng-click=\"addTag()\">\n" +
    "              <i class=\"icon-plus-sign\"></i>\n" +
    "            </a>\n" +
    "          </li>\n" +
    "\n" +
    "          <li ng-show=\"addTagMode\">\n" +
    "              <input type=\"text\"\n" +
    "                     class=\"input-small grafana-target-segment-input\"\n" +
    "                     spellcheck='false'\n" +
    "                     bs-typeahead=\"suggestTagKeys\"\n" +
    "                     data-min-length=0 data-items=100\n" +
    "                     ng-model=\"target.currentTagKey\"\n" +
    "                     placeholder=\"key\">\n" +
    "              <input type=\"text\"\n" +
    "                     class=\"input-small grafana-target-segment-input\"\n" +
    "                     spellcheck='false'\n" +
    "                     bs-typeahead=\"suggestTagValues\"\n" +
    "                     data-min-length=0 data-items=100\n" +
    "                     ng-model=\"target.currentTagValue\"\n" +
    "                     placeholder=\"value\">\n" +
    "              <a ng-click=\"addTag()\">\n" +
    "                <i class=\"icon-plus-sign\"></i>\n" +
    "              </a>\n" +
    "              <a bs-tooltip=\"target.errors.tags\"\n" +
    "                 style=\"color: rgb(229, 189, 28)\"\n" +
    "                 ng-show=\"target.errors.tags\">\n" +
    "                <i class=\"icon-warning-sign\"></i>\n" +
    "              </a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/features/panellinkeditor/module.html',
    "<div class=\"editor-row\">\n" +
    "  <div class=\"section\">\n" +
    "\t\t<h5>Drilldown / detail link<tip>These links appear in the dropdown menu in the panel menu. </tip></h5>\n" +
    "\n" +
    "\t\t<div class=\"grafana-target\" ng-repeat=\"link in panel.links\"j>\n" +
    "\t\t\t<div class=\"grafana-target-inner\">\n" +
    "\t\t\t\t<ul class=\"grafana-segment-list\">\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">\n" +
    "\t\t\t\t\t\t<i class=\"icon-remove pointer\" ng-click=\"deleteLink(link)\"></i>\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">title</li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"link.title\" class=\"input-medium grafana-target-segment-input\">\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">type</li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<select class=\"input-medium grafana-target-segment-input\" style=\"width: 101px;\" ng-model=\"link.type\" ng-options=\"f for f in ['dashboard','absolute']\"></select>\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\" ng-show=\"link.type === 'dashboard'\">dashboard</li>\n" +
    "\t\t\t\t\t<li ng-show=\"link.type === 'dashboard'\">\n" +
    "\t\t\t\t\t\t<input type=\"text\"\n" +
    "\t\t\t\t\t\t       ng-model=\"link.dashboard\"\n" +
    "\t\t\t\t\t\t\t\t\t bs-typeahead=\"searchDashboards\"\n" +
    "\t\t\t\t\t\t\t\t\t class=\"input-large grafana-target-segment-input\">\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\" ng-show=\"link.type === 'absolute'\">url</li>\n" +
    "\t\t\t\t\t<li ng-show=\"link.type === 'absolute'\">\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"link.url\" class=\"input-large grafana-target-segment-input\">\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li class=\"grafana-target-segment\">params\n" +
    "\t\t\t\t\t\t<tip>Use var-variableName=value to pass templating variables.</tip>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"link.params\" class=\"input-medium grafana-target-segment-input\">\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t\t<div class=\"clearfix\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"editor-row\">\n" +
    "\t<br>\n" +
    "\t<button class=\"btn btn-success\" ng-click=\"addLink()\">Add link</button>\n" +
    "</div>\n"
  );


  $templateCache.put('app/panels/graph/axisEditor.html',
    "<div class=\"editor-row\"><div class=\"section\"><h5>Left Y Axis</h5><div class=\"editor-option\"><label class=\"small\">Format<tip>Y-axis formatting</tip></label><select class=\"input-small\" ng-model=\"panel.y_formats[0]\" ng-options=\"f for f in ['none','short','bytes', 'bits', 'bps', 's', 'ms', 'µs', 'ns', 'percent']\" ng-change=\"render()\"></select></div><div class=\"editor-option\"><label class=\"small\">Min / <a ng-click=\"toggleGridMinMax('leftMin')\">Auto <i class=\"icon-star\" ng-show=\"_.isNull(panel.grid.leftMin)\"></i></a></label><input type=\"number\" class=\"input-small\" ng-model=\"panel.grid.leftMin\" ng-change=\"render()\" ng-model-onblur=\"\"></div><div class=\"editor-option\"><label class=\"small\">Max / <a ng-click=\"toggleGridMinMax('leftMax')\">Auto <i class=\"icon-star\" ng-show=\"_.isNull(panel.grid.leftMax)\"></i></a></label><input type=\"number\" class=\"input-small\" ng-model=\"panel.grid.leftMax\" ng-change=\"render()\" ng-model-onblur=\"\"></div><div class=\"editor-option\"><label class=\"small\">Label</label><input ng-change=\"get_data()\" ng-model-onblur=\"\" placeholder=\"\" type=\"text\" class=\"input-medium\" ng-model=\"panel.leftYAxisLabel\"></div></div><div class=\"section\"><h5>Right Y Axis</h5><div class=\"editor-option\"><label class=\"small\">Format<tip>Y-axis formatting</tip></label><select class=\"input-small\" ng-model=\"panel.y_formats[1]\" ng-options=\"f for f in ['none','short','bytes', 'bits', 'bps', 's', 'ms', 'µs', 'ns', 'percent']\" ng-change=\"render()\"></select></div><div class=\"editor-option\"><label class=\"small\">Min / <a ng-click=\"toggleGridMinMax('rightMin')\">Auto <i class=\"icon-star\" ng-show=\"_.isNull(panel.grid.rightMin)\"></i></a></label><input type=\"number\" class=\"input-small\" ng-model=\"panel.grid.rightMin\" ng-change=\"render()\" ng-model-onblur=\"\"></div><div class=\"editor-option\"><label class=\"small\">Max / <a ng-click=\"toggleGridMinMax('rightMax')\">Auto <i class=\"icon-star\" ng-show=\"_.isNull(panel.grid.rightMax)\"></i></a></label><input type=\"number\" class=\"input-small\" ng-model=\"panel.grid.rightMax\" ng-change=\"render()\" ng-model-onblur=\"\"></div></div></div><div class=\"editor-row\"><div class=\"section\"><h5>Legend styles</h5><editor-opt-bool text=\"Show\" model=\"panel.legend.show\" change=\"get_data();\"></editor-opt-bool><editor-opt-bool text=\"Values\" model=\"panel.legend.values\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Table\" model=\"panel.legend.alignAsTable\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Right side\" model=\"panel.legend.rightSide\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Hide empty\" model=\"panel.legend.hideEmpty\" tip=\"Hides series with only null values\" change=\"render()\"></editor-opt-bool></div><div class=\"section\" ng-if=\"panel.legend.values\"><h5>Legend values</h5><editor-opt-bool text=\"Min\" model=\"panel.legend.min\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Max\" model=\"panel.legend.max\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Current\" model=\"panel.legend.current\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Total\" model=\"panel.legend.total\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Avg\" model=\"panel.legend.avg\" change=\"render()\"></editor-opt-bool></div><div class=\"section\"><h5>Grid thresholds</h5><div class=\"editor-option\"><label class=\"small\">Level1</label><input type=\"number\" class=\"input-small\" ng-model=\"panel.grid.threshold1\" ng-change=\"render()\" ng-model-onblur=\"\"></div><div class=\"editor-option\"><label class=\"small\">Color</label><spectrum-picker ng-model=\"panel.grid.threshold1Color\" ng-change=\"render()\"></spectrum-picker></div><div class=\"editor-option\"><label class=\"small\">Level2</label><input type=\"number\" class=\"input-small\" ng-model=\"panel.grid.threshold2\" ng-change=\"render()\" ng-model-onblur=\"\"></div><div class=\"editor-option\"><label class=\"small\">Color</label><spectrum-picker ng-model=\"panel.grid.threshold2Color\" ng-change=\"render()\"></spectrum-picker></div><editor-opt-bool text=\"Line mode\" model=\"panel.grid.thresholdLine\" change=\"render()\"></editor-opt-bool></div><div class=\"section\"><h5>Show Axes</h5><editor-opt-bool text=\"X-Axis\" model=\"panel['x-axis']\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Y-axis\" model=\"panel['y-axis']\" change=\"render()\"></editor-opt-bool></div></div>"
  );


  $templateCache.put('app/panels/graph/legend.popover.html',
    "<div class=\"graph-legend-popover\"><a class=\"close\" ng-click=\"dismiss();\" href=\"\">×</a><div class=\"editor-row small\" style=\"padding-bottom: 0\"><label>Axis:</label><button ng-click=\"toggleYAxis(series);dismiss();\" class=\"btn btn-mini\" ng-class=\"{'btn-success': series.yaxis === 1 }\">Left</button> <button ng-click=\"toggleYAxis(series);dismiss();\" class=\"btn btn-mini\" ng-class=\"{'btn-success': series.yaxis === 2 }\">Right</button></div><div class=\"editor-row\"><i ng-repeat=\"color in colors\" class=\"pointer\" ng-class=\"{'icon-circle-blank': color === series.color,'icon-circle': color !== series.color}\" ng-style=\"{color:color}\" ng-click=\"changeSeriesColor(series, color);dismiss();\">&nbsp;</i></div></div>"
  );


  $templateCache.put('app/panels/graph/styleEditor.html',
    "<div class=\"editor-row\"><div class=\"section\"><h5>Chart Options</h5><editor-opt-bool text=\"Bars\" model=\"panel.bars\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Lines\" model=\"panel.lines\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Points\" model=\"panel.points\" change=\"render()\"></editor-opt-bool></div><div class=\"section\"><h5>Line options</h5><div class=\"editor-option\" ng-show=\"panel.lines\"><label class=\"small\">Line Fill</label><select class=\"input-mini\" ng-model=\"panel.fill\" ng-options=\"f for f in [0,1,2,3,4,5,6,7,8,9,10]\" ng-change=\"render()\"></select></div><div class=\"editor-option\" ng-show=\"panel.lines\"><label class=\"small\">Line Width</label><select class=\"input-mini\" ng-model=\"panel.linewidth\" ng-options=\"f for f in [0,1,2,3,4,5,6,7,8,9,10]\" ng-change=\"render()\"></select></div><div class=\"editor-option\" ng-show=\"panel.points\"><label class=\"small\">Point Radius</label><select class=\"input-mini\" ng-model=\"panel.pointradius\" ng-options=\"f for f in [1,2,3,4,5,6,7,8,9,10]\" ng-change=\"render()\"></select></div><div class=\"editor-option\"><label class=\"small\">Null point mode<tip>Define how null values should be drawn</tip></label><select class=\"input-medium\" ng-model=\"panel.nullPointMode\" ng-options=\"f for f in ['connected', 'null', 'null as zero']\" ng-change=\"render()\"></select></div><editor-opt-bool text=\"Staircase line\" model=\"panel.steppedLine\" change=\"render()\"></editor-opt-bool></div><div class=\"section\"><h5>Multiple Series</h5><editor-opt-bool text=\"Stack\" model=\"panel.stack\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Percent\" model=\"panel.percentage\" change=\"render()\" tip=\"Stack as a percentage of total\"></editor-opt-bool></div><div class=\"section\"><h5>Rendering</h5><div class=\"editor-option\"><label class=\"small\">Flot<tip>client side</tip></label><input type=\"radio\" class=\"input-small\" ng-model=\"panel.renderer\" value=\"flot\" ng-change=\"get_data()\"></div><div class=\"editor-option\"><label class=\"small\">Graphite PNG<tip>server side</tip></label><input type=\"radio\" class=\"input-small\" ng-model=\"panel.renderer\" value=\"png\" ng-change=\"get_data()\"></div></div><div class=\"section\"><h5>Tooltip</h5><editor-opt-bool text=\"All series\" model=\"panel.tooltip.shared\" change=\"render()\" tip=\"Show all series on same tooltip and a x croshair to help follow all series\"></editor-opt-bool><div class=\"editor-option\" ng-show=\"panel.stack\"><label class=\"small\">Stacked Values<tip>How should the values in stacked charts to be calculated?</tip></label><select class=\"input-small\" ng-model=\"panel.tooltip.value_type\" ng-options=\"f for f in ['cumulative','individual']\" ng-change=\"render()\"></select></div></div></div><div class=\"editor-row\"><div class=\"section\"><h5>Series specific overrides<tip>Regex match example: /server[0-3]/i</tip></h5><div><div class=\"grafana-target\" ng-repeat=\"override in panel.seriesOverrides\" ng-controller=\"SeriesOverridesCtrl\"><div class=\"grafana-target-inner\"><ul class=\"grafana-segment-list\"><li class=\"grafana-target-segment\"><i class=\"icon-remove pointer\" ng-click=\"removeSeriesOverride(override)\"></i></li><li class=\"grafana-target-segment\">alias or regex</li><li><input type=\"text\" ng-model=\"override.alias\" bs-typeahead=\"getSeriesNames\" ng-blur=\"render()\" data-min-length=\"0\" data-items=\"100\" class=\"input-medium grafana-target-segment-input\"></li><li class=\"grafana-target-segment\" ng-repeat=\"option in currentOverrides\"><i class=\"pointer icon-remove\" ng-click=\"removeOverride(option)\"></i> {{option.name}}: {{option.value}}</li><li class=\"dropdown\" dropdown-typeahead=\"overrideMenu\" dropdown-typeahead-on-select=\"setOverride($optionIndex, $valueIndex)\"></li></ul><div class=\"clearfix\"></div></div></div></div><button class=\"btn btn-success\" style=\"margin-top: 20px\" ng-click=\"addSeriesOverride()\">Add series override rule</button></div></div>"
  );


  $templateCache.put('app/panels/singlestat/editor.html',
    "<div class=\"editor-row\"><div class=\"section\"><h5>Big value</h5><div class=\"editor-option\"><label class=\"small\">Prefix</label><input type=\"text\" class=\"input-small\" ng-model=\"panel.prefix\" ng-blur=\"render()\"></div><div class=\"editor-option\"><label class=\"small\">Value</label><select class=\"input-small\" ng-model=\"panel.valueName\" ng-options=\"f for f in ['min','max','avg', 'current', 'total']\" ng-change=\"render()\"></select></div><div class=\"editor-option\"><label class=\"small\">Postfix</label><input type=\"text\" class=\"input-small\" ng-model=\"panel.postfix\" ng-blur=\"render()\" ng-trim=\"false\"></div><div class=\"editor-option\"><label class=\"small\">Null point mode<tip>Define how null values should handled, connected = ignored</tip></label><select class=\"input-medium\" ng-model=\"panel.nullPointMode\" ng-options=\"f for f in ['connected', 'null', 'null as zero']\" ng-change=\"get_data()\"></select></div></div><div class=\"section\"><h5>Big value font size</h5><div class=\"editor-option\"><label class=\"small\">Prefix</label><select class=\"input-mini\" style=\"width: 75px\" ng-model=\"panel.prefixFontSize\" ng-options=\"f for f in fontSizes\" ng-change=\"render()\"></select></div><div class=\"editor-option\"><label class=\"small\">Value</label><select class=\"input-mini\" style=\"width: 75px\" ng-model=\"panel.valueFontSize\" ng-options=\"f for f in fontSizes\" ng-change=\"render()\"></select></div><div class=\"editor-option\"><label class=\"small\">Postfix</label><select class=\"input-mini\" style=\"width: 75px\" ng-model=\"panel.postfixFontSize\" ng-options=\"f for f in fontSizes\" ng-change=\"render()\"></select></div></div><div class=\"section\"><h5>Formats</h5><div class=\"editor-option\"><label class=\"small\">Unit format</label><select class=\"input-small\" ng-model=\"panel.format\" ng-options=\"f for f in ['none','short','bytes', 'bits', 'bps', 's', 'ms', 'µs', 'ns', 'percent']\" ng-change=\"render()\"></select></div></div></div><div class=\"editor-row\"><div class=\"section\"><h5>Coloring</h5><editor-opt-bool text=\"Background\" model=\"panel.colorBackground\" change=\"setColoring({background: true})\"></editor-opt-bool><editor-opt-bool text=\"Value\" model=\"panel.colorValue\" change=\"setColoring({value: true})\"></editor-opt-bool><div class=\"editor-option\" ng-show=\"panel.colorBackground || panel.colorValue\"><label class=\"small\">Thresholds<tip>Comma seperated values</tip></label><input type=\"text\" class=\"input-large\" ng-model=\"panel.thresholds\" ng-blur=\"render()\" placeholder=\"0,50,80\"></div><div class=\"editor-option\" ng-show=\"panel.colorBackground || panel.colorValue\"><label class=\"small\">Colors</label><spectrum-picker ng-model=\"panel.colors[0]\" ng-change=\"render()\"></spectrum-picker><spectrum-picker ng-model=\"panel.colors[1]\" ng-change=\"render()\"></spectrum-picker><spectrum-picker ng-model=\"panel.colors[2]\" ng-change=\"render()\"></spectrum-picker><a class=\"pointer\" ng-click=\"invertColorOrder()\">invert order</a></div></div><div class=\"section\"><h5>Spark lines</h5><editor-opt-bool text=\"Spark line\" model=\"panel.sparkline.show\" change=\"render()\"></editor-opt-bool><editor-opt-bool text=\"Background mode\" model=\"panel.sparkline.full\" change=\"render()\"></editor-opt-bool><div class=\"editor-option\"><label class=\"small\">Line color</label><spectrum-picker ng-model=\"panel.sparkline.lineColor\" ng-change=\"render()\"></spectrum-picker></div><div class=\"editor-option\"><label class=\"small\">Fill color</label><spectrum-picker ng-model=\"panel.sparkline.fillColor\" ng-change=\"render()\"></spectrum-picker></div></div></div><div class=\"editor-row\"><div class=\"section\"><h5>Value to text mapping</h5><div class=\"editor-option\"><label class=\"small\">Specify mappings</label><div class=\"grafana-target\"><div class=\"grafana-target-inner\"><ul class=\"grafana-segment-list\"><li class=\"grafana-target-segment\" ng-repeat-start=\"map in panel.valueMaps\"><i class=\"icon-remove pointer\" ng-click=\"removeValueMap(map)\"></i></li><li><input type=\"text\" ng-model=\"map.value\" placeholder=\"value\" class=\"input-mini grafana-target-segment-input\" ng-blur=\"render()\"></li><li class=\"grafana-target-segment\"><i class=\"icon-arrow-right\"></i></li><li ng-repeat-end=\"\"><input type=\"text\" placeholder=\"text\" ng-model=\"map.text\" class=\"input-mini grafana-target-segment-input\" ng-blur=\"render()\"></li><li><a class=\"pointer grafana-target-segment\" ng-click=\"addValueMap();\"><i class=\"icon-plus\"></i></a></li></ul><div class=\"clearfix\"></div></div></div></div></div></div>"
  );


  $templateCache.put('app/panels/text/editor.html',
    "<div><div class=\"row-fluid\"><div class=\"span4\"><label class=\"small\">Mode</label><select class=\"input-medium\" ng-model=\"panel.mode\" ng-options=\"f for f in ['html','markdown','text']\"></select></div><div class=\"span2\" ng-show=\"panel.mode == 'text'\"><label class=\"small\">Font Size</label><select class=\"input-mini\" ng-model=\"panel.style['font-size']\" ng-options=\"f for f in ['6pt','7pt','8pt','10pt','12pt','14pt','16pt','18pt','20pt','24pt','28pt','32pt','36pt','42pt','48pt','52pt','60pt','72pt']\"></select></div></div><label class=\"small\">Content <span ng-show=\"panel.mode == 'markdown'\">(This area uses <a target=\"_blank\" href=\"http://en.wikipedia.org/wiki/Markdown\">Markdown</a>. HTML is not supported)</span></label><textarea ng-model=\"panel.content\" rows=\"20\" style=\"width:95%\" ng-change=\"render()\" ng-model-onblur=\"\">\n" +
    "  </textarea></div>"
  );


  $templateCache.put('app/panels/timepicker/custom.html',
    "<div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-calendar-empty\"></i> Custom time range</div></div><div class=\"dashboard-editor-body\"><style>.timepicker-to-column {\n" +
    "\t\t\tmargin-top: 10px;\n" +
    "\t\t}\n" +
    "\n" +
    "\t\t.timepicker-input input {\n" +
    "\t\t\toutline: 0 !important;\n" +
    "\t\t\tborder: 0px !important;\n" +
    "\t\t\t-webkit-box-shadow: 0;\n" +
    "\t\t\t-moz-box-shadow: 0;\n" +
    "\t\t\tbox-shadow: 0;\n" +
    "\t\t\tposition: relative;\n" +
    "\t\t}\n" +
    "\n" +
    "\t\t.timepicker-input input::-webkit-outer-spin-button,\n" +
    "\t\t.timepicker-input input::-webkit-inner-spin-button {\n" +
    "\t\t\t-webkit-appearance: none;\n" +
    "\t\t\tmargin: 0;\n" +
    "\t\t}\n" +
    "\n" +
    "\t\tinput.timepicker-date {\n" +
    "\t\t\twidth: 90px;\n" +
    "\t\t}\n" +
    "\t\tinput.timepicker-hms {\n" +
    "\t\t\twidth: 20px;\n" +
    "\t\t}\n" +
    "\t\tinput.timepicker-ms {\n" +
    "\t\t\twidth: 25px;\n" +
    "\t\t}\n" +
    "\t\tdiv.timepicker-now {\n" +
    "\t\t\tfloat: right;\n" +
    "\t\t}</style><div class=\"timepicker form-horizontal\"><form name=\"input\"><div class=\"timepicker-from-column\"><label class=\"small\">From</label><div class=\"fake-input timepicker-input\"><input class=\"timepicker-date\" type=\"text\" ng-change=\"validate(temptime)\" ng-model=\"temptime.from.date\" data-date-format=\"yyyy-mm-dd\" required=\"\" bs-datepicker=\"\">@<input class=\"timepicker-hms\" type=\"text\" maxlength=\"2\" ng-change=\"validate(temptime)\" ng-model=\"temptime.from.hour\" required=\"\" ng-pattern=\"patterns.hour\" onclick=\"this.select()\">:<input class=\"timepicker-hms\" type=\"text\" maxlength=\"2\" ng-change=\"validate(temptime)\" ng-model=\"temptime.from.minute\" required=\"\" ng-pattern=\"patterns.minute\" onclick=\"this.select()\">:<input class=\"timepicker-hms\" type=\"text\" maxlength=\"2\" ng-change=\"validate(temptime)\" ng-model=\"temptime.from.second\" required=\"\" ng-pattern=\"patterns.second\" onclick=\"this.select()\">.<input class=\"timepicker-ms\" type=\"text\" maxlength=\"3\" ng-change=\"validate(temptime)\" ng-model=\"temptime.from.millisecond\" required=\"\" ng-pattern=\"patterns.millisecond\" onclick=\"this.select()\"></div></div><div class=\"timepicker-to-column\"><label class=\"small\">To (<a class=\"link\" ng-class=\"{'strong':temptime.now}\" ng-click=\"setNow();temptime.now=true\">now</a>)</label><div class=\"fake-input timepicker-input\"><div ng-hide=\"temptime.now\"><input class=\"timepicker-date\" type=\"text\" ng-change=\"validate(temptime)\" ng-model=\"temptime.to.date\" data-date-format=\"yyyy-mm-dd\" required=\"\" bs-datepicker=\"\">@<input class=\"timepicker-hms\" type=\"text\" maxlength=\"2\" ng-change=\"validate(temptime)\" ng-model=\"temptime.to.hour\" required=\"\" ng-pattern=\"patterns.hour\" onclick=\"this.select()\">:<input class=\"timepicker-hms\" type=\"text\" maxlength=\"2\" ng-change=\"validate(temptime)\" ng-model=\"temptime.to.minute\" required=\"\" ng-pattern=\"patterns.minute\" onclick=\"this.select()\">:<input class=\"timepicker-hms\" type=\"text\" maxlength=\"2\" ng-change=\"validate(temptime)\" ng-model=\"temptime.to.second\" required=\"\" ng-pattern=\"patterns.second\" onclick=\"this.select()\">.<input class=\"timepicker-ms\" type=\"text\" maxlength=\"3\" ng-change=\"validate(temptime)\" ng-model=\"temptime.to.millisecond\" required=\"\" ng-pattern=\"patterns.millisecond\" onclick=\"this.select()\"></div><span type=\"text\" ng-show=\"temptime.now\" ng-disabled=\"temptime.now\">&nbsp <i class=\"pointer icon-remove-sign\" ng-click=\"setNow();temptime.now=false;\"></i> Right Now<input type=\"text\" name=\"dummy\" style=\"visibility:hidden\"></span></div></div></form><div class=\"clearfix\"></div></div></div><div class=\"dashboard-editor-footer\"><form name=\"input\" style=\"margin-bottom:0\"><span class=\"\" ng-hide=\"input.$valid\">Invalid date or range</span> <button ng-click=\"setAbsoluteTimeFilter(validate(temptime));dismiss();\" ng-disabled=\"!input.$valid\" class=\"btn btn-success\">Apply</button> <button ng-click=\"dismiss();\" class=\"btn btn-success pull-right\">Cancel</button></form></div>"
  );


  $templateCache.put('app/panels/timepicker/editor.html',
    "<div class=\"editor-row\"><div class=\"section\"><div class=\"editor-option\"><label class=\"small\">Relative time options <small>comma seperated</small></label><input type=\"text\" array-join=\"\" class=\"input-xlarge\" ng-model=\"panel.time_options\"></div><div class=\"editor-option\"><label class=\"small\">Auto-refresh options <small>comma seperated</small></label><input type=\"text\" array-join=\"\" class=\"input-xlarge\" ng-model=\"panel.refresh_intervals\"></div><p><br><i class=\"icon-info-sign\"></i> For these changes to fully take effect save and reload the dashboard.</p></div></div>"
  );


  $templateCache.put('app/panels/timepicker/refreshctrl.html',
    "<form name=\"refreshPopover\" class=\"form-inline input-append\" style=\"margin:0px\"><label><small>Interval (seconds)</small></label><br><input type=\"number\" class=\"input-mini\" ng-model=\"refresh_interval\"><button type=\"button\" class=\"btn\" ng-click=\"set_interval(refresh_interval);dismiss()\"><i class=\"icon-ok\"></i></button></form>"
  );


  $templateCache.put('app/partials/confirm_modal.html',
    "<div class=\"modal-body\"><div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-ok\"></i> {{title}}</div></div><div class=\"dashboard-editor-body\"><p class=\"row-fluid text-center large\">{{text}}<br><br></p><div class=\"row-fluid\"><span class=\"span4\"></span> <button type=\"button\" class=\"btn btn-success span2\" ng-click=\"dismiss()\">No</button> <button type=\"button\" class=\"btn btn-danger span2\" ng-click=\"onConfirm();dismiss();\">Yes</button> <span class=\"span4\"></span></div></div></div>"
  );


  $templateCache.put('app/partials/console.html',
    "<div class=\"grafana-console\" ng-controller=\"ConsoleCtrl\"><div class=\"grafana-console-header\"><span class=\"grafana-console-title large\"><i class=\"icon-terminal\"></i></span></div><div class=\"grafana-console-body\"><div class=\"grafana-console-item\" ng-repeat=\"item in events\" ng-class=\"{'grafana-console-error': item.error}\"><span class=\"grafana-console-time gfc-col\" ng-bind=\"item.time\"></span> <span class=\"grafana-console-type gfc-col\"><span class=\"label label-info\" ng-bind=\"item.type\"></span></span> <span class=\"gfc-col grafana-console-method\" ng-bind=\"item.method\"></span> <span class=\"gfc-col grafana-console-title\" ng-bind=\"item.title\"></span> <span class=\"gfc-col grafana-console-elapsed\" ng-bind=\"item.elapsed\"></span> <span class=\"gfc-col grafana-console-field1\" ng-bind=\"item.field1\"></span> <span class=\"gfc-col grafana-console-field2\" ng-bind=\"item.field2\"></span> <span class=\"gfc-col grafana-console-field3\" ng-bind=\"item.field3\"></span></div></div></div>"
  );


  $templateCache.put('app/partials/dashLoaderShare.html',
    "<div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h3>{{share.title}} <small>shareable link</small></h3></div><div class=\"modal-body\"><label>Share this dashboard with this URL</label><input ng-model=\"share.url\" type=\"text\" style=\"width:90%\" onclick=\"this.select()\" onfocus=\"this.select()\"></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-success\" ng-click=\"dismiss();$broadcast('render')\">Close</button></div>"
  );


  $templateCache.put('app/partials/dashboard.html',
    "<div body-class=\"\" class=\"dashboard\" ng-class=\"{'dashboard-fullscreen': dashboardViewState.fullscreen}\"><div ng-include=\"'app/partials/dashboard_topnav.html'\"></div><div ng-if=\"submenuEnabled\" ng-include=\"'app/partials/submenu.html'\"></div><div class=\"clearfix\"></div><div dash-editor-view=\"\"></div><div class=\"main-view-container\"><div class=\"grafana-row\" ng-controller=\"RowCtrl\" ng-repeat=\"(row_name, row) in dashboard.rows\" row-height=\"\"><div class=\"row-control\"><div class=\"row-control-inner\"><div class=\"row-close\" ng-show=\"row.collapse\" data-placement=\"bottom\"><div class=\"row-close-buttons\"><span class=\"row-button bgPrimary\" ng-click=\"toggle_row(row)\"><i bs-tooltip=\"'Expand row'\" data-placement=\"right\" class=\"icon-caret-left pointer\"></i></span></div><div class=\"row-text pointer\" ng-click=\"toggle_row(row)\" ng-bind=\"row.title\"></div></div><div class=\"row-open\" ng-show=\"!row.collapse\"><div class=\"row-tab bgSuccess dropdown\" ng-show=\"row.editable\"><span class=\"row-tab-button dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"icon-th-list\"></i></span><ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\" aria-labelledby=\"drop1\"><li><a ng-click=\"toggle_row(row)\">Collapse row</a></li><li class=\"dropdown-submenu\"><a href=\"javascript:void(0);\">Add Panel</a><ul class=\"dropdown-menu\"><li bindonce=\"\" ng-repeat=\"name in panelNames\"><a ng-click=\"add_panel_default(name)\" bo-text=\"name\"></a></li></ul></li><li class=\"dropdown-submenu\"><a href=\"javascript:void(0);\">Set height</a><ul class=\"dropdown-menu\"><li><a ng-click=\"set_height('25px')\">25 px</a></li><li><a ng-click=\"set_height('100px')\">100 px</a></li><li><a ng-click=\"set_height('150px')\">150 px</a></li><li><a ng-click=\"set_height('200px')\">200 px</a></li><li><a ng-click=\"set_height('250px')\">250 px</a></li><li><a ng-click=\"set_height('300px')\">300 px</a></li><li><a ng-click=\"set_height('350px')\">350 px</a></li><li><a ng-click=\"set_height('450px')\">450 px</a></li><li><a ng-click=\"set_height('500px')\">500 px</a></li><li><a ng-click=\"set_height('600px')\">600 px</a></li><li><a ng-click=\"set_height('700px')\">700 px</a></li></ul></li><li class=\"dropdown-submenu\"><a href=\"javascript:void(0);\">Move</a><ul class=\"dropdown-menu\"><li><a ng-click=\"move_row(-1)\">Up</a></li><li><a ng-click=\"move_row(1)\">Down</a></li></ul></li><li><a dash-editor-link=\"app/partials/roweditor.html\">Row editor</a></li><li><a ng-click=\"delete_row()\">Delete row</a></li></ul></div></div></div><div class=\"panels-wrapper\" ng-if=\"!row.collapse\"><div class=\"row-text pointer\" ng-click=\"toggle_row(row)\" ng-if=\"row.showTitle\" ng-bind=\"row.title\"></div><div ng-repeat=\"(name, panel) in row.panels\" class=\"panel\" ui-draggable=\"{{!dashboardViewState.fullscreen}}\" drag=\"panel.id\" ui-on-drop=\"onDrop($data, row, panel)\" drag-handle-class=\"drag-handle\" panel-width=\"\" ng-model=\"panel\"><grafana-panel type=\"panel.type\" ng-cloak=\"\"></grafana-panel></div><div panel-drop-zone=\"\" class=\"panel panel-drop-zone\" ui-on-drop=\"onDrop($data, row)\" data-drop=\"true\"><div class=\"panel-container\" style=\"background: transparent\"><div style=\"text-align: center\"><em>Drop here</em></div></div></div><div class=\"clearfix\"></div></div></div></div><div ng-show=\"dashboard.editable\" class=\"row-fluid add-row-panel-hint\"><div class=\"span12\" style=\"text-align:right\"><span style=\"margin-right: 10px\" ng-click=\"add_row_default()\" class=\"pointer btn btn-info btn-mini\"><span><i class=\"icon-plus-sign\"></i> ADD A ROW</span></span></div></div></div><div ng-include=\"'app/partials/console.html'\" ng-if=\"consoleEnabled\"></div></div>"
  );


  $templateCache.put('app/partials/dashboard_topnav.html',
    "<div class=\"navbar navbar-static-top\"><div class=\"navbar-inner\"><div class=\"container-fluid\"><span class=\"brand\"><img class=\"logo-icon\" src=\"img/fav32.png\" bs-tooltip=\"'Grafana'\" data-placement=\"bottom\"><span class=\"page-title\">{{dashboard.title}}</span></span><ul class=\"nav pull-right\" ng-controller=\"DashboardNavCtrl\" ng-init=\"init()\"><li ng-show=\"dashboardViewState.fullscreen\"><a ng-click=\"exitFullscreen()\">Back to dashboard</a></li><li ng-repeat=\"pulldown in dashboard.nav\" ng-controller=\"PulldownCtrl\" ng-show=\"pulldown.enable\"><grafana-simple-panel type=\"pulldown.type\" ng-cloak=\"\"></grafana-simple-panel></li><li class=\"dropdown grafana-menu-save\"><a bs-tooltip=\"'Save'\" data-placement=\"bottom\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" ng-click=\"openSaveDropdown()\"><i class=\"icon-save\"></i></a><ul class=\"save-dashboard-dropdown dropdown-menu\" ng-if=\"saveDropdownOpened\"><li><form class=\"input-prepend nomargin save-dashboard-dropdown-save-form\"><input class=\"input-medium\" ng-model=\"dashboard.title\" type=\"text\"><button class=\"btn\" ng-click=\"saveDashboard()\"><i class=\"icon-save\"></i></button></form></li><li><a class=\"link\" ng-click=\"set_default()\">Save as Home</a></li><li><a class=\"link\" ng-click=\"purge_default()\">Reset Home</a></li><li ng-show=\"!isFavorite\"><a class=\"link\" ng-click=\"markAsFavorite()\">Mark as favorite</a></li><li ng-show=\"isFavorite\"><a class=\"link\" ng-click=\"removeAsFavorite()\">Remove as favorite</a></li><li><a class=\"link\" ng-click=\"editJson()\">Dashboard JSON</a></li><li><a class=\"link\" ng-click=\"exportDashboard()\">Export dashboard</a></li><li ng-show=\"db.saveTemp\"><a bs-tooltip=\"'Share'\" data-placement=\"bottom\" ng-click=\"saveForSharing()\" config-modal=\"app/partials/dashLoaderShare.html\">Share temp copy</a></li></ul></li><li class=\"dropdown grafana-menu-load\"><a bs-tooltip=\"'Search'\" ng-click=\"openSearch()\"><i class=\"icon-folder-open\"></i></a></li><li class=\"grafana-menu-home\"><a bs-tooltip=\"'Goto saved default'\" data-placement=\"bottom\" href=\"#/\"><i class=\"icon-home\"></i></a></li><li class=\"grafana-menu-edit\" ng-show=\"dashboard.editable\" bs-tooltip=\"'Configure dashboard'\" data-placement=\"bottom\"><a class=\"link\" dash-editor-link=\"app/partials/dasheditor.html\"><i class=\"icon-cog pointer\"></i></a></li><li class=\"grafana-menu-stop-playlist hide\"><a class=\"small\" ng-click=\"stopPlaylist(2)\">Stop playlist</a></li></ul></div></div></div>"
  );


  $templateCache.put('app/partials/dasheditor.html',
    "<div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-cogs\"></i> Dashboard settings</div><div ng-model=\"editor.index\" bs-tabs=\"\" style=\"text-transform:capitalize\"><div ng-repeat=\"tab in ['General', 'Rows', 'Features', 'Import']\" data-title=\"{{tab}}\"></div><div ng-repeat=\"tab in dashboard.nav\" data-title=\"{{tab.type}}\"></div></div></div><div class=\"dashboard-editor-body\"><div ng-if=\"editor.index == 0\"><div class=\"editor-row\"><div class=\"section\"><div class=\"editor-option\"><label class=\"small\">Title</label><input type=\"text\" class=\"input-large\" ng-model=\"dashboard.title\"></div><div class=\"editor-option\"><label class=\"small\">Theme</label><select class=\"input-small\" ng-model=\"dashboard.style\" ng-options=\"f for f in ['dark','light']\" ng-change=\"styleUpdated()\"></select></div><div class=\"editor-option\"><label class=\"small\">Time correction</label><select ng-model=\"dashboard.timezone\" class=\"input-small\" ng-options=\"f for f in ['browser','utc']\"></select></div><editor-opt-bool text=\"Hide controls (CTRL+H)\" model=\"dashboard.hideControls\"></editor-opt-bool></div></div><div class=\"editor-row\"><div class=\"section\"><div class=\"editor-option\"><label class=\"small\">Tags</label><bootstrap-tagsinput ng-model=\"dashboard.tags\" tagclass=\"label label-tag\" placeholder=\"add tags\"></bootstrap-tagsinput><tip>Press enter to a add tag</tip></div></div></div></div><div ng-if=\"editor.index == 1\"><div class=\"editor-row\"><div class=\"span6\"><table class=\"grafana-options-table\"><tr ng-repeat=\"row in dashboard.rows\"><td style=\"width: 97%\">{{row.title}}</td><td><i ng-click=\"_.move(dashboard.rows,$index,$index-1)\" ng-hide=\"$first\" class=\"pointer icon-arrow-up\"></i></td><td><i ng-click=\"_.move(dashboard.rows,$index,$index+1)\" ng-hide=\"$last\" class=\"pointer icon-arrow-down\"></i></td><td><a ng-click=\"dashboard.rows = _.without(dashboard.rows,row)\" class=\"btn btn-danger btn-mini\"><i class=\"icon-remove\"></i></a></td></tr></table></div></div></div><div ng-if=\"editor.index == 2\"><div class=\"editor-row\"><div class=\"section\"><editor-opt-bool text=\"Templating\" model=\"dashboard.templating.enable\" change=\"checkFeatureToggles()\"></editor-opt-bool><editor-opt-bool text=\"Annotations\" model=\"dashboard.annotations.enable\" change=\"checkFeatureToggles()\"></editor-opt-bool><div class=\"editor-option text-center\" ng-repeat=\"pulldown in dashboard.nav\"><label class=\"small\" style=\"text-transform:capitalize\">{{pulldown.type}}</label><input class=\"cr1\" id=\"pulldown{{pulldown.type}}\" type=\"checkbox\" ng-model=\"pulldown.enable\" ng-checked=\"pulldown.enable\"><label for=\"pulldown{{pulldown.type}}\" class=\"cr1\"></label></div><editor-opt-bool text=\"Shared Crosshair (CTRL+O)\" model=\"dashboard.sharedCrosshair\"></editor-opt-bool></div></div></div><div ng-if=\"editor.index == 3\"><ng-include src=\"'app/partials/import.html'\"></ng-include></div><div ng-repeat=\"pulldown in dashboard.nav\" ng-controller=\"SubmenuCtrl\" ng-show=\"editor.index == 4+$index\"><ng-include ng-show=\"pulldown.enable\" src=\"pulldownEditorPath(pulldown.type)\"></ng-include><button ng-hide=\"pulldown.enable\" class=\"btn\" ng-click=\"pulldown.enable = true\">Enable the {{pulldown.type}}</button></div></div><div class=\"clearfix\"></div><div class=\"dashboard-editor-footer\"><div class=\"grafana-version-info\" ng-show=\"editor.index === 0\"><span class=\"editor-option small\">Grafana version: {{grafanaVersion}} &nbsp;&nbsp;</span> <span grafana-version-check=\"\"></span></div><button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"editor.index=0;dismiss();reset_panel();dashboard.emit_refresh()\">Close</button></div>"
  );


  $templateCache.put('app/partials/edit_json.html',
    "<div ng-controller=\"JsonEditorCtrl\"><div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-edit\"></i> JSON</div></div><div class=\"dashboard-editor-body\" style=\"height: 500px\"><textarea ng-model=\"json\" rows=\"20\" spellcheck=\"false\" style=\"width: 90%\"></textarea></div><div class=\"dashboard-editor-footer\"><button type=\"button\" class=\"btn btn-success pull-left\" ng-show=\"canUpdate\" ng-click=\"update(); dismiss();\">Update</button> <button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"dismiss();\">Close</button></div></div>"
  );


  $templateCache.put('app/partials/help_modal.html',
    "<div class=\"modal-body\"><div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-keyboard\"></i> Keyboard shutcuts</div></div><div class=\"dashboard-editor-body\"><table class=\"shortcut-table\"><tr><th></th><th style=\"text-align: left\">Dashboard wide shortcuts</th></tr><tr><td style=\"text-align: right\"><span class=\"label label-info\">ESC</span></td><td>Exit fullscreen edit/view mode, close search or any editor view</td></tr><tr><td><span class=\"label label-info\">CTRL+F</span></td><td>Open dashboard search view (also contains import/playlist controls)</td></tr><tr><td><span class=\"label label-info\">CTRL+S</span></td><td>Save dashboard</td></tr><tr><td><span class=\"label label-info\">CTRL+H</span></td><td>Hide row controls</td></tr><tr><td><span class=\"label label-info\">CTRL+Z</span></td><td>Zoom out</td></tr><tr><td><span class=\"label label-info\">CTRL+R</span></td><td>Refresh (Fetches new data and rerenders panels)</td></tr><tr><td><span class=\"label label-info\">CTRL+O</span></td><td>Enable/Disable shared graph crosshair</td></tr></table></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-info\" ng-click=\"dismiss()\">Close</button></div>"
  );


  $templateCache.put('app/partials/import.html',
    "<div ng-controller=\"GraphiteImportCtrl\" ng-init=\"init()\"><h5>Import dashboards from graphite web</h5><div class=\"editor-row\"><div class=\"section\"><div class=\"btn-group\"><button class=\"btn btn-info dropdown-toggle\" data-toggle=\"dropdown\" bs-tooltip=\"'Datasource'\">{{datasource.name}} <span class=\"caret\"></span></button><ul class=\"dropdown-menu\" role=\"menu\"><li ng-repeat=\"datasource in datasources\" role=\"menuitem\"><a ng-click=\"setDatasource(datasource.value);\">{{datasource.name}}</a></li></ul></div><button ng-click=\"listAll()\" class=\"btn btn-success\">List all dashboards</button></div></div><div class=\"editor-row\" style=\"margin-top: 10px;max-height: 400px; overflow-y: scroll;max-width: 500px\"><table class=\"grafana-options-table\"><tr ng-repeat=\"dash in dashboards\"><td style=\"\">{{dash.name}}</td><td style=\"padding-left: 20px\"><a class=\"pointer\" ng-click=\"import(dash.name)\">import</a></td></tr></table></div><div ng-show=\"error\" style=\"margin-top: 20px\" class=\"alert alert-error\">{{error}}</div></div>"
  );


  $templateCache.put('app/partials/inspector.html',
    "<div class=\"modal-body\" ng-controller=\"InspectCtrl\" ng-init=\"init()\"><div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-eye-open\"></i> Inspector</div><div ng-model=\"editor.index\" bs-tabs=\"\"><div ng-repeat=\"tab in ['Request', 'Response', 'JS Error']\" data-title=\"{{tab}}\"></div></div></div><div class=\"dashboard-editor-body\"><div ng-if=\"editor.index == 0\"><h5>Request details</h5><table class=\"table table-striped small inspector-request-table\"><tr><td>Url</td><td>{{inspector.error.config.url}}</td></tr><tr><td>Method</td><td>{{inspector.error.config.method}}</td></tr><tr ng-repeat=\"(key, value) in inspector.error.config.headers\"><td>{{key}}</td><td>{{value}}</td></tr></table><h5>Request parameters</h5><table class=\"table table-striped small inspector-request-table\"><tr ng-repeat=\"param in request_parameters\"><td>{{param.key}}</td><td>{{param.value}}</td></tr></table></div><div ng-if=\"editor.index == 1\"><h5 ng-if=\"response\" ng-bind=\"response\"></h5><div ng-if=\"response_html\"><div iframe-content=\"response_html\"></div></div></div><div ng-if=\"editor.index == 2\"><label>Message:</label><pre>\n" +
    "\t\t\t{{message}}\n" +
    "\t\t</pre><label>Stack trace:</label><pre>\n" +
    "\t\t\t{{stack_trace}}\n" +
    "\t\t</pre></div></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-info\" ng-click=\"dismiss()\">Close</button></div>"
  );


  $templateCache.put('app/partials/loadmetrics.html',
    "<div ng-controller=\"MetricKeysCtrl\" ng-init=\"init()\"><h5>Load metrics keys into elastic search</h5><p>Work in progress...</p></div>"
  );


  $templateCache.put('app/partials/metrics.html',
    "<div ng-include=\"\" src=\"datasource.editorSrc\"></div><div class=\"editor-row\" style=\"margin-top: 30px\"><button class=\"btn btn-success pull-right\" ng-click=\"addDataQuery(panel.target)\">Add query</button><div class=\"btn-group pull-right\" style=\"margin-right: 10px\"><button class=\"btn btn-info dropdown-toggle\" data-toggle=\"dropdown\" bs-tooltip=\"'Datasource'\">{{datasource.name}} <span class=\"caret\"></span></button><ul class=\"dropdown-menu\" role=\"menu\"><li ng-repeat=\"datasource in datasources\" role=\"menuitem\"><a ng-click=\"changeDatasource(datasource.value);\">{{datasource.name}}</a></li></ul></div><div class=\"clearfix\"></div></div>"
  );


  $templateCache.put('app/partials/modal.html',
    "<div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h3>{{modal.title}}</h3></div><div class=\"modal-body\"><div ng-bind-html=\"modal.body\"></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-danger\" ng-click=\"dismiss()\">Close</button></div>"
  );


  $templateCache.put('app/partials/paneleditor.html',
    "<div bindonce=\"\" class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-text-width\"></i> <span bo-text=\"panel.type+' settings'\"></span></div><div ng-model=\"editor.index\" bs-tabs=\"\" style=\"text-transform:capitalize\"><div ng-repeat=\"tab in panelMeta.editorTabs\" data-title=\"{{tab.title}}\"></div></div></div><div class=\"dashboard-editor-body\"><div ng-repeat=\"tab in panelMeta.editorTabs\" ng-show=\"editor.index == $index\"><div ng-include=\"\" src=\"tab.src\"></div></div></div><div class=\"dashboard-editor-footer\"><button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"editor.index=0;dismiss()\">Close</button></div>"
  );


  $templateCache.put('app/partials/panelgeneral.html',
    "<div class=\"editor-row\"><div class=\"section\"><h5>General options</h5><div class=\"editor-option\"><label class=\"small\">Title</label><input type=\"text\" class=\"input-medium\" ng-model=\"panel.title\"></div><div class=\"editor-option\"><label class=\"small\">Span</label><select class=\"input-mini\" ng-model=\"panel.span\" ng-options=\"f for f in [0,1,2,3,4,5,6,7,8,9,10,11,12]\"></select></div><div class=\"editor-option\"><label class=\"small\">Height</label><input type=\"text\" class=\"input-small\" ng-model=\"panel.height\"></div></div></div><panel-link-editor panel=\"panel\"></panel-link-editor>"
  );


  $templateCache.put('app/partials/playlist.html',
    "<div ng-controller=\"PlaylistCtrl\" ng-init=\"init()\"><div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-play\"></i> Start dashboard playlist</div></div><div class=\"dashboard-editor-body\"><div class=\"editor-row\"><div class=\"section\"><div class=\"editor-option\"><table class=\"table table-striped span4\"><tr><th>Dashboard</th><th>Include</th><th style=\"white-space: nowrap\">Remove as favorite</th></tr><tr ng-repeat=\"dashboard in favDashboards\"><td style=\"white-space: nowrap\">{{dashboard.title}}</td><td style=\"text-align: center\"><input id=\"dash-{{$index}}\" class=\"cr1\" type=\"checkbox\" ng-model=\"dashboard.include\" ng-checked=\"dashboard.include\"><label for=\"dash-{{$index}}\" class=\"cr1\"></label></td><td style=\"text-align: center\"><i class=\"icon-remove pointer\" ng-click=\"removeAsFavorite(dashboard)\"></i></td></tr><tr ng-hide=\"favDashboards.length\"><td colspan=\"3\"><i class=\"icon-warning\"></i> No dashboards marked as favorites</td></tr></table></div><div class=\"editor-option\"><div class=\"span4\"><span><i class=\"icon-question-sign\"></i> dashboards available in the playlist are only the ones marked as favorites (stored in local browser storage). to mark a dashboard as favorite, use save icon in the menu and in the dropdown select mark as favorite<br><br></span></div></div><div class=\"editor-option\"><label>Timespan between change</label><input type=\"text\" class=\"input-small\" ng-model=\"timespan\"></div></div></div></div><div class=\"dashboard-editor-footer\"><button class=\"btn btn-success\" ng-click=\"start();dismiss();\"><i class=\"icon-play\"></i> Start</button> <button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"dismiss();\"><i class=\"icon-ban-circle\"></i> Close</button></div></div>"
  );


  $templateCache.put('app/partials/roweditor.html',
    "<div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-th-list\"></i> Row settings</div><div ng-model=\"editor.index\" bs-tabs=\"\" style=\"text-transform:capitalize\"><div ng-repeat=\"tab in ['General','Panels']\" data-title=\"{{tab}}\"></div></div></div><div class=\"dashboard-editor-body\"><div class=\"editor-row\" ng-if=\"editor.index == 0\"><div class=\"editor-option\"><label class=\"small\">Title</label><input type=\"text\" class=\"input-medium\" ng-model=\"row.title\"></div><div class=\"editor-option\"><label class=\"small\">Height</label><input type=\"text\" class=\"input-mini\" ng-model=\"row.height\"></div><editor-opt-bool text=\"Editable\" model=\"row.editable\"></editor-opt-bool><editor-opt-bool text=\"Show title\" model=\"row.showTitle\"></editor-opt-bool></div><div class=\"row-fluid\" ng-if=\"editor.index == 1\"><div class=\"span12\"><table class=\"grafana-options-table\" style=\"max-width: 400px; width: auto\"><thead><th>Title</th><th>Type</th><th>Span</th><th></th><th></th><th></th></thead><tr ng-repeat=\"panel in row.panels\"><td style=\"width: 95%\">{{panel.title}}</td><td>{{panel.type}}</td><td><select ng-hide=\"panel.sizeable == false\" class=\"input-mini\" style=\"margin-bottom: 0\" ng-model=\"panel.span\" ng-options=\"size for size in [1,2,3,4,5,6,7,8,9,10,11,12]\"></select></td><td><i ng-click=\"_.move(row.panels,$index,$index-1)\" ng-hide=\"$first\" class=\"pointer icon-arrow-up\"></i></td><td><i ng-click=\"_.move(row.panels,$index,$index+1)\" ng-hide=\"$last\" class=\"pointer icon-arrow-down\"></i></td><td><a ng-click=\"row.panels = _.without(row.panels,panel)\" class=\"btn btn-danger btn-mini\"><i class=\"icon-remove\"></i></a></td></tr></table></div></div></div><div class=\"dashboard-editor-footer\"><button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"editor.index=0;dismiss();reset_panel();close_edit()\">Close</button></div>"
  );


  $templateCache.put('app/partials/search.html',
    "<div ng-controller=\"SearchCtrl\" ng-init=\"init()\"><div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\" style=\"border: 0; line-height: 41px\"><i class=\"icon icon-search\"></i> Search</div><div class=\"grafana-search-panel\"><div class=\"search-field-wrapper\"><button class=\"btn btn-success pull-right\" dash-editor-link=\"app/partials/playlist.html\" editor-scope=\"isolated\"><i class=\"icon-play\"></i> Playlist</button> <button class=\"btn btn-success pull-right\" ng-click=\"toggleImport($event)\"><i class=\"icon-download-alt\"></i> Import</button> <button class=\"btn btn-success pull-right\" ng-click=\"newDashboard()\"><i class=\"icon-th-large\"></i> New</button> <span style=\"position: relative\"><input type=\"text\" placeholder=\"search dashboards, metrics, or graphs\" xng-focus=\"giveSearchFocus\" ng-keydown=\"keyDown($event)\" ng-model=\"query.query\" ng-model-options=\"{ debounce: 500 }\" spellcheck=\"false\" ng-change=\"search()\"><a class=\"search-tagview-switch\" href=\"javascript:void(0);\" ng-class=\"{'active': tagsOnly}\" ng-click=\"showTags($event)\">tags</a></span></div></div></div><div ng-if=\"!showImport\"><h6 ng-hide=\"results.dashboards.length\">No dashboards matching your query were found.</h6><div class=\"search-results-container\" ng-if=\"tagsOnly\"><div class=\"row\"><div class=\"span6 offset1\"><div ng-repeat=\"tag in results.tags\" class=\"pointer\" style=\"width: 180px; float: left\" ng-class=\"{'selected': $index === selectedIndex }\" ng-click=\"filterByTag(tag.term, $event)\"><a class=\"search-result-tag label label-tag\" tag-color-from-name=\"\"><i class=\"icon icon-tag\"></i> <span>{{tag.term}} &nbsp;({{tag.count}})</span></a></div></div></div></div><div class=\"search-results-container\" ng-if=\"!tagsOnly\"><div class=\"search-result-item pointer\" bindonce=\"\" ng-repeat=\"row in results.dashboards\" ng-class=\"{'selected': $index === selectedIndex }\" ng-click=\"goToDashboard(row.id)\"><div class=\"search-result-actions small\"><a ng-click=\"shareDashboard(row.id, row.id, $event)\" config-modal=\"app/partials/dashLoaderShare.html\"><i class=\"icon-share\"></i> share &nbsp;&nbsp;&nbsp;</a> <a ng-click=\"deleteDashboard(row, $event)\"><i class=\"icon-remove\"></i> delete</a></div><div class=\"search-result-tags\"><a ng-click=\"filterByTag(tag, $event)\" ng-repeat=\"tag in row.tags\" tag-color-from-name=\"\" class=\"label label-tag\">{{tag}}</a></div><a class=\"search-result-link\"><i class=\"icon icon-th-large\"></i> <span bo-text=\"row.title\"></span></a></div></div></div><div class=\"editor-row\" ng-if=\"showImport\"><div class=\"section\"><div class=\"editor-option\"><h5>Local File<tip>Load dashboard JSON layout from file</tip></h5><form><input type=\"file\" id=\"dashupload\" dash-upload=\"\"><br></form></div></div></div></div>"
  );


  $templateCache.put('app/partials/share-panel.html',
    "<div ng-controller=\"SharePanelCtrl\"><div class=\"modal-header\"><div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-share\"></i> Share</div><div ng-model=\"editor.index\" bs-tabs=\"\" style=\"text-transform:capitalize\"><div ng-repeat=\"tab in ['Link']\" data-title=\"{{tab}}\"></div></div></div></div><div class=\"modal-body\"><div class=\"editor-row\"><editor-opt-bool text=\"Current time range\" model=\"forCurrent\" change=\"buildUrl()\"></editor-opt-bool><editor-opt-bool text=\"To this panel only\" model=\"toPanel\" change=\"buildUrl()\"></editor-opt-bool><editor-opt-bool text=\"Include template variables\" model=\"includeTemplateVars\" change=\"buildUrl()\"></editor-opt-bool></div><div class=\"editor-row\" style=\"margin-top: 20px\"><input type=\"text\" data-share-panel-url=\"\" class=\"input input-fluid\" ng-model=\"shareUrl\"></div></div><div class=\"modal-footer\"><button class=\"btn btn-success pull-right\" ng-click=\"dismiss();\">close</button></div></div>"
  );


  $templateCache.put('app/partials/submenu.html',
    "<div class=\"submenu-controls\" ng-controller=\"SubmenuCtrl\"><div class=\"grafana-target\"><div class=\"grafana-target-inner\" style=\"border-top: none\"><ul class=\"grafana-segment-list\"><li class=\"grafana-target-segment\"><div class=\"dropdown\"><a class=\"pointer\" data-toggle=\"dropdown\"><i class=\"icon-cog\"></i></a><ul class=\"dropdown-menu\"><li><a class=\"pointer\" dash-editor-link=\"app/partials/templating_editor.html\">Templating</a></li><li><a class=\"pointer\" dash-editor-link=\"app/features/annotations/partials/editor.html\">Annotations</a></li></ul></div></li></ul><ul class=\"grafana-segment-list\" ng-if=\"dashboard.templating.enable\"><li ng-repeat-start=\"variable in variables\" class=\"grafana-target-segment template-param-name\"><span class=\"template-variable\">${{variable.name}}:</span></li><li ng-repeat-end=\"\" template-param-selector=\"\"></li></ul><ul class=\"grafana-segment-list\" ng-if=\"dashboard.annotations.enable\"><li ng-repeat=\"annotation in dashboard.annotations.list\" class=\"grafana-target-segment annotation-segment\" ng-class=\"{'annotation-disabled': !annotation.enable}\"><a ng-click=\"disableAnnotation(annotation)\"><i class=\"annotation-color-icon icon-bolt\"></i> {{annotation.name}}</a></li></ul><div class=\"clearfix\"></div></div></div></div>"
  );


  $templateCache.put('app/partials/templating_editor.html',
    "<div ng-controller=\"TemplateEditorCtrl\" ng-init=\"init()\"><div class=\"dashboard-editor-header\"><div class=\"dashboard-editor-title\"><i class=\"icon icon-code\"></i> Templating</div><div ng-model=\"editor.index\" bs-tabs=\"\" style=\"text-transform:capitalize\"><div ng-repeat=\"tab in ['Variables', 'Add', 'Edit']\" data-title=\"{{tab}}\"></div></div></div><div class=\"dashboard-editor-body\"><div ng-if=\"editor.index == 0\"><div class=\"editor-row row\"><div class=\"span8\"><div ng-if=\"variables.length === 0\"><em>No template variables defined</em></div><table class=\"grafana-options-table\"><tr ng-repeat=\"variable in variables\"><td style=\"width: 1%\"><span class=\"template-variable\">${{variable.name}}</span></td><td class=\"max-width\" style=\"max-width: 200px\">{{variable.query}}</td><td style=\"width: 1%\"><a ng-click=\"edit(variable)\" class=\"btn btn-success btn-mini\"><i class=\"icon-edit\"></i> Edit</a></td><td style=\"width: 1%\"><i ng-click=\"_.move(variables,$index,$index-1)\" ng-hide=\"$first\" class=\"pointer icon-arrow-up\"></i></td><td style=\"width: 1%\"><i ng-click=\"_.move(variables,$index,$index+1)\" ng-hide=\"$last\" class=\"pointer icon-arrow-down\"></i></td><td style=\"width: 1%\"><a ng-click=\"removeVariable(variable)\" class=\"btn btn-danger btn-mini\"><i class=\"icon-remove\"></i></a></td></tr></table></div></div></div><div ng-if=\"editor.index == 1 || (editor.index == 2 && !currentIsNew)\"><div class=\"row\"><div class=\"editor-option\"><div class=\"editor-row\"><div class=\"editor-option\"><label class=\"small\">Variable name</label><input type=\"text\" class=\"input-medium\" ng-model=\"current.name\" placeholder=\"name\" required=\"\"></div><div class=\"editor-option\"><label class=\"small\">Type</label><select class=\"input-medium\" ng-model=\"current.type\" ng-options=\"f for f in ['query', 'interval', 'custom']\" ng-change=\"typeChanged()\"></select></div><div class=\"editor-option\" ng-show=\"current.type === 'query'\"><label class=\"small\">Datasource</label><select class=\"input input-medium\" ng-model=\"current.datasource\" ng-options=\"f.value as f.name for f in datasources\"></select></div><editor-opt-bool text=\"Refresh on load\" show-if=\"current.type === 'query'\" tip=\"Check if you want values to be updated on dashboard load, will slow down dashboard load time\" model=\"current.refresh\"></editor-opt-bool></div><div ng-show=\"current.type === 'interval'\"><div class=\"editor-row\"><div class=\"editor-option\"><label class=\"small\">Values</label><input type=\"text\" class=\"input-xxlarge\" ng-model=\"current.query\" ng-blur=\"runQuery()\" placeholder=\"name\"></div></div><div class=\"editor-row\"><editor-opt-bool text=\"Include auto interval\" model=\"current.auto\" change=\"runQuery()\"></editor-opt-bool><div class=\"editor-option\" ng-show=\"current.auto\"><label class=\"small\">Auto interval steps<tip>How many steps, roughly, the interval is rounded and will not always match this count<tip></tip></tip></label><select class=\"input-mini\" ng-model=\"current.auto_count\" ng-options=\"f for f in [3,5,10,30,50,100,200]\" ng-change=\"runQuery()\"></select></div></div></div><div ng-show=\"current.type === 'custom'\"><div class=\"editor-row\"><div class=\"editor-option\"><label class=\"small\">Values seperated by comma</label><input type=\"text\" class=\"input-xxlarge\" ng-model=\"current.query\" ng-blur=\"runQuery()\" placeholder=\"1, 10, 20, myvalue\"></div></div></div><div ng-show=\"current.type === 'query'\"><div class=\"editor-row\"><div class=\"editor-option form-inline\"><label class=\"small\">Variable values query</label><input type=\"text\" class=\"input-xxlarge\" ng-model=\"current.query\" placeholder=\"apps.servers.*\"><button class=\"btn btn-small btn-success\" ng-click=\"runQuery()\" bs-tooltip=\"'Execute query'\" data-placement=\"right\"><i class=\"icon-play\"></i></button></div></div><div class=\"editor-row\" style=\"margin: 15px 0\"><div class=\"editor-option form-inline\"><label class=\"small\">regex (optional, if you want to extract part of a series name or metric node segment)</label><input type=\"text\" class=\"input-xxlarge\" ng-model=\"current.regex\" placeholder=\"/.*-(.*)-.*/\"><button class=\"btn btn-small btn-success\" ng-click=\"runQuery()\" bs-tooltip=\"'execute query'\" data-placement=\"right\"><i class=\"icon-play\"></i></button></div></div><div class=\"editor-row\" style=\"margin: 15px 0\"><editor-opt-bool text=\"All option\" model=\"current.includeAll\" change=\"runQuery()\"></editor-opt-bool><div class=\"editor-option\" ng-show=\"current.includeAll\"><label class=\"small\">All format</label><select class=\"input-medium\" ng-model=\"current.allFormat\" ng-change=\"runQuery()\" ng-options=\"f for f in ['glob', 'wildcard', 'regex wildcard', 'regex values']\"></select></div><div class=\"editor-option\" ng-show=\"current.includeAll\"><label class=\"small\">All value</label><input type=\"text\" class=\"input-xlarge\" ng-model=\"current.options[0].value\"></div></div></div></div><div class=\"editor-option\"><div class=\"editor-row\"><div class=\"editor-option\"><label class=\"small\">Variable values (showing 20/{{current.options.length}})</label><ul class=\"grafana-options-list\"><li ng-repeat=\"option in current.options | limitTo: 20\">{{option.text}}</li></ul></div></div></div></div></div></div><div class=\"dashboard-editor-footer\"><button type=\"button\" class=\"btn btn-success pull-left\" ng-show=\"editor.index === 2\" ng-click=\"update();\">Update</button> <button type=\"button\" class=\"btn btn-success pull-left\" ng-show=\"editor.index === 1\" ng-click=\"add();\">Add</button> <button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"dismiss();\">Close</button></div></div>"
  );


  $templateCache.put('app/partials/unsaved-changes.html',
    "<div class=\"modal-header\"></div><div class=\"modal-body\"><h4 class=\"text-center\"><i class=\"icon-warning-sign\"></i> Unsaved changes</h4><div class=\"row-fluid\"><span class=\"span3\">{{changes}}</span> <button type=\"button\" class=\"btn btn-success span2\" ng-click=\"dismiss()\">Cancel</button> <button type=\"button\" class=\"btn btn-success span2\" ng-click=\"save();dismiss();\">Save</button> <button type=\"button\" class=\"btn btn-warning span2\" ng-click=\"ignore();dismiss();\">Ignore</button> <span class=\"span3\"></span></div></div><div class=\"modal-footer\"></div>"
  );

}]);
});