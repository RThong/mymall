var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Goods = require('../models/goods');

router.get('/',(req,res,next)=>{
	Goods.find({},(err,docs)=>{
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