<div w-class="groups">
    {{for i,v of it.list}}
    <div w-class="group" on-tap="clickItem(e,{{i}})">
        <div style="background-image: url(../../res/image/{{it.getImageThumbnailPath(v.images)}});" w-class="group-icon" class="bg-img"></div>
        <div>{{v.name}}</div>
    </div>
    {{end}}
</div>