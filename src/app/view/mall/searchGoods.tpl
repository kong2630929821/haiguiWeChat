<div class="new-page" w-class="page" ev-back-click="goBack">
    <div w-class="input" ev-input-change="messChange">
        <widget w-tag="app-components-input-input">{placeHolder:"搜索",style:"border-radius:34px;background:#F9F9F9;font-size:28px;padding-left:65px",clearable:true}</widget>
        <img w-class="searchIcon" src="../../res/image/search-gray.png" />
        <div w-class="btn" on-tap="search">搜索</div>
    </div>
    
    {{if it.goodsList.length==0}}
    <div w-class="empty">
        <img src="../../res/image/searchEmpty.png" w-class="emptyImg"/>
        <div w-class="emptyText">没有想买的商品，快搜索一个</div>
    </div>
    {{else}}
    <div w-class="sort_btns" >
        <div w-class="sort_btn" style="color:{{it.sortType==0?'red':'#8B8B8B'}}" on-tap="changeSortRule(0)">
            销量<span w-class="icon" style="border-top-color:{{it.sortType==0?'red':'#8B8B8B'}};transform:rotate({{it.sortRule[0]?'0deg':'180deg'}});"></span>
        </div>
        <div w-class="sort_btn" style="color:{{it.sortType==1?'red':'#8B8B8B'}}" on-tap="changeSortRule(1)">
            价格<span w-class="icon" style="border-top-color:{{it.sortType==1?'red':'#8B8B8B'}};transform:rotate({{it.sortRule[1]?'0deg':'180deg'}});"></span>
        </div>
    </div>
    
    <div w-class="goods-list-items">
        {{for i,v of it.goodsList}}
        <div w-class="goods-item" style="{{i % 2 === 0 ? 'padding-right:5px;' : 'padding-left:5px;'}}" ev-item-click="goodsItemClick({{i}})">
            <app-components-goodsItem-goodsItem>{goods:{{v}} }</app-components-goodsItem-goodsItem>
        </div>
        {{end}}
    </div>
    {{end}}
</div>