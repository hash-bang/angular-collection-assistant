collectionAssistant = function(newCollection, oldCollection) {
	this._newPointers = {};
	this._oldPointers = {};
	this._created = [];
	this._deleted = [];
	this._same = [];
	this._updated = [];
	this._indexBy = null;
	this._deepExamine = false;

	this.indexBy = function(index) {
		this._indexBy = index;
		this.calculate();
		return this;
	};

	this.getIndexOf = function(item) {
		return item[this._indexBy];
	};

	this.indexer = function(callback) {
		this.getIndexOf = callback;
		return this;
	};

	this.getUpdates = function(a, b) {
		return JSON.stringify(a) === JSON.stringify(b);
	};

	this.deepComparison = function(setting) {
		this._deepExamine = setting;
		return this;
	};

	this.updateDetector = function(callback) {
		this.getUpdates = callback;
	};

	this.calculate = function() {
		this._created = [];
		this._deleted = [];
		this._same = [];

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

		return this;
	};

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

	this.newItem = function(callback) {
		for (var offset in this._created) {
			callback(_newPointers[this._created[offset]]);
		}
	};

	this.deleteItem = function(callback) {
		for (var offset in this._deleted) {
			callback(_oldPointers[this._deleted[offset]]);
		}
	};

	this.sameItem = function(callback) {
		for (var offset in this._same) {
			callback(_oldPointers[this._same[offset]]);
		}
	};

	this.updateItem = function(callback) {
		for (var offset in this._updated) {
			callback(_newPointers[this._updated[offset]]);
		}
	};

	return this;
};

module.exports = collectionAssistant;
