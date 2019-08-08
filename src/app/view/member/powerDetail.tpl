<div class="new-page" w-class="page" ev-update="upgradeUser">
    <div style="position:relative">
        <img src="../../res/image/{{it.userType==2 ? 'hBaoCard':'hWangCard'}}.png" w-class="card"/>
        {{if it1}}
        <div w-class="code" on-tap="copy">我的邀请码&nbsp;{{it1}}</div>
        {{else}}
        <div w-class="update" on-tap="update">立即申请</div>
        {{end}}
    </div>

    <div w-class="title">
        <img src="../../res/image/iconArrow.png"/>
        <span style="margin-left:20px;">权益介绍</span>
    </div>

    {{for i,v of it.list}}
    <div w-class="row">
        <div w-class="num">{{i+1}}</div>
        <div>{{v}}</div>
    </div>
    {{end}}

    <div w-class="content">
        {{for i,v of it.powerList}}
        <div w-class="item" on-tap="itemClick({{i}})">
            <img src="../../res/image/{{v.img}}" w-class="image"/>
            <span w-class="text">{{v.name}}</span>
        </div>
        {{end}}
    </div>

    <div w-class="title">
        <img src="../../res/image/iconArrow.png"/>
        <span style="margin-left:20px;">仅{{it.userTypeShow}}享受此权益</span>
    </div>

    {{if !it1}}
    <div w-class="btn" on-tap="upgradeUser">立即申请</div>
    {{end}}
</div>