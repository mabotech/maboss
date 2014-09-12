'use strict';

angular.module('Company.version', [
  'Company.version.interpolate-filter',
  'Company.version.version-directive'
])

.value('version', '0.1');
