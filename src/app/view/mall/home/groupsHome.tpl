<div class="new-page" w-class="new-page">
    <div w-class="left-container">
        {{for i,v of it1.groups}}
        <div w-class="group1-item  {{it1.activeIndex === i ? 'group1-item-active' : ''}}" on-tap="clickLevel1Item(e,{{i}})">{{v.name}}</div>
        {{end}}
    </div>
    <div w-class="right-container">
        {{if it1.groups.length > 0}}
        {{for i,v of it1.groups[it1.activeIndex].childs}}
        <div w-class="group2-item" on-tap="clickLevel2Item(e,{{i}})">
            <div style="background-image: url({{it.mallImagPre + it.getImageThumbnailPath(v.images)}});" w-class="group-icon" class="bg-img"></div>
            <div>{{v.name}}</div>
        </div>
        {{end}}
        {{end}}
    </div>
    
</div>