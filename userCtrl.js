var User = require('./User');

module.exports = {

	saveProfile: function( req, res ) {
		new User(req.body).save(function( err, newUser ) {
			if (err) {
				return res.status(500).send(err);
			}
			
			res.send(newUser);
			
		});
	}
	, deleteProfile: function( req, res ) {
		User.find({ 'friends': { $in: [req.params.id] } })
			.exec(function( err, results ) {
				results.forEach(function( friend, index ) {
					friend.friends.splice(friend.friends.indexOf(req.params.id), 1);
					friend.save();
				});
			});

		User.findByIdAndRemove(req.params.id)
			.exec(function( err, deletedUser ) {
				if (err) {
					return res.status(500).send(err);
				}
				
				res.send(deletedUser);
				
			});
	}
	, getProfile: function( req, res ) {
		User.findOne({ _id: req.params.id })
				.populate('friends')
				.exec(function( err, user ) {
					if (err) {
						return res.status(500).send(err);
					}
					
					res.send(user);
					
				});

	}

	, searchFriends: function( req, res ) {
		var re = new RegExp(req.query.name, 'i');

		User.findById(req.params.id, function( err, user ) {
			if (err) {
				return res.status(500).send(err);
			}
			
			var excludeFriends = user.friends;

			User.find()
				.where('_id')
				.nin(excludeFriends.concat([req.params.id]))
				.where('name')
				.regex(re)
				.select('name')
				.exec(function( err, potentialFriends ) {
					if (err) {
						return res.status(500).send(err);
					}
					
					res.send(potentialFriends);
					
				});
			
		});
	}

	, addFriend: function( req, res ) {
		User.findById(req.params.id, function( err, user ) {
			if (err) {
				return res.status(500).send(err);
			}
			
			user.friends.push(req.body.friendId);
				
			user.save(function( err, updatedUser ) {
				if (err) {
					return res.status(500).send(err);
				}
				
				res.send(updatedUser);
				
			});
			
		});
	}
	, removeFriend: function( req, res ) {
		User.findById(req.params.id, function( err, user ) {
			if (err) {
				return res.status(500).send(err);
			}
			
			user.friends.pull(req.body.friendId);
			user.save(function( err, updatedUser ) {
				if (err) {
					return res.status(500).send(err);
				}
				
				res.send(updatedUser);
				
			})
		});
	}

	, findFriendsFriends: function( req, res ) {
		User.findById(req.params.friendId)
			.populate('friends')
			.exec(function( err, user ) {
				if (err) {
					return res.status(500).send(err);
				}
				
				console.log(user);
				res.send(user.friends);

			});
	}

}