<div style="width:100%;height:100%;display: flex;">
<div w-class="tabs" >
{{if it.type === 0}}
    {{for i, v of it.tabBarList}}
        {{if i == it.isActive}}
        <widget w-tag={{v.components}} style="visibility:visible;z-index:0;position:absolute;width:100%;height:100%;">{isActive:{{i == it.isActive}} }</widget>
        {{elseif it.old[i]}}
        <widget w-tag={{v.components}} style="visibility:hidden;z-index:-1;position: absolute;width:100%;height:100%;">{isActive:{{i == it.isActive}} }</widget>
        {{end}}
    {{end}}
{{elseif it.type === 1}}
    <widget w-tag={{it.tabBarList[it.isActive].components}} style="position:absolute;width:100%;height:100%;">{isActive:false}</widget>
{{else}}
    {{for i, v of it.tabBarList}}
    <div style="visibility: {{it.isActive == i ? 'visible' : 'hidden'}}; z-index:{{it.isActive == i ? 0 :-1}}; position:absolute; width:100%;height:100%;">
        <widget w-tag={{v.components}} >{ isActive:{{it.isActive == i}} }</widget>
    </div>
    {{end}}
{{end}}
</div>

<div w-class="ga-bottom-tab-bar-container" class="{{it.tabBarAnimateClasss}}" >
    <div style=" display: flex;height: 110px;width: 100%;">
        {{for index,item of it.tabBarList}}
        <div w-class="ga-tab-bar-item {{it.isActive == index ? 'ga-tab-bar-item-active' : ''}}" on-down="tabBarChangeListener(e,{{index}})">
            <div style="position:relative;">
                <img src="../../res/image/{{it.isActive == index ? item.iconActive : item.icon}}" w-class="ga-tab-bar-icon" />
                {{if (index === 2 && it.cartGoodsLen > 0)}}
                {{:icon =  it.cartGoodsLen > 99 ? "icon3" : (it.cartGoodsLen > 9 ? "icon2" : "icon1" )}}
                <div w-class="icon {{icon}}">{{it.cartGoodsLen > 99 ? "99+" : it.cartGoodsLen}}</div>
                {{end}}
            </div>
            <span w-class="ga-tab-bar-text">
                {{item.text}}
            </span>
            
        </div>
        {{end}}
    </div>
</div>

</div>
