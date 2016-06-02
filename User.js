var mongoose = require('mongoose');

var User = new mongoose.Schema({
	name: { type: String, required: true }
	, tagline: String
	, bio: String
	, profileUrl: String
	, friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}) 

module.exports = mongoose.model('User', User);
