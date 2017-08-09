var express = require('express');
var router = express.Router();

require('../util/util');
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

//获取购物车
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

//获取购物车数量
router.get('/getCart',(req,res,next)=>{
	let userId = req.cookies.userId;
	User.findOne({userId: userId}, (err,user)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else{
			let cartCount = 0;
			user.cartList.forEach((item)=>{
				cartCount += item.productNum;
			})
			res.json({
				status: '0',
				msg: '',
				result: cartCount
			});
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
});

//设置默认地址
router.post('/setDefault',(req,res,next)=>{
	let userId = req.cookies.userId,
			addressId = req.body.address.addressId;
	if(!addressId){
		res.json({
			status: '1003',
			msg: 'addressId is null',
			result: ''
		});
	}else{
		User.findOne({userId: userId}, (err, user)=>{
			if(err){
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				});
			}else{
				user.addressList.forEach((item)=>{
					item.isDefault = false;
					if(addressId == item.addressId){
						item.isDefault = true;
					}
				});
				user.save((err1, doc)=>{
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
	}	
});

//删除地址
router.post('/addressDel',(req,res,next)=>{
	let userId = req.cookies.userId,
			addressId = req.body.addressId;
	User.update({userId: userId},{$pull:{'addressList':{'addressId':addressId}}},(err,user)=>{
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

//订单页
router.post('/payMent',(req,res,next)=>{
	let userId = req.cookies.userId,
			addressId = req.body.addressId
			orderTotal = req.body.orderTotal
			User.findOne({userId: userId}, (err1,doc1)=>{
				if(err1){
					res.json({
						status: '1',
						msg: err1.message,
						result: ''
					});
				}else{
					let address = {},
							goodsList = [];
					//获取用户当前地址
					doc1.addressList.some((item)=>{
						if(item.addressId == addressId){
							address = item;
							return true;
						}
					});
					//获取用户购买商品
					doc1.cartList.forEach((item)=>{
						if(item.checked == '1'){
							goodsList.push(item);
						}
					});

					let paltform = '622',
							r1 = Math.floor(Math.random()*10),
							r2 = Math.floor(Math.random()*10),
							sysDate = new Date().Format('yyyyMMddhhmmss'),
							createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
					let orderId = paltform + r1 + sysDate + r2;

					let order = {
						orderId: orderId,
						orderTotal: orderTotal,
						addressInfo: address,
						goodsList: goodsList,
						orderStatus: '1',
						createDate: createDate
					};

					doc1.orderList.push(order);
					doc1.save((err2, doc2)=>{
						if(err2){
							res.json({
								status: '1',
								msg: err2.message,
								result: ''
							});
						}else{
							res.json({
								status: '0',
								msg: '',
								result: {
									orderId: order.orderId,
									orderTotal: order.orderTotal
								}
							});
						}
					})
				}
			})
});

//订单详细
router.post('/orderDetail', (req,res,next)=>{
	let userId = req.cookies.userId,
			orderId = req.body.orderId;
	User.findOne({userId: userId}, (err, user)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else{
			let orderList = user.orderList;
			if(orderList.length > 0){
				let orderTotal = 0;
				orderList.forEach((item)=>{
					if(item.orderId == orderId){
						orderTotal = item.orderTotal;
					}
				});
				if(orderTotal > 0){
					res.json({
						status: '0',
						msg: '',
						result: {
							orderId: orderId,
							orderTotal: orderTotal
						}
					});
				}else{
					res.json({
						status: '12002',
						msg: '无此订单',
						result: ''
					});
				}
			}else{
				res.json({
					status: '12001',
					msg: '当前用户未创建订单',
					result: ''
				});
			}
		}
	})
})
module.exports = router;
