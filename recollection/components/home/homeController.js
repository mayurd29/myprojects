var myApp = angular.module('myApp',[]);

var homeController = function($scope, $http){
	$scope.message = "i am inside";

	var onSucc = function(res){
		var latestAppData = res.data.appartmentRent[0]; // pick latest one
		var rent = {};
		rent.name = latestAppData.name;
		rent.extraInfo = latestAppData.extraInfo;
		rent.member = "Member Since, "+ latestAppData.paymentDetails[latestAppData.paymentDetails.length-1].paymentDate+".";
		rent.totalPaid = 0;
		
		$.each(latestAppData.paymentDetails, function(i,o){
			rent.totalPaid += o.amount;
		});

		$scope.rent = rent;
	};

	var onErr = function(err){
		console.log('err ::', err);
	};

	$http.get('assets/json/appartmentRent.json')
		.then(onSucc, onErr);
};

myApp.controller('homeController', homeController);