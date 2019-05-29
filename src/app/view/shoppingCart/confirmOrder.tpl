<div class="new-page" w-class="page">
    <div w-class="top" ev-itemClick="selectAddr" ev-rightClick="selectAddr">
        {{if it.address}}
        <widget w-tag="app-components-addressItem-addressItem">{address:{{it.address}}}</widget>
        {{else}}
        <div w-class="row row-addr" on-tap="addAddress">
            <div w-class="row" style="flex:1 0 0;">
                <img src="../../res/image/add_blue.png" style="margin-right:20px;"/>
                <div w-class="text">添加地址</div>
            </div>
            <img src="../../res/image/arrowRight.png"/>
        </div>
        {{end}}
    </div>

    <div w-class="goodsList">
        {{for i,v of it.orderGoodsShow}}
        <div w-class="row" style="padding:20px 30px;" on-tap="itemClick">
            <img src="{{it.mallImagPre + it.getImageThumbnailPath(v.cartGood.goods.images)}}" w-class="goodsImg"/>
            <div w-class="column">
                <div w-class="goodsTitle" class="line2-overflow">{{v.cartGood.goods.name}}</div>
                <div style="margin-bottom: 20px;">{{v.labelShow}}</div>
                <div w-class="row2">
                    <div w-class="good-price">
                        <div w-class="buy-price">￥{{it.priceFormat(v.finalSale)}}</div>
                        {{if v.priceRet.discount}}
                        <div w-class="original-price">{{it.priceFormat(v.priceRet.origin)}}</div>
                        {{end}}
                    </div>
                    <span style="font-size:20px;color:#353535;">x{{v.cartGood.amount}}</span>
                </div>
            </div>
        </div>
        {{end}}
    </div>

    <div w-class="row row1">
        <div>商品金额</div>
        <div w-class="total">
            合计<span style="font-size:32px;color:#8A4AF3">￥ {{(it.totalSale / 100).toFixed(2)}}</span>
        </div>
    </div>
    <div w-class="row row1">
        <div>运费</div>
        <span style="font-size:32px;color:#8A4AF3">￥ {{(it.totalFreight / 100).toFixed(2)}}</span>
    </div>
    <div w-class="row row1">
        <div>税费</div>
        <span style="font-size:32px;color:#8A4AF3">￥ {{(it.totalTax / 100).toFixed(2)}}</span>
    </div>
    <div w-class="bottom">
        <div >
            共4件 合计：
            <span style="font-size:32px;color:#8A4AF3">{{((it.totalSale + it.totalFreight + it.totalTax) / 100).toFixed(2)}}</span>
            <span w-class="pay" on-tap="orderClick">结算</span>
        </div>
    </div>
</div>