<div class="new-page" w-class="new-page">
    {{: let styleClass = it.styleMod === it.allStyleMod.ONE ? "style-mod-1" : "style-mod-2" }}
    {{if it.styleMod === it.allStyleMod.ONE}}
    <div w-class="top-container style-mod-1" class="bg-img" style="background-image: url({{it.mallImagPre + it.getImageMainPath(it.selectedLevel1Groups.images)[0]}})"></div>
    {{else}}
    <div w-class="top-container style-mod-2">
        <div w-class="group1-select" on-tap="level1GroupsExpandedClick">
            <div>{{it.selectedLevel1Groups.name}}</div>
            <img src="../../res/image/arrow_down.png" style="margin-left:15px;"/>
        </div>
    </div>
    {{end}}
    
    <div w-class="bottom-container">
        {{if it.styleMod === it.allStyleMod.TWO && it.level1GroupsExpanded}}
        <div w-class="drop-down">
            <div w-class="groups1">
                <div w-class="groups1-scroll">
                    {{for i,v of it.classificationGroups}}
                    <div w-class="groups1-item">
                        <div w-class="groups1-item-text {{v.id === it.selectedLevel1Groups.id ? 'groups1-item-active' : ''}}" on-tap="selectLevel1Groups(e,{{i}})">{{v.name}}</div>
                    </div>
                    {{end}}
                </div>
            </div>
            <div w-class="drop-down-mask"></div>
        </div>
        {{end}}
        <div w-class="groups2" class="groups2">
            {{for i,v of it.selectedLevel1Groups.childs}}
            <div w-class="groups2-item {{v.id === it.selectedLevel2Groups.id ? 'groups2-item-active' : ''}}" on-tap="selectLevel2Groups(e,{{i}})" class="{{v.id === it.selectedLevel2Groups.id ? 'groups2-item-active' : ''}}">{{v.name}}</div>
            {{end}}
        </div>
        <div w-class="goods-list" on-scroll="getMoreList" id="good-list">
            <div id="good-list-items" w-class="goods-list-items">
                {{for i,v of it.goodsList}}
                <div w-class="goods-item" style="{{i % 2 === 0 ? 'padding-right:5px;' : 'padding-left:5px;'}}" ev-item-click="goodsItemClick(e,{{i}})">
                    <app-components-goodsItem-goodsItem>{goods:{{v}} }</app-components-goodsItem-goodsItem>
                </div>
                {{end}}
            </div>
        </div>
    </div>  
</div>