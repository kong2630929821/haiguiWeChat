<div class="new-page" w-class="collectBox">
    {{if it1.length==0}}
    <div w-class="empty">
        <img src="../../res/image/favoriteEmpty.png" w-class="emptyImg"/>
        <div w-class="emptyText">没有中意的商品，快去收藏一个</div>
    </div>
    {{else}}
    <div w-class="box">
        {{for i,v of it1}}
            <div w-class="like" on-tap="goShopInfo(e,{{i}})">
                <img w-class="goodImg" src="{{it.mallImagPre + it.getImageThumbnailPath(v.images)}}" alt=""/>
                <div w-class="goodInfo">
                    <div w-class="title">{{v.name}}</div>
                    {{if v.flag}}
                      <span w-class="money">{{it.priceFormat(v.origin)}}</span>
                    {{else}}
                      <div w-class="invalid">已售罄</div>
                    {{end}}
                </div>
                <div w-class="fix-item fix-item-1" on-tap="cancelCollect({{i}})">
                    <img src="../../res/image/yishoucang.png" style="width:54px;height:54px;"/>
                </div>
            </div>
        {{end}}
    </div>
    {{end}}
</div>