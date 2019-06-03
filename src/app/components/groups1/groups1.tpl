<div w-class="groups">
    {{for i,v of it.list.slice(0,9)}}
    <div w-class="group" on-tap="clickItem(e,{{i}})">
        <div style="background-image: url({{it.mallImagPre + it.getImageThumbnailPath(v.images)}});" w-class="group-icon" class="bg-img"></div>
        <div>{{v.name}}</div>
    </div>
    {{end}}
    <div w-class="group" on-tap="gotoTurntableClick">
        <div w-class="group-icon turntable-icon" class="bg-img"></div>
        <div>大转盘</div>
    </div>
</div>