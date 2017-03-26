var colors = require('colors'),
express = require('express'),
bodyParser = require('body-parser'),
http = require('http');
var app = express();
var server = http.createServer(app)
var io = require('socket.io').listen(server);

//Initialize global variables up here
var serverNumber = 8081;
var hash = {};

//used for sending html files
var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/View'); // tell Express where to find templates, in this case the '/View' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages 


//use body-parser to parse the request body whenever the app receives a POST request, now we can access the requests body for its data parameters
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/View'));
//Store all JS and CSS in Scripts folder.
app.use(express.static(__dirname + '/Script'));


// Database module to hold messages
var anydb = require('any-db');
var conn = anydb.createConnection('sqlite3://chatroom.db');
conn.query(
   'CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, room TEXT, nickname TEXT, body TEXT)'
).on('close', function() {
   console.log("TABLE SUCCESSFULLY CREATED");
}).on('error', function() {
   console.log("TABLE FAILED TO CREATE");
});


var chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ123456789";
var charLen = 6;

function generateRoomIdentifier(){
	//make a list of legal characters
	var result = "";
	for(var i = 0; i < charLen; i++){
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	if(hash[result] === true){
		result = generateRoomIdentifier();
	}
	hash[result] = true;
	return result;
}


app.get('/', function(request, response){
  console.log('- Request received:', request.method.cyan, request.url.underline);
  response.render('index.html');
});

app.get('/newRoom', function(req, res){
	console.log('- Request received:', req.method.cyan, req.url.underline);
	var roomId = generateRoomIdentifier();
	res.json({roomId: roomId});
});

app.get('/:roomID', function(request, response) {
   var roomID = request.params.roomID;
   response.render('room.html', {roomID: roomID});
});

app.post('/checkRoom', function(req, res){
	console.log('- Request received:', req.method.red, req.url.underline);
	console.log(req.body);
	var room;
	var roomNum = req.body.roomId;
	if(hash[roomNum] === true){
		res.json({room: true})
	} else{
		res.json({room: false})
	}
});

//REQUESTS IN CHARGE OF MESSAGES

app.post('/:roomID/messages', function(req, res){
	var room = req.params.roomID;
	var nickname = req.body.nickname;
	var body = req.body.message;
	conn.query("INSERT INTO messages (room, nickname, body) values ($1, $2, $3)", [room, nickname, body]).on('close', function(){
		res.json({statusR: "success"});
		}).on('error', function(){
		res.json({statusR: "error"});
	});
});

app.get('/:roomID/messages', function(req, res){
	var sql = 'SELECT id, nickname, body FROM messages WHERE room=$1 ORDER BY id ASC';
	var q = conn.query(sql, [req.params.roomID], function(error, result){
		var messages = result.rows;
		res.json({messages: messages});
	});
});


function getMessages(roomId){
	console.log('messages');
	var sql = 'SELECT id, nickname, body FROM messages WHERE room=$1 ORDER BY id ASC';
	var q = conn.query(sql, roomId, function(error, result){
		var messages = result.rows;
		console.log(messages);
		return messages;
	});
}


//NEW FUNCTIONS TO IMPLEMENT


//obtain a socket object or collection of socket objects and then call the emit method, the first parameter is name of the message, and any subsequent parameters are sent as function arguments


io.sockets.on('connection', function(socket){
  //clients emit this when they join new rooms
	socket.on('join', function(roomName, nickname, callback){
		//this is a socket.io method
		console.log(nickname + " joined chat in room " + roomName);
		socket.join(roomName);//socket.io method
		socket.nickname = nickname;//yay java script
		//callback method
		var sql = 'SELECT id, nickname, body FROM messages WHERE room=$1 ORDER BY id ASC';
		var q = conn.query(sql, roomName, function(error, result){
			var messages = result.rows;
			callback(messages);
		});
	});

	socket.on('message', function(message){
		var roomName = Object.keys(io.sockets.adapter.sids[socket.id][1]);
	});
	
	socket.on('disconnect', function(){

	});
	socket.on('error', function(){
		console.log("error with sockets");
	});


});

//LISTEN ON THIS PORT
server.listen(serverNumber, function(){
  console.log(('- Server listening on port '+ serverNumber + '').grey);
});






