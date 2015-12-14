var   express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, cors = require('cors')
	, mongoose = require('mongoose')
	, userCtrl = require('./userCtrl')
	, port = 8081
	, mongoUri = 'mongodb://localhost:27017/devMtIn';

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));

mongoose.connect(mongoUri);
mongoose.connection.once('open', function() {
	console.log('Connected to MongoDB at ' + mongoUri);
});

app.get('/api/profiles/:id', userCtrl.getProfile);
app.post('/api/profiles', userCtrl.saveProfile);
app.delete('/api/profiles/:id', userCtrl.deleteProfile);

app.get('/api/friends/:id', userCtrl.searchFriends);
app.put('/api/friends/:id', userCtrl.addFriend);
app.put('/api/friends/remove/:id', userCtrl.removeFriend);
app.get('/api/friends-friends/:friendId', userCtrl.findFriendsFriends);

app.listen(port, function() {
	console.log('Listening on ' + port);
});