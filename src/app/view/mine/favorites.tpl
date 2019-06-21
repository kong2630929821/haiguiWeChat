<div class="new-page" w-class="collectBox">
    <div w-class="box">
        {{for i,v of it.collectList}}
            <div w-class="like" on-tap="goShopInfo(e,{{i}})">
                <img w-class="goodImg" src="{{it.mallImagPre + it.getImageThumbnailPath(v.images)}}" alt=""/>
                <div w-class="goodInfo">
                    <div w-class="title">{{v.name}}</div>
                    {{if v.flag}}
                      <span w-class="money">{{it.priceFormat(v.origin)}}</span>
                    {{else}}
                      <div w-class="invalid">失效</div>
                    {{end}}
                </div>
            </div>
        {{end}}
    </div>
</div>