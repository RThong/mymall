var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Goods = require('../models/goods');

router.get('/',(req,res,next)=>{
	let page = parseInt(req.query.page),
			pageSize = parseInt(req.query.pageSize)
			sort = req.query.sort,
			skip = (page-1)*pageSize,
			query = {};

	let goodsModel = Goods.find(query).skip(skip).limit(pageSize);
	goodsModel.sort({'salePrice': sort});

	goodsModel.exec((err,docs)=>{
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

module.exports = router;