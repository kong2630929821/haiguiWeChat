<div class="new-page" w-class="{{it.styleMod === 1?'new-page':'new-page1'}}">
    {{if it.styleMod === 1}}
    <img src="{{it.mallImagPre + it.getImageMainPath(it.selectedLevel1Groups.images)[0]}}" alt="" style="width:100%;min-height:350px;"/>
    {{else}}
    <div w-class="top-container style-mod-2">
        <div w-class="group1-select" on-tap="level1GroupsExpandedClick">
            <div>{{it.selectedLevel1Groups.name}}</div>
            <img src="../../res/image/arrow_down.png" style="margin-left:15px;"/>
        </div>
    </div>
    {{end}}
    
    <div w-class="bottom-container">
        {{if it.styleMod === 2 && it.level1GroupsExpanded}}
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
            <div w-class="drop-down-mask" on-tap="closeClick"></div>
        </div>
        {{end}}
        <div style="display:flex" ev-selected="changeSortRule">
            <div w-class="groups2" class="groups2">
                {{for i,v of it.selectedLevel1Groups.childs}}
                <div w-class="groups2-item {{v.id === it.selectedLevel2Groups.id ? 'groups2-item-active' : ''}}" on-tap="selectLevel2Groups(e,{{i}})" class="{{v.id === it.selectedLevel2Groups.id ? 'groups2-item-active' : ''}}">{{v.name}}</div>
                {{end}}
            </div>
        </div>

        <div w-class="sort_btns" >
            <div w-class="sort_btn" style="color:{{it.sortType==0?'red':'#8B8B8B'}}" on-tap="changeSortRule(0)">
                销量<span w-class="icon" style="border-top-color:{{it.sortType==0?'red':'#8B8B8B'}};transform:rotate({{it.sortRule[0]?'0deg':'180deg'}});"></span>
            </div>
            <div w-class="sort_btn" style="color:{{it.sortType==1?'red':'#8B8B8B'}}" on-tap="changeSortRule(1)">
                价格<span w-class="icon" style="border-top-color:{{it.sortType==1?'red':'#8B8B8B'}};transform:rotate({{it.sortRule[1]?'0deg':'180deg'}});"></span>
            </div>
        </div>

        <div w-class="{{it.styleMod === 1?'goods-list':'goods-list-1'}}" on-scroll="getMoreList" id="good-list">
            <div id="good-list-items" w-class="goods-list-items">
                {{for i,v of it.goodsList}}
                <div w-class="goods-item" style="{{i % 2 === 0 ? 'padding-right:5px;' : 'padding-left:5px;'}}" ev-item-click="goodsItemClick(e,{{i}})">
                    <app-components-goodsItem-goodsItem>{goods:{{v}} }</app-components-goodsItem-goodsItem>
                </div>
                {{end}}
            </div>
        </div>

    </div>  

    {{%===========商城首页保留图片滚动位置，用空白div撑起来===============}}
    {{if it.goodsList.length==0 && it.styleMod === 1}}
        <div style="height:100%;"></div>
    {{end}}
</div>