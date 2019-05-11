<div w-class="good-item" on-tap="goodsItemClick"> 
    <div w-class="good-img" class="bg-img" style="background-image:url(../../res/image/{{it.goods.images[0].path}})"></div>
    <div w-class="good-msg">
        <div w-class="good-name" class="{{it.discount || it.rebate ? 'line1-overflow' : 'line2-overflow'}}">{{it.goods.name}}</div>
        {{if it.discount || it.rebate}}
        <div w-class="good-labels">
            {{if it.discount}}
            <div w-class="good-discount good-label">{{it.discount}}折</div>
            {{end}}
            {{if it.rebate}}
            <div w-class="good-rebate good-label">返 ￥{{(it.rebate/100).toFixed(2)}}</div>
            {{end}}
        </div>
        {{end}}
        <div w-class="good-price">
            <div w-class="buy-price">￥{{(it.sale/100).toFixed(2)}}</div>
            {{if it.discount}}
            <div w-class="original-price">{{( it.origin / 100).toFixed(2)}}</div>
            {{end}}
        </div>
    </div>
</div>