var express = require('express'),
	router = express.Router();
	
	
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express',
		content: 'I am making something fun'
	});
});

module.exports = router;