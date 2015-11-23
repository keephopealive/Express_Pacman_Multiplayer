var express = require('express');
var app = express();

var server = app.listen(1337);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + "/static"));



var theWorld = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,2,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
	[0,2,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
	[0,2,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
	[0,2,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
	[0,2,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
	[0,2,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
	[0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

];

function PacMan(y,x,z){
	this.y = y;
	this.x = x;
	this.id = z;
	this.score = 0;
}
var players = [];




function updatePacManPos(player, keyCode, callback){
	if(keyCode == 38){ // Up
		if( theWorld[player.y-1][player.x] !== 0 ){ 
			theWorld[player.y][player.x] = 1; // update map where he was
			player.y -= 1; // update pacman
			theWorld[player.y][player.x] = 4; // update map where he is
			callback();
		}
	} 
	else if(keyCode == 39){ // Right
		console.log(player);
		if( theWorld[player.y][player.x+1] !== 0 ){ 
			theWorld[player.y][player.x] = 1; // update map where he was
			player.x += 1; // update pacman
			theWorld[player.y][player.x] = 4; // update map where he is
			callback();
		}
	} 
	else if(keyCode == 40){ // Down
		if( theWorld[player.y+1][player.x] !== 0 ){ 
			theWorld[player.y][player.x] = 1; // update map where he was
			player.y += 1; // update pacman
			theWorld[player.y][player.x] = 4; // update map where he is
			callback();
		}
	} 
	else if(keyCode == 37){ // Left
		if( theWorld[player.y][player.x-1] !== 0 ){ 
			theWorld[player.y][player.x] = 1; // update map where he was
			player.x -= 1; // update pacman
			theWorld[player.y][player.x] = 4; // update map where he is
			callback();
		}
	} 

}

io.sockets.on('connection', function(socket){
	console.log("CONNECTING", socket.id);
	if(players.length < 3){
		players.push(new PacMan(4,9,socket.id));
		theWorld[4][9] = 4;
		io.emit('updateWorld', {world: theWorld});
	}

	socket.on('move', function(data){
		console.log(socket.id);
		for(var i = 0; i < players.length; i++){
			if(players[i].id == socket.id){
				updatePacManPos(players[i], data.keyCode, function(){
						console.log("2222")
					io.emit('updateWorld', {world: theWorld});
				});
			}
		}
	})

	socket.on('disconnect', function(){
		console.log("DISCONNECTING... ", socket.id);
		for(var i = 0; i < players.length; i++){
			if(players[i].id == socket.id){
				players.splice(i,1);
				console.log(players);
				io.emit('updateWorld', {world: theWorld});
			}
		}
	})

});