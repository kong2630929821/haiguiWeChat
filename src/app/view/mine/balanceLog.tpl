<div class="new-page" w-class="page">
    <div w-class="top">
        <div w-class="selectBox" on-tap="selectMon">
            <span style="margin-right:20px;">{{it.select.value.join(".")}}</span>
            <img src="../../res/image/arrowDown.png"/>
        </div>
    </div>
    <div w-class="content">
    {{if it.list.length>0}}
        {{for i,v of it.list}}
            <div w-class="item" on-tap="goDetail({{i}})">
                <div w-class="itemTop">
                    <div w-class="name">{{v.name}}</div>
                    <div w-class="desc">{{v.money}}</div>
                </div>
                <div w-class="itemTop">
                    <div w-class="time" style="margin-right: 15px;flex-shrink: 0">{{v.time}}</div>
                    {{if v.status}}
                    <div w-class="time">{{v.status}}</div>
                    {{end}}
                </div>
            </div>
        {{end}}
    {{else}}
        <div w-class="empty">该月没有记录哦！</div>
    {{end}}
    </div>
</div>