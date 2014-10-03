Angular-Collection-Assistant
============================
Small, dependency free module to help manage collection events when using `$watchCollection` within Angular.

Installation
------------
Use bower to install into a project:

	bower install angular-collection-assistant

Then check there is a reference to the script file in your header:

	<script src="/bower_components/angular/angular.min.js"></script>
	<script src="/bower_components/angular-collection-assistant/ng-collection-assistant.js"></script>

Finally bring in the module into your main app:

	var app = angular.module("app", [
		'ngResource',
		'ng-collection-assistant'
	]);

You can now use the collectionAssistant object in your controllers:

	app.controller('widgetController', function($scope, collectionAssistant, Products) {
		$scope.products = Products.query({});

		$scope.$watchCollection('products', function(newProducts, oldProducts) {
			collectionAssistant(newProducts, oldProducts)
				.on('new', function(item) {
					console.log('New item discovered from server!', item);
				});
		});
	}



Example use
===========


	// Somewhere inside an Angular Controller

	$scope.products = [
		{
			id: 'product-foo',
			title: 'Foo',
		},
		{
			id: 'product-bar',
			title: 'Bar',
		},
		{
			id: 'product-baz',
			title: 'Baz',
		}
	];
	
	$scope.$watchCollection('products', function(newProducts, oldProducts) {
		collectionAssistant(newProducts, oldProducts)
			.indexBy('id')
			.on('new', function(item) {
				console.log('New Item!', item);
			});
			.on('deleted', function(item) {
				console.log('Deleted Item!', item);
			});
	});


Enabling deep comparison also allows update detection of individual collection items:

	$scope.$watchCollection('products', function(newProducts, oldProducts) {
		collectionAssistant(newProducts, oldProducts)
			.indexBy('id')
			.deepComparison()
			.on('new', function(item) {
				console.log('New Item!', item);
			});
			.on('deleted', function(item) {
				console.log('Deleted Item!', item);
			})
			.on('update', function(item, oldItem) {
				console.log('Item', item, 'has changed from', oldItem);
			});
	});
