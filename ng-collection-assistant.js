angular.module('ng-collection-assistant', [])
	.factory('collectionAssistant', [function() {
		return function(newCollection, oldCollection) {
			this._newPointers = {};
			this._oldPointers = {};
			this._created = [];
			this._deleted = [];
			this._same = [];
			this._updated = [];
			this._indexBy = 'id';
			this._deepExamine = false;
			this._dirty = true;

			/**
			* Set the key used to index each item in a collection
			* Defaults to 'id'
			* @param string index The new key to use for indexing
			* @return object This chainable object
			*/
			this.indexBy = function(index) {
				this._indexBy = index;
				this._dirty = true;
				return this;
			};

			/**
			* Internal function used to return the index of an object
			* @param object item The item to examine and return the index of
			* @return string The index of the item
			*/
			this.getIndexOf = function(item) {
				return item[this._indexBy];
			};

			/**
			* Setter for getIndexOf
			* @param function(item) callback Replacement function which indexes items in a collection
			* @return object This chainable object
			*/
			this.indexer = function(callback) {
				this.getIndexOf = callback;
				this._dirty = true;
				return this;
			};

			/**
			* Update detection function if deepComparison is true
			* @param object a The object on the left side to compare
			* @param object b The object on the right side to compare
			* @return bool True if the objects are deep equal
			*/
			this.getUpdates = function(a, b) {
				return JSON.stringify(a) === JSON.stringify(b);
			};

			/**
			* Set whether deep comparison should be used
			* Enabling this will enable update detectin
			* @param bool setting Whether deep comparison is true. Default to true if omitted
			* @return object This chainable object
			*/
			this.deepComparison = function(setting) {
				this._deepExamine = setting || true;
				this._dirty = true;
				return this;
			};

			/**
			* Setter for the deep comparison function
			* @param callback(a, b) callback The callback to use when deep comparing objects a and b
			* @return object This chainable object
			*/
			this.updateDetector = function(callback) {
				this.getUpdates = callback;
				this._dirty = true;
				return this;
			};

			/**
			* Internal function which calculates all parameters
			* @return object This chainable object
			*/
			this.calculate = function() {
				this._created = [];
				this._deleted = [];
				this._same = [];

				angular.forEach(newCollection, function(item, key) {
					console.log('EXAMINE', item, key);
				});

				for (var offset in newCollection) {
					var index = this.getIndexOf(newCollection[offset]);
					this._newPointers[index] = newCollection[offset];
				}

				for (var offset in oldCollection) {
					var index = this.getIndexOf(oldCollection[offset]);
					this._oldPointers[index] = oldCollection[offset];
					if (this._newPointers[index]) { // Exists in both - same
						if (this._deepExamine && !this.getUpdates(this._newPointers[index], this._oldPointers[index])) {
							this._updated.push(index);
						} else {
							this._same.push(index);
						}
					} else { // Exists in old, not in new - delete
						this._deleted.push(index);
					}
				}

				for (var index in this._newPointers) {
					if (!this._oldPointers[index]) { // Exists in new, not in old - new
						this._created.push(index);
					}
				}

				this._dirty = false;

				return this;
			};

			/**
			* Chainable function which runs when collection items are created, deleted etc.
			* @param string type The type of operation to look for. See code for examples.
			* @return object This chainable object
			*/
			this.on = function(type, callback) {
				switch (type) {
					case 'new':
					case 'created':
						return this.newItem(callback);
					case 'delete':
					case 'deleted':
					case 'removed':
						return this.deleteItem(callback);
					case 'nochange':
					case 'same':
					case 'noupdate':
						return this.sameItem(callback);
					case 'update':
					case 'change':
						return this.updateItem(callback);
				}
			};

			/**
			* Function to run on each new item discovered in a collection set
			* @param callback(item) callback The callback to execute on each new item
			* @return object This chainable object
			* @see On()
			*/
			this.newItem = function(callback) {
				if (this._dirty) this.calculate();
				for (var offset in this._created) {
					callback(_newPointers[this._created[offset]]);
				}
			};

			/**
			* Function to run on each item discovered to be deleted in a collection set
			* @param callback(item) callback The callback to execute on each deleted item
			* @return object This chainable object
			* @see On()
			*/
			this.deleteItem = function(callback) {
				if (this._dirty) this.calculate();
				for (var offset in this._deleted) {
					callback(_oldPointers[this._deleted[offset]]);
				}
			};

			/**
			* Function to run on each item discovered to be unchanged in a collection set
			* @param callback(item) callback The callback to execute on each unchanged item
			* @return object This chainable object
			* @see On()
			*/
			this.sameItem = function(callback) {
				if (this._dirty) this.calculate();
				for (var offset in this._same) {
					callback(_oldPointers[this._same[offset]]);
				}
			};

			/**
			* Function to run on each updated item collection set
			* This function can only run if DeepComparison() is called first
			* @param callback(item, oldItem) callback The callback to execute on each changed item
			* @return object This chainable object
			* @see On()
			*/
			this.updateItem = function(callback) {
				if (this._dirty) this.calculate();
				for (var offset in this._updated) {
					callback(_newPointers[this._updated[offset]], _oldPointers[this._updated[offset]]);
				}
			};

			return this;
		};
	}]);

