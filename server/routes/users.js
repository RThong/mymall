var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/checkLogin', function(req, res, next) {
  if(req.cookies.userId){
  	res.json({
  		status: '0',
  		msg: '',
  		result: {
  			userName: req.cookies.userName
  		}
  	})
  }else{
  	res.json({
  		status: '1',
  		msg: '未登录',
  		result: ''
  	})
  }
});

router.post('/login', (req, res, next)=>{
	let query={
		userName: req.body.userName,
		userPwd: req.body.userPwd
	};

	User.findOne(query,(err,user)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message
			});
		}else{
			if(user){
				res.cookie('userId',user.userId,{
					path: '/',
					maxAge: 1000*60*60
				});
				res.cookie('userName',user.userName,{
					path: '/',
					maxAge: 1000*60*60
				});
				res.json({
					status: '0',
					msg: '',
					result: user
				});
			}else{
				res.json({
					status: '1',
					msg: '用户名或密码错误'
				});
			}
		}
	})
});

router.post('/logout', (req, res, next)=>{
	res.cookie('userId','',{
		path: '/',
		maxAge: -1
	});
	res.cookie('userName','',{
		path: '/',
		maxAge: -1
	});
	res.json({
		status: '0',
		msg: '',
		result: ''
	});
});
module.exports = router;
