var collectionAssistant = require("./ng-collection-assistant");
var assert = require("assert");

// Detect append {{{
var newItems = [];
collectionAssistant([
	{id: 'id1', name: 'foo'},
	{id: 'id2', name: 'bar'},
	{id: 'id3', name: 'baz'},
	{id: 'id4', name: 'quz'},
], [
	{id: 'id1', name: 'foo'},
	{id: 'id2', name: 'bar'},
	{id: 'id3', name: 'baz'},
])
	.indexBy('id')
	.on('new', function(i) {
		newItems.push(i);
	});

assert.deepEqual(
	newItems,
	[
		{id: 'id4', name: 'quz'},
	]
);
// }}}
// Detect spliced items {{{
var newItems = [];
collectionAssistant([
	{id: 'id1', name: 'foo'},
	{id: 'id2', name: 'bar'},
	{id: 'id3', name: 'baz'},
	{id: 'id4', name: 'quz'},
	{id: 'id5', name: 'quuz'}
], [
	{id: 'id1', name: 'foo'},
	{id: 'id3', name: 'baz'},
	{id: 'id4', name: 'quz'},
])
	.indexBy('id')
	.on('new', function(i) {
		newItems.push(i);
	});

assert.deepEqual(
	newItems,
	[
		{id: 'id2', name: 'bar'},
		{id: 'id5', name: 'quuz'}
	]
);
// }}}
// Detect deletes {{{
var deletedItems = [];
collectionAssistant([
	{id: 'id1', name: 'foo'},
	{id: 'id2', name: 'bar'},
	{id: 'id4', name: 'quz'},
	{id: 'id5', name: 'quuz'}
], [
	{id: 'id1', name: 'foo'},
	{id: 'id2', name: 'bar'},
	{id: 'id3', name: 'baz'},
	{id: 'id4', name: 'quz'},
	{id: 'id5', name: 'quuz'}
])
	.indexBy('id')
	.on('delete', function(i) {
		deletedItems.push(i);
	});

assert.deepEqual(
	deletedItems,
	[
		{id: 'id3', name: 'baz'}
	]
);
// }}}
// Detect items with no updates {{{
var sameItems = [];
collectionAssistant([
	{id: 'id1', name: 'foo'},
	{id: 'id2', name: 'bar'},
	{id: 'id5', name: 'quuz'}
], [
	{id: 'id1', name: 'foo'},
	{id: 'id2', name: 'bar'},
	{id: 'id3', name: 'baz'},
	{id: 'id4', name: 'quz'},
	{id: 'id5', name: 'quuz'}
])
	.indexBy('id')
	.on('same', function(i) {
		sameItems.push(i);
	});

assert.deepEqual(
	sameItems,
	[
		{id: 'id1', name: 'foo'},
		{id: 'id2', name: 'bar'},
		{id: 'id5', name: 'quuz'}
	]
);
// }}}
// Detect items updates {{{
var updatedItems = [];
collectionAssistant([
	{id: 'id1', name: 'foo'},
	{id: 'id2', name: 'barx'},
	{id: 'id5', name: 'quuz'}
], [
	{id: 'id1', name: 'foo'},
	{id: 'id2', name: 'bar'},
	{id: 'id3', name: 'baz'},
	{id: 'id4', name: 'quz'},
	{id: 'id5', name: 'quuz'}
])
	.deepComparison(true)
	.indexBy('id')
	.on('update', function(i) {
		updatedItems.push(i);
	});

assert.deepEqual(
	updatedItems,
	[
		{id: 'id2', name: 'barx'}
	]
);
// }}}

console.log('OK!');
