var mongoose = require('mongoose'),
	passageSchema = new mongoose.Schema({
		content: String
	});


passageSchema.statics.getOne = function(cb) {
	return this.find(function(err, passages) {
			cb(err, passages[parseInt(Math.random() * passages.length)]);
	});
};

var Passage = mongoose.model('Passage', passageSchema);

module.exports = Passage;

