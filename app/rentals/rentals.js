'use strict';

angular.module('rentfinds.rentals', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/rentals', {
    templateUrl: 'rentals/rentals.html',
    controller: 'RentalsCtrl'
  })
  .when('/add', {
    templateUrl: 'rentals/add.html',
    controller: 'RentalsCtrl'
  })
  .when('/edit/:id', {
    templateUrl: 'rentals/edit.html',
    controller: 'EditCtrl'
  })
  .when('/details/:id', {
    templateUrl: 'rentals/details.html',
    controller: 'DetailsCtrl'
  });
}])

.controller('RentalsCtrl', ['$scope', '$firebaseArray', '$location', function($scope, $firebaseArray, $location) {
	console.log('RentalsCtrl');
	
	// db instance
	//var refFirebase = '';
	// db data array
	//$scope.rentals = '';
	
	refresh();
	
	//console.log(firebase);
	
	
	$scope.searchRentals = function(){
		var city = $scope.city;
		console.log('Searching for ' + city);
		
		// Define Firebase Collection
		var ref = firebase.database().ref('rentals');
		
		// search query
		var query = {
			'city': city
		};
		
		$scope.rentals = $firebaseArray(ref.orderByChild('city').equalTo(city));
		
		// hide latest listings
		$scope.showLatest = false;
		
		// show search results
		$scope.showResults = true;
	}
	
	$scope.addRental = function(){
		console.log('Adding rental...');
		// retrieve form field values
		if($scope.title){ var title = $scope.title; } else { var title = null; }
		if($scope.email){ var email = $scope.email; } else { var email = null; }
		if($scope.phone){ var phone = $scope.phone; } else { var phone = null; }
		if($scope.street_address){ var street_address = $scope.street_address; } else { var street_address = null; }
		if($scope.city){ var city = $scope.city; } else { var city = null; }
		if($scope.state){ var state = $scope.state; } else { var state = null; }
		if($scope.zipcode){ var zipcode = $scope.zipcode; } else { var zipcode = null; }
		if($scope.bedrooms){ var bedrooms = $scope.bedrooms; } else { var bedrooms = null; }
		if($scope.price){ var price = $scope.price; } else { var price = null; }
		if($scope.description){ var description = $scope.description; } else { var description = null; }
		if($scope.image_url){ var image_url = $scope.image_url; } else { var image_url= 'http://www.techguywebsolutions.com/uploads/no-image.jpg'; }
		
		firebase.auth().signInAnonymously().catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
		});
		
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in.
				var isAnonymous = user.isAnonymous;
				var uid = user.uid;
				//..
				console.log(user);
				
				//submit form and add data to firebase
				firebase.database().ref('rentals').push({
					title: title,
					email: email,
					phone, phone,
					street_address: street_address,
					city: city,
					state: state,
					zipcode: zipcode,
					bedrooms: bedrooms,
					price: price,
					description: description,
					image_url: image_url,
					date: firebase.database.ServerValue.TIMESTAMP
				}).then(function(){
					console.log('Added record');
					// Send Message
					$scope.msg = 'Your rental has been added';

					clearFields();
				}).catch(function(error) {
					console.log("Insert failed: " + error.message);
					
					// Send Message
					$scope.msg = 'Insert failed. Please try again later';
				});
			} else {
				// User is signed out.
				// ...
				console.log('signed out...');
			}
			// ...
			console.log('end...');
		});
	}
	
	// Remove Rental
	$scope.removeRental = function(rental, id){
		// GET DB Instance
		var ref = firebase.database().ref('rentals/' + id);
	
		ref.remove();

		$scope.msg="Rental Removed";
		$location.path('/#rentals');
	}
	
	function clearFields(){
		console.log('Clearing All Fields...');
		console.log($scope);
		
		$scope.title = '';
		$scope.email = '';
		$scope.phone = '';
		$scope.bedrooms = '';
		$scope.price = '';
		$scope.description = '';
		$scope.street_address = '';
		$scope.city = '';
		$scope.state = '';
		$scope.zipcode = '';
	}
	
	$scope.refresh = function(){
		refresh();
	}
	
	function refresh(){
		console.log('Refreshing...');
		// db instance
		var refFirebase = firebase.database().ref('rentals');
		
		// db data array
		$scope.rentals = $firebaseArray(refFirebase);
		
		// show latest listings
		$scope.showLatest = true;
		
		// hide search results
		$scope.showResults = false;
	}
}])

.controller('DetailsCtrl', ['$scope', '$firebaseObject', '$routeParams', function($scope, $firebaseObject, $routeParams) {
	console.log('DetailsCtrl ' + $routeParams.id);
	
	// Get id from url
	$scope.id = $routeParams.id;
	
	// db instance
	var refFirebase = firebase.database().ref('rentals/' + $scope.id);
	
	// db data object
	var rentalData = $firebaseObject(refFirebase);
	//console.log(rentalData);
	
	// bind data to the scope
	rentalData.$bindTo($scope, 'data');
}])

.controller('EditCtrl', ['$scope','$routeParams', '$firebaseObject', function($scope, $routeParams, $firebaseObject) {
	console.log('EditCtrl');
	
	// Get ID From URL
	$scope.id = $routeParams.id;

	// db instance
	var refFirebase = firebase.database().ref('rentals/' + $scope.id);
	
	// db data object
	var rentalData = $firebaseObject(refFirebase);
	//console.log(rentalData);
	
	// bind data to the scope
	rentalData.$bindTo($scope, 'data');

	$scope.editRental = function(rental, id){
		console.log('edit rental...');
		// GET DB Instance
		var ref = firebase.database().ref('rentals/' + id);

		$scope.msg = "Rental Updated";
	}
}]);