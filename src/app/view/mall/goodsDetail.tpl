<div class="new-page" w-class="new-page">
    {{if it.descProps}}
    <div w-class="goods-details-item-desc" ev-close-click="closeDescsClick"><app-components-goodsDetailsItem-goodsDetailsItemDesc>{{it.descProps}}</app-components-goodsDetailsItem-goodsDetailsItemDesc></div>
    {{end}}
    <div w-class="body">
        <div style="height:500px;width:100%;">
            <app-components-imgSwiper-imgSwiper>{ list:{{ it.getImageMainPath(it.goods.images) }},mod:2 }</app-components-imgSwiper-imgSwiper>
        </div>
        <div w-class="goods-msg">
            <div w-class="simple-msg">
                <div w-class="name-box">
                    <div w-class="goods-name" class="line2-overflow">{{it.goods.name}}</div>
                    <div w-class="area">
                        <img src="{{it.mallImagPre + it.areaIcon}}" w-class="area-icon"/>
                        <div w-class="area-text">{{it.area}}</div>
                    </div>
                </div>
                <div w-class="goods-other">
                    <div w-class="good-price">
                        <div w-class="buy-price">￥{{it.priceFormat(it.sale)}}</div>
                        {{if it.discount > 0 && it.discount < 10 }}
                        <div w-class="original-price">{{ it.priceFormat(it.origin)}}</div>
                        {{else}}
                        <div w-class="vip-price" on-tap="goVip">（会员价：{{ it.priceFormat(it.vipSale)}}）</div>
                        {{end}}
                    </div>
                    {{if it.discount || it.rebate}}
                    <div w-class="good-labels">
                        {{if it.discount > 0 && it.discount < 10 }}
                        <div w-class="good-discount good-label">{{it.discount}}折</div>
                        {{end}}
                        {{if it.rebate}}
                        <div w-class="good-rebate good-label">返 ￥{{it.priceFormat(it.rebate)}}</div>
                        {{end}}
                    </div>
                    {{end}}
                </div>
            </div>
            {{if it.goods.goodsType > 0}}
            <div style="margin-left:30px;background-color:rgba(255,255,255,1);"><div w-class="tax-box"><div w-class="tax-label">海外购</div></div></div>
            {{end}}
            <div w-class="goods-items">
                <div w-class="items-father1" on-tap="clickDescs(e,'freight')"><app-components-goodsDetailsItem-goodsDetailsItem>{title:"运费",content:{{it.goodsItemDescs.freight.itemContent}} }</app-components-goodsDetailsItem-goodsDetailsItem></div>
                
                {{if it.goods.goodsType > 0}}
                    <div w-class="items-father1" on-tap="clickDescs(e,'tax')"><app-components-goodsDetailsItem-goodsDetailsItem>{title:"税费",content:"预计{{it.priceFormat(it.goods.tax)}}元"}</app-components-goodsDetailsItem-goodsDetailsItem></div>
                    <div w-class="items-father2" on-tap="clickDescs(e,'verified')"><app-components-goodsDetailsItem-goodsDetailsItem>{title:"实名",content:"该商品需实名认证",style:"padding-left:30px;"}</app-components-goodsDetailsItem-goodsDetailsItem></div>
                {{elseif !it.goods.isActGoods}}
                    <div w-class="items-father2" on-tap="clickDescs(e,'service')"><app-components-goodsDetailsItem-goodsDetailsItem>{title:"服务",content:"7天内售后无忧",style:"padding-left:30px;"}</app-components-goodsDetailsItem-goodsDetailsItem></div>
                {{end}}

            </div>
            <div w-class="items-father3" on-tap="chooseSpecClick({{false}})"><app-components-goodsDetailsItem-goodsDetailsItem>{title:"选择",content:"规格",style:"padding-left:30px;"}</app-components-goodsDetailsItem-goodsDetailsItem></div>
        </div>
        
        <div w-class="goods-desc">
            <div w-class="desc-title">商品详情</div>
            {{for i,v of it.goods.detail}}
            <img src="{{it.mallImagPre + v.image.path}}" w-class="desc-img"/>
            {{end}}
        </div>
        
    </div>
    <div w-class="fix-bottom">
        <div w-class="left">
            <div w-class="fix-item fix-item-1" on-tap="gotoMallHome">
                <div style="position: relative;text-align: center;">
                    <img src="../../res/image/mall1.png"/>
                    <div>首页</div>
                </div>
            </div>
            <div w-class="fix-item fix-item-1" on-tap="gotoShoppinigCart">
                <div style="position: relative;text-align: center;">
                    <img src="../../res/image/shoppingCart1.png"/>
                    <div>购物车</div>
                    {{if  it.cartGoodsLen > 0}}
                    {{:icon =  it.cartGoodsLen > 99 ? "icon3" : (it.cartGoodsLen > 9 ? "icon2" : "icon1" )}}
                    <div w-class="icon {{icon}}">{{it.cartGoodsLen > 99 ? "99+" : it.cartGoodsLen}}</div>
                    {{end}}
                </div>
            </div>
            <div w-class="fix-item fix-item-1" on-tap="gotoCollect">
                <div style="position: relative;text-align: center;">
                    <img src="{{it.isLiked==1?'../../res/image/yishoucang.png':'../../res/image/shoucang.png'}}"/>
                    <div>{{it.isLiked==1?'已收藏':'收藏'}}</div>
                </div>
            </div>
        </div>
        <div w-class="right">
            <div w-class="fix-item fix-item-2" style="background-color:#DF4AF3;" on-tap="chooseSpecClick({{false}})">加入购物车</div>
            <div w-class="fix-item fix-item-2" style="background-color:#8A4AF3;" on-tap="chooseSpecClick({{true}})">立即购买</div>
        </div>
    </div>
    {{if it.chooseSpec}}
    <div ev-close-spec="specCloseClick"  ev-sure-click="sureClick">
        <app-components-goodsDetailsItem-goodsDetailsSpec>{goods:{{it.goods}},amount:{{it.amount}},skuIndex:{{it.skuIndex}},buyNow:{{it.buyNow}} }</app-components-goodsDetailsItem-goodsDetailsSpec>
    </div>
    {{end}}
</div>