<div w-class="good-item" on-tap="goodsItemClick"> 
    <div w-class="good-img" class="bg-img" style="background-image:url({{it.mallImagPre + it.getImageThumbnailPath(it.goods.images)}})"></div>
    <div w-class="good-msg">
        <div w-class="good-name" class="{{it.discount || it.rebate ? 'line1-overflow' : 'line2-overflow'}}">{{it.goods.name}}</div>
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
        <div w-class="good-price">
            <div w-class="buy-price">￥{{it.priceFormat(it.sale)}}</div>
            {{if it.discount > 0 && it.discount < 10 }}
            <div w-class="original-price">{{it.priceFormat(it.origin)}}</div>
            {{end}}
        </div>
    </div>
</div>