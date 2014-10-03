Angular-Collection-Assistant
============================
Small, dependency free module to help manage collection events when using `$watchCollection` within Angular.


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
