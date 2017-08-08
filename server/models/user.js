var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	userId: String,
	userName: String,
	userPwd: String,
	orderList: [
		{
			orderId: String,
			orderTotal: Number,
			addressInfo: Object,
			goodsList: Array,
			orderStatus: String,
			createDate : String
		}
	],
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
	addressList: [
		{
			addressId : String,
			userName : String,
			streetName : String,
			postCode : String,
			tel : String,
			isDefault : Boolean
		}
	]
});

module.exports = mongoose.model('User', userSchema);