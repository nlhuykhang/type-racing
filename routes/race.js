var randomString = require('randomstring'),
	express = require('express'),
	router = express.Router(),
	Passage = require('../model/passage'),
	waitingTime = 5000,
	numRacer = 5,
	count = numRacer,
	curRaceId,
	curRacerId = [],
	startTime,
	passage = '',
	timeoutObject = null;

var doRespone = function(res) {
	res.send({
		'raceId': curRaceId,
		'racerId': curRacerId,
		'startTime': startTime,
		'passage': passage
	});
};

var initNewRace = function(res, cb) {

	console.log('new race');

	count = 1;

	curRaceId = randomString.generate(5);

	curRacerId = [];

	startTime = new Date().getTime() + waitingTime;

	Passage.getOne(function(err, pa) {
		if (!err){
			passage = pa.content;
			// passage = 'aaaaaaaaaaaaaaaaaaaaaaa';
		}
			

		if (typeof cb === 'function') {
			cb(res);
		}

		clearTimeout(timeoutObject);

		timeoutObject = setTimeout(initNewRace, waitingTime);

	});

};

router.get('/', function(req, res, next) {

	if (curRacerId.indexOf(req.query.id) === -1) {

		curRacerId.push(req.query.id);

		if (count < numRacer) {

			count++;
		} else {

			initNewRace(res, doRespone);

			return;
		}

	}

	doRespone(res);

});

module.exports = router;