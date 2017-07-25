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
					<a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
										<a href="#"><img v-lazy="'/static/'+item.productImg" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{item.productName}}</div>
										<div class="price">{{item.productPrice}}</div>
										<div class="btn-area">
											<a href="javascript:;" class="btn btn--m">加入购物车</a>
										</div>
									</div>
								</li>
								
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="md-overlay" v-if="mdChecked" @click="closeFilter()"></div>
		<nav-footer></nav-footer>
	</div>    
</template>
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
		      	endPrice: '2000'
		      }
	      ],
	      priceChecked: 'all',
	      filterbyChecked: false,
	      mdChecked: false
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
	  	getGoodsList(){
	  		axios.get('/goods').then((res)=>{ 			
	  			this.goodsList = res.data.result;
	  		})
	  	},
	  	openFilter(){
	  		this.filterbyChecked = true;
	  		this.mdChecked = true;
	  	},
	  	closeFilter(){
	  		this.filterbyChecked = false;
	  		this.mdChecked = false;
	  	},
	  	priceCheck(index){
	  		if(typeof index == 'undefined'){
	  			this.priceChecked = 'all';
	  		}else{
	  			this.priceChecked = index;
	  		}
	  		this.closeFilter();
	  	}
	  }
	}
</script>