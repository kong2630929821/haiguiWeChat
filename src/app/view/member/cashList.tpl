<div class="new-page" w-class="page">
    {{if it.title}}
        {{if it.fg=='cash'}}
        <div style="display:flex" ev-selected="changeSortRule">
            <div w-class="groups2" class="groups2">
                <div w-class="groups2-item {{0 === it.selected? 'groups2-item-active' : ''}}" on-tap="selectGroups({{0}})" class="{{0 === it.selected ? 'groups2-item-active' : ''}}">总收益</div>
                <div w-class="groups2-item {{1 === it.selected? 'groups2-item-active' : ''}}" on-tap="selectGroups({{1}})" class="{{1 === it.selected ? 'groups2-item-active' : ''}}">待收益</div>
            </div>
        </div>
        {{end}}
        <div w-class="title">
            <div w-class="amount">{{it.amount}}</div>
            <div w-class="total">{{it.showTitle}}</div>
            {{if it.selected==0}}
            <div w-class="selectBox" on-tap="selectMon">
                <span style="margin-right:20px;">{{it.select.value.join(".")}}</span>
                <img src="../../res/image/arrowDown.png"/>
            </div>
            {{end}}
        </div>
    {{end}}

    <div w-class="content">
    {{if it.showDataList.length>0}}
        {{for i,v of it.showDataList}}
            <div w-class="item" on-tap="goDetail({{i}})">
                <div w-class="top">
                    <div w-class="name">{{v.name}}</div>
                    <div w-class="desc">{{v.money}}</div>
                </div>
                <div w-class="time">{{v.time}}</div>
            </div>
        {{end}}
    {{else}}
        <div w-class="empty">该月没有记录哦！</div>
    {{end}}
    </div>
</div>