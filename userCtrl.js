var User = require('./User');

module.exports = {

	saveProfile: function( req, res ) {
		new User(req.body).save(function( err, newUser ) {
			if (err) {
				return res.status(500).send(err);
			}

			res.send(newUser);

		});
	},
	updateProfile: function(req, res){
		User.findByIdAndUpdate(req.params.id, req.body, function(err, result){
			if(err)	res.status(500).send(err);
			else res.status(200).send(result);

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
  , getProfiles: function( req, res ) {
    var qry={};
    for( prop in req.query){
      qry[prop] = new RegExp(req.query[prop],'i');
    }
		User.find(qry)
        .limit(50)
        .select('name bio tagline profileUrl')
				.exec(function( err, user ) {
					if (err) {
						return res.status(500).send(err);
					}

					res.send(user);

				});

	}

	, searchFriends: function( req, res ) {
		var re = new RegExp(req.query.name, 'i');

		User.findById(req.params.userId, function( err, user ) {
			if (err) {
				return res.status(500).send(err);
			}

			var excludeFriends = user.friends;

			User.find()
				.where('_id')
				.nin(excludeFriends.concat([req.params.userId]))
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
		User.findById(req.params.userId, function( err, user ) {
			if (err) {
				return res.status(500).send(err);
			}

			user.friends.push(req.params.friendId);

			user.save(function( err, updatedUser ) {
				if (err) {
					return res.status(500).send(err);
				}

				res.send(updatedUser);

			});

		});
	}
	, removeFriend: function( req, res ) {
		User.findById(req.params.userId, function( err, user ) {
			if (err) {
				return res.status(500).send(err);
			}

			user.friends.pull(req.params.friendId);
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
