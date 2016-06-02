var   express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, cors = require('cors')
	, mongoose = require('mongoose')
	, userCtrl = require('./userCtrl')
	, port = 8081
	, mongoUri = 'mongodb://localhost:27017/devMtIn';

	try{
		mongoUri = require('./config.js').mongoUri;
	}catch(e){
		mongoUri = 'mongodb://localhost:27017/devMtIn'
	}

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));

mongoose.connect(mongoUri);
mongoose.connection.once('open', function() {
	console.log('Connected to MongoDB at ' + mongoUri);
});

app.get('/api/profiles/:id', userCtrl.getProfile);
app.post('/api/profiles', userCtrl.saveProfile);
app.put('/api/profiles/:id', userCtrl.updateProfile);
app.delete('/api/profiles/:userId', userCtrl.deleteProfile);

app.delete('/api/profiles/:userId/friends/:friendId', userCtrl.removeFriend);
app.put('/api/profiles/:userId/friends/:friendId', userCtrl.addFriend);

app.get('/api/friends/:userId', userCtrl.searchFriends);
app.get('/api/friends-friends/:friendId', userCtrl.findFriendsFriends);

app.listen(port, function() {
	console.log('Listening on ' + port);
});
