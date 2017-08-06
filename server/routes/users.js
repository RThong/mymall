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
				msg: err.message,
				result: ''
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
					msg: '用户名或密码错误',
					result: ''
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

router.get('/cart', (req,res,next)=>{
	User.findOne({userId: req.cookies.userId}, (err,user)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else{
			res.json({
				status: '0',
				msg: '',
				result: user.cartList
			})
		}
	})
});

//删除购物车商品
router.post('/cartDel',(req,res,next)=>{
	let userId = req.cookies.userId,
			productId = req.body.productId;
	User.update({userId: userId},{$pull:{'cartList':{'productId':productId}}},(err,user)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else{
			res.json({
				status: '0',
				msg: '',
				result: 'suc'
			});
		}
	});
});

//修改购物车
router.post('/cartEdit', (req,res,next)=>{
	let userId = req.cookies.userId,
			productId = req.body.product.productId,
			productNum = req.body.product.productNum,
			checked = req.body.product.checked;
	User.update({userId: userId, 'cartList.productId': productId},
	{
		'cartList.$.productNum': productNum,
		'cartList.$.checked': checked
	},(err, user)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else{
			res.json({
				status: '0',
				msg: '',
				result: 'suc'
			});
		}
	})
});

//购物车全选
router.get('/cartSelectAll',(req,res,next)=>{
	let userId = req.cookies.userId;
	User.findOne({userId: userId}, (err, doc)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else{
			doc.cartList.forEach((item)=>{
				item.checked = '1';
			});
			doc.save((err1, user)=>{
				if(err1){
					res.json({
						status: '1',
						msg: err1.message,
						result: ''
					});
				}else{
					res.json({
						status: '0',
						msg: '',
						result: ''
					});
				}	
			})
		}
	});
});

//购物车反选
router.get('/cartReverseSelect',(req,res,next)=>{
	let userId = req.cookies.userId;
	User.findOne({userId: userId}, (err, doc)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else{
			doc.cartList.forEach((item)=>{
				item.checked = '0';
			});
			doc.save((err1, user)=>{
				if(err1){
					res.json({
						status: '1',
						msg: err1.message,
						result: ''
					});
				}else{
					res.json({
						status: '0',
						msg: '',
						result: ''
					});
				}	
			})
		}
	});
});

//地址列表接口
router.get('/addressList', (req,res,next)=>{
	let userId = req.cookies.userId;
	User.findOne({userId: userId}, (err, user)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else{
			res.json({
				status: '0',
				msg: '',
				result: {
					count: user.addressList.length,
					list: user.addressList
				}
			});
		}	
	})
})
module.exports = router;
