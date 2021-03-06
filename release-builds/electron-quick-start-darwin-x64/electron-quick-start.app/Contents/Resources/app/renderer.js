// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');

var app = angular.module('mainApp', []);
app.controller('MainCtr', ['$scope', '$http', function ($scope, $http) {
  $scope.Boom = function () {
    if (typeof $scope.paramX !== 'undefined' && typeof $scope.paramY !== 'undefined') {
      console.log($scope.paramX + " : " + $scope.paramY);
      Readfile();
    } else {
      console.log("Hacking");
    }
  };

  var Readfile = function() {
    fs.readFile('/tmp/input.nmf', (err, data) => {
      if (err) throw err;
      FindCell(data.toString());
    });
  }

  var FindCell = function(data) {
    var input = data.split("\n");
    var output = "";
    var pattern = /^CELLMEAS/g;

    input.forEach(function (v) {
      var reArray = pattern.exec(v);
      if(reArray != null) {
        output += ReplaceX(reArray.input) + "\n";
      } else {
        output += v + "\n";
      }

    }, this);
    // console.log(output);
    WriteNewFile(output);
  }

  var ReplaceX = function(data) {
    var input = data.trim().split(",");
    var output = "";

    if (parseInt(input[12]) > parseInt($scope.paramX)) {
      input[12] = $scope.paramY;
    }

    input.forEach(function (v) {
      output += v + ",";
    }, this);
    return output.slice(0, -1); // Remove last Character
  }

  var WriteNewFile = function(data) {
    if(typeof data !== 'undefined') {
      fs.writeFile('/tmp/output.nmf', data, function(err) {
        if(err) throw err
      });
    }
  }
}]);
