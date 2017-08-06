var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	userId: String,
	userName: String,
	userPwd: String,
	orderList: Array,//
	cartList:[
		{
			productId: String,
			productName: String,
			salePrice: Number,
			productImage: String,
			checked: String,
			productNum : Number
		}
	],
	addressList: Array
});

module.exports = mongoose.model('User', userSchema);