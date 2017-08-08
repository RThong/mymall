var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://127.0.0.1:27017/mymall', {useMongoClient:true});
// var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.end('index')

});
// User.findOne({userName: 'admin'},(err,user)=>{
// 	var a = [{"addressId":"100001","userName":"JackBean","streetName":"北京市朝阳区朝阳公园","postCode":"100001","tel":"12345678901","isDefault":true},{"addressId":"100004","userName":"Mary","streetName":"北京市朝阳区SOHO","postCode":"100005","tel":"010555555","isDefault":false},{"addressId":"100005","userName":"Donie","streetName":"北京市海淀区西二旗","postCode":"100009","tel":"18710987654","isDefault":false},{"addressId":"100006","userName":"Cherry","streetName":"北京市海淀区回龙观","postCode":"100009","tel":"010655555","isDefault":false},{"addressId":"100007","userName":"Joke","streetName":"北京市朝阳区望京","postCode":"100010","tel":"13619898722","isDefault":false},{"addressId":"100008","userName":"Frank","streetName":"北京市海淀区中关村软件园","postCode":"100011","tel":"10125652345","isDefault":false}]
// 	user.addressList.push(...a)
// 	user.save()
// })
module.exports = router;