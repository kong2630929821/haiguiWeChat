<div class="new-page" w-class="new-page">
    {{: let styleClass = it.styleMod === it.allStyleMod.ONE ? "style-mod-1" : "style-mod-2" }}
    <div w-class="top-container {{ styleClass }}" class="bg-img" style="background-image: url(../../res/image/{{it.selectedLevel1Groups.images[0].path}})">
        {{if it.styleMod === it.allStyleMod.TWO}}
        <div w-class="group1-select" on-tap="level1GroupsExpandedClick">
            <div>{{it.selectedLevel1Groups.name}}</div>
            <img src="../../res/image/arrow_down.png" style="margin-left:15px;"/>
        </div>
        {{end}}
    </div>
    <div w-class="bottom-container">
        {{if it.styleMod === it.allStyleMod.TWO && it.level1GroupsExpanded}}
        <div w-class="drop-down">
            <div w-class="groups1">
                <div w-class="groups1-scroll">
                    {{for i,v of it.groups}}
                    <div w-class="groups1-item">
                        <div w-class="groups1-item-text {{v[1].id === it.selectedLevel1Groups.id ? 'groups1-item-active' : ''}}" on-tap="selectLevel1Groups(e,{{v[1].id}})">{{v[1].name}}</div>
                    </div>
                    {{end}}
                </div>
            </div>
            <div w-class="drop-down-mask"></div>
        </div>
        {{end}}
        <div w-class="groups2">
            {{for i,v of it.selectedLevel1Groups.childs}}
            <div w-class="groups2-item {{v[1].id === it.selectedLevel2Groups.id ? 'groups2-item-active' : ''}}" on-tap="selectLevel2Groups(e,{{v[1].id}})">{{v[1].name}}</div>
            {{end}}
        </div>
        <div w-class="goods-list">
            {{for i,v of it.selectedLevel2Groups.goods}}
            <div w-class="goods-item" style="{{i % 2 === 0 ? 'padding-right:5px;' : 'padding-left:5px;'}}" ev-item-click="goodsItemClick">
                <app-components-goodsItem-goodsItem>{goods:{{v}} }</app-components-goodsItem-goodsItem>
            </div>
            {{end}}
        </div>
    </div>  
</div>