var app = angular.module('filters', []);

app.controller('dates', function($scope){
  $scope.dateCommon = "2014/10/19";
  $scope.dateUTC = "2014-10-19T06:46:00+00:00";
})