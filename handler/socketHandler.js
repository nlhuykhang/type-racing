var globalVar = require('../globalVar');

module.exports = function(socket) {

	socket.on('attend', function(data) {

		globalVar.io.emit('newRacer' + data.raceId, {
			'racerId': data.racerId
		});

		socket.on('position' + data.racerId, function(d){
			globalVar.io.emit('update' + data.raceId, {
				'racerId': d.racerId,
				'position': d.position,
				'speed': d.speed
			});
		});

		socket.on('finish', function(d){
			globalVar.io.emit('finish' + data.raceId, {
				'racerId': d.racerId
			});
		});

	});

}