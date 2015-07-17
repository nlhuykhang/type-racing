;(function(window, $, undefine) {
	var socket = io(),
		passage = $('#content').text().replace('Let race: ', ''),
		curText = '',
		laneWidth = 800,
		inputEl = $('input'),
		laneColor = ['aquamarine', 'rgb(150, 125, 244)', 'rgb(244, 125, 134)', 'rgb(125, 244, 140)', 'rgb(244, 220, 125)'],
		iColor = 0;

	var username = prompt('what your name?'),
		racers = [],
		startTime = 0;


	var addNewLane = function(userId) {
			$('#lane').append('<span>' +
				userId +
				'</span>' + '<span id=speed' +
				userId +
				'>: 0 word per minute</span>' + '<div id="lane' +
				userId +
				'" style="background-color: ' +
				laneColor[(iColor++) % 5] +
				';height: 20px; width: 30px">' +
				' ' +
				'<img src="images/runner.gif" style="padding-left:30px;position: absolute"></div><br>');
		},
		newRacerHandler = function(data) {
			if (racers.indexOf(data.racerId) === -1) {
				addNewLane(data.racerId);
				racers.push(data.racerId);
			}
		},
		updateHandler = function(data) {

			var position = ((data.position * laneWidth) / passage.length) + 10;

			$('#lane' + data.racerId).width(position + 'px');

			$('#lane' + data.racerId + ' img').css({
				'padding-left': position
			});

			$('#speed' + data.racerId).text(': ' + data.speed + ' word per minute');

			if (data.racerId === username && position === laneWidth + 10) {

				$('input').hide();

				$('#lane' + data.racerId + ' img').attr('src', 'images/winner.gif');

				socket.emit('finish', {
					'racerId': username
				});
			}
		},
		finishHandler = function(data) {
			if (username !== data.racerId) {

				$('#lane' + data.racerId + ' img').attr('src', 'images/winner.gif');

			}
		},
		initRace = function() {

			inputEl.val('');

			racers = [];

			curText = '';

			$('#lane').children().remove();

			$('#type-area span').remove();

			$.get('/race', {
				'id': username
			}, function(data) {

				racers = data.racerId;

				racers.forEach(function(userId) {
					addNewLane(userId);
				});

				passage = data.passage;

				$('#content').text(passage);

				socket.on('newRacer' + data.raceId, newRacerHandler);

				socket.on('update' + data.raceId, updateHandler);

				socket.on('finish' + data.raceId, finishHandler);

				function cd(countdown) {

					inputEl.prev().remove();

					if (countdown < 0) {

						inputEl.show();

						inputEl.focus();

					} else {

						inputEl.before('<span style="color: aquamarine; background-color: purple"><b>' +
							(countdown ? countdown : 'Go') +
							'</b></span>');

						setTimeout(cd, 1000, countdown - 1);
					}
				}

				startTime = data.startTime;

				cd(parseInt((startTime - (new Date().getTime())) / 1000));

				socket.emit('attend', {
					'raceId': data.raceId,
					'racerId': username
				});

			});
		};


	$('#type-area').click(function(e) {

		inputEl.focus();
	});

	inputEl.on('keydown', function(e) {
		if (e.which === 8) {
			curText = curText.slice(0, -1);
			$(this).prev().remove();
		}
	});

	inputEl.on('input', function(e) {

		var text = curText += $(this).val(),
			lastCharacter = text[text.length - 1],
			index = (passage.indexOf(text) === 0) ? text.length : 0,
			el = $(this);


		if (lastCharacter === ' ') {
			lastCharacter = '&nbsp;';
		}

		if (index === 0) {
			el.before('<span style="color: red; background-color: yellow"><del>' +
				lastCharacter +
				'</del></span>');
		} else {
			el.before('<span style="color: aquamarine; background-color: purple"><b>' +
				lastCharacter +
				'</b></span>');
		}

		socket.emit('position' + username, {
			'racerId': username,
			'position': index,
			'speed': (index ? parseInt(text.split(' ').length * 60000 / (new Date().getTime() - startTime)) : 0)
		});

		$(this).val('');
	});


	$('#let-race').on('click', initRace);

	$('#let-race').hover(function(e) {
		console.log('in');
		$(this).css({
			'background-color': 'rgb(0, 255, 236)',
			'border': '5px solid rgb(250, 157, 14)'
		});
	}, function(e) {
		console.log('out');
		$(this).css({
			'background-color': 'chartreuse',
			'border': '5px solid #FA0E3B'
		});
	})

	initRace();

})(window, $);