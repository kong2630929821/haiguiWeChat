<div w-class="groups">
    {{for i,v of it.list.slice(0,9)}}
    <div w-class="group" on-tap="clickItem(e,{{i}})">
        <div style="background-image: url({{it.mallImagPre + it.getImageThumbnailPath(v.images)}});" w-class="group-icon" class="bg-img"></div>
        <div>{{v.name}}</div>
    </div>
    {{end}}
    {{%<!-- <div w-class="group" on-tap="becomeHaiBao">
        <div w-class="group-icon becomeHaiBao-icon" class="bg-img"></div>
        <div>成为海宝</div>
    </div>
    <div w-class="group" on-tap="becomeHaiWang">
        <div w-class="group-icon becomeHaiWang-icon" class="bg-img"></div>
        <div>升级海王</div>
    </div>
    <div w-class="group" on-tap="shareGift">
        <div w-class="group-icon shareGift-icon" class="bg-img"></div>
        <div>分享礼包</div>
    </div> -->}}
    <div w-class="group" on-tap="gotoTurntableClick">
        <div w-class="group-icon turntable-icon" class="bg-img"></div>
        <div>大转盘</div>
    </div>
</div>