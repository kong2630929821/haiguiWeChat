<div class="new-page" w-class="page">
    {{if it.title}}
        <div w-class="title">
            <div w-class="amount">{{it.amount}}</div>
            <div w-class="total">{{it.title}}</div>
            <div w-class="selectBox" on-tap="selectMon">
                <span style="margin-right:20px;">{{it.select.value.join(".")}}</span>
                <img src="../../res/image/arrowDown.png"/>
            </div>
        </div>
    {{end}}

    <div w-class="content">
    {{for i,v of it.list}}
        <div w-class="item" on-tap="goDetail({{i}})">
            <div w-class="top">
                <div w-class="name">{{v.name}}</div>
                <div w-class="desc">{{v.money}}</div>
            </div>
            <div w-class="time">{{v.time}}</div>
        </div>
    {{end}}
    </div>
</div>