var mongoose = require('mongoose');

var User = new mongoose.Schema({
	name: { type: String, required: true }
	, likes: String
	, favColor: String
	, friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('User', User);