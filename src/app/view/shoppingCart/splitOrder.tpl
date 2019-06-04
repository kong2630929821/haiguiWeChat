<div w-class="split-order">
    <div w-class="goodsList">
        {{for i,v of it.splitOrder.order}}
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
            合计<span style="font-size:32px;color:#8A4AF3">￥ {{(it.splitOrder.saleFee / 100).toFixed(2)}}</span>
        </div>
    </div>
    <div w-class="row row1">
        <div>运费</div>
        <span style="font-size:32px;color:#8A4AF3">￥ {{(it.splitOrder.freightFee / 100).toFixed(2)}}</span>
    </div>
    <div w-class="row row1">
        <div>税费</div>
        <span style="font-size:32px;color:#8A4AF3">￥ {{(it.splitOrder.taxFee / 100).toFixed(2)}}</span>
    </div>
</div>