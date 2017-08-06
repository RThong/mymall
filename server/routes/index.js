var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://127.0.0.1:27017/mymall', {useMongoClient:true});


/* GET home page. */
router.get('/', function(req, res, next) {
	res.end('index')

});

module.exports = router;