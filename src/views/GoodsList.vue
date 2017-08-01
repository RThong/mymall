<template>
	<div>
		<nav-header></nav-header>
		<nav-bread>
			<span>Goods</span>
		</nav-bread>
		<div class="accessory-result-page accessory-page">
			<div class="container">
				<div class="filter-nav">
					<span class="sortby">Sort by:</span>
					<a href="javascript:void(0)" class="default cur">Default</a>
					<a href="javascript:void(0)" class="price" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
					<a href="javascript:void(0)" class="filterby stopPop" @click="openFilter()">Filter by</a>
				</div>
				<div class="accessory-result">
					<!-- filter -->
					<div class="filter stopPop" v-bind:class="{'filterby-show':filterbyChecked}" id="filter">
						<dl class="filter-price">
							<dt>Price:</dt>
							<dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="priceCheck()">All</a></dd>
							<dd v-for="(price,index) in priceFilter">
								<a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==index}" @click="priceCheck(index)">{{price.startPrice}} - {{price.endPrice}}</a>
							</dd>
							
						</dl>
					</div>

					<!-- search result accessories list -->
					<div class="accessory-list-wrap">
						<div class="accessory-list col-4">
							<ul>
								<li v-for="item in goodsList">
									<div class="pic">
										<a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{item.productName}}</div>
										<div class="price">{{item.salePrice}}</div>
										<div class="btn-area">
											<a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
										</div>
									</div>
								</li>
								
							</ul>
							<div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
								<img src="../assets/loading-spinning-bubbles.svg" alt="加载中..." v-if="loading">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="md-overlay" v-if="mdChecked" @click="closeFilter()"></div>
		<nav-footer></nav-footer>
	</div>    
</template>
<style>
	.load-more{
		height: 100px;
		line-height: 100px;
		text-align: center;
	}
</style>
<script>
	import '@/assets/css/base.css'
	import '@/assets/css/product.css'
	import NavHeader from '@/components/NavHeader'//名称不能与普通标签冲突
	import NavFooter from '@/components/NavFooter'
	import NavBread from '@/components/NavBread'
	import axios from 'axios'

	export default {
	  data () {
	    return {
	      goodsList: [],
	      priceFilter: [
		      {
		      	startPrice: '0',
		      	endPrice: '100'
		      },
		      {
		      	startPrice: '100',
		      	endPrice: '500'
		      },
		      {
		      	startPrice: '500',
		      	endPrice: '1000'
		      },
		      {
		      	startPrice: '1000',
		      	endPrice: '5000'
		      }
	      ],
	      priceChecked: 'all',
	      filterbyChecked: false,
	      mdChecked: false,
	      loading: false,//控制loading图
	      sortFlag: true,//控制升序降序
	      page: 1,
	      pageSize: 8,
	      busy: true,
	      flag: false//控制是否继续加载,

	    }
	  },
	  components:{
	  	NavHeader,
	  	NavFooter,
	  	NavBread //es6
	  },
	  mounted(){
	  	this.getGoodsList();
	  },
	  methods:{
	  	getGoodsList(flag){	  		
	  		axios.get('/goods', {
	  			params: {
	  				page: this.page,
	  				pageSize: this.pageSize,
	  				sort: this.sortFlag?1:-1,
	  				priceLevel: this.priceChecked
	  			}
	  		}).then((res)=>{	
	  			let response = res.data;
	  			if(response.status == '0'){
	  				if(flag){
	  					this.goodsList = this.goodsList.concat(response.result.list);
	  					this.busy = false;
	  					if(response.result.count < this.pageSize){
	  						this.busy = true;
	  						return;
	  					}
	  									
	  				}else{
	  					this.goodsList = response.result.list;
	  					this.busy = false;
	  				}
	  				
	  			}else{
	  				this.goodsList = [];
	  			}
	  		})
	  	},
	  	openFilter(){
	  		this.filterbyChecked = true;
	  		this.mdChecked = true;
	  	},//打开遮罩
	  	closeFilter(){
	  		this.filterbyChecked = false;
	  		this.mdChecked = false;
	  	},//关闭遮罩
	  	priceCheck(index){
	  		if(typeof index == 'undefined'){
	  			this.priceChecked = 'all';
	  			this.page = 1;
	  			this.getGoodsList();
	  		}else{
	  			this.priceChecked = index;
	  			this.page = 1;
	  			this.getGoodsList();
	  		}
	  		this.closeFilter();
	  	},//价格选项卡
	  	sortGoods(){
	  		this.sortFlag = !this.sortFlag;
	  		this.page = 1;
	  		this.getGoodsList();
	  	},
	  	loadMore(){
	  		this.busy = true;
	  		this.loading = true;

	  		setTimeout(() => {
	  			this.page++;
	  			this.getGoodsList(true);
	  			this.loading = false;
	  		}, 1000);
	  	},
	  	addCart(productId){
	  		axios.post('/goods/addCart',{
	  			productId: productId
	  		}).then((res)=>{
	  			let response = res.data;
	  			if(response.status == '0'){
	  				alert('添加成功');
	  			}else{
	  				alert('msg:'+response.mag);
	  			}
	  		})
	  	}
	  }
	}
</script>
