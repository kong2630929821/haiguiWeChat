<div class="new-page" w-class="page">
    <div w-class="title">
        <div w-class="amount">{{it.amount}}</div>
        <div w-class="total">{{it.title}}总数</div>
    </div>

    <div w-class="content">
    {{for i,v of it.list}}
        <div w-class="item" on-tap="goDetail({{i}})">
            <div w-class="left">
                <div w-class="name">{{v.name}}</div>
                <div w-class="desc">{{v.desc}}</div>
            </div>
            <div w-class="middle">{{v.tel}}</div>
            <img src="../../res/image/arrowRight.png" w-class="right"/>
        </div>
    {{end}}
    </div>
</div>