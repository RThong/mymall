var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Good = require('../models/good');
var User = require('../models/user');

//获取商品列表
router.get('/list',(req,res,next)=>{
	let page = parseInt(req.query.page),
			pageSize = parseInt(req.query.pageSize),
			priceLevel = req.query.priceLevel,
			sort = req.query.sort,
			skip = (page-1)*pageSize,
			startPrice,
			endPrice,			
			query = {};

	if(priceLevel != 'all'){
		switch (priceLevel) {
			case '0': 
				startPrice = 0;endPrice = 100;
				break;
			case '1': 
				startPrice = 100;endPrice = 500;
				break;
			case '2': 
				startPrice = 500;endPrice = 1000;
				break;
			case '3': 
				startPrice = 1000;endPrice = 5000;
				break;
		}
		query = {
			salePrice: {
				$gt: startPrice,
				$lt: endPrice
			}
		}
	}
	let goodModel = Good.find(query).skip(skip).limit(pageSize);
	goodModel.sort({'salePrice': sort});

	goodModel.exec((err,docs)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count: docs.length,
					list: docs
				}
			});
		}
	})
});

//添加购物车
router.post('/addCart',(req,res,next)=>{
	let productId = req.body.productId,
			userId = '100000077';
	User.findOne({userId: userId},(err,userDoc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err1.message
			});
		}else{
			let goodItem;
			userDoc.cartList.some((item)=>{
				if(item.productId == productId){
					goodItem = item;
					item.productNum ++;
					return true;
				}
			});
			if (goodItem) {
				userDoc.save((err2,userDoc1)=>{
					if(err2){
						res.json({
							status:'1',
							msg:err2.message
						});
					}else{
						res.json({
							status:'0',
							msg:'',
							result:'success'
						});
					}
				});
			}else{
				Good.findOne({productId: productId},(err1,goodDoc)=>{
					if(err1){
						res.json({
							status:'1',
							msg:err1.message
						});
					}else{
						let doc = goodDoc.toObject();
						doc.checked = '1';
						doc.productNum = 1;
						userDoc.cartList.push(doc);
						
						userDoc.save((err2,userDoc1)=>{
							if(err2){
								res.json({
									status:'1',
									msg:err2.message
								});
							}else{
								res.json({
									status:'0',
									msg:'',
									result:'success'
								});
							}
						});
					}
				});
			}	
		}
	});
});
module.exports = router;