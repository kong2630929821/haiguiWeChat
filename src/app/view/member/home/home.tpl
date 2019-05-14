<div w-class="page" ev-update="upgradeUser">
    {{if it1.userType > 2}}
    <div on-tap="powerDetail('hBao')">
        <widget w-tag="app-view-member-home-powerCard">{name:"海宝会员",money:399}</widget>
    </div>
    {{else}}
        <div w-class="top">
            {{for i,v of it1.earning}}
            <div w-class="tab" on-tap="tabClick({{i}})">
                <div w-class="amount">{{v.amount}}</div>
                <div>{{v.title}}</div>
            </div>
            {{end}}
            <div w-class="row" on-tap="goDetail">
                <div w-class="name">{{it1.userTypeShow}}会员</div>
                <div w-class="code">我的邀请码&nbsp;{{it1.inviteCode}}</div>
            </div>
        </div>

        <div w-class="title">我的权益</div>
        <div w-class="content">
            {{for i,v of it1.powerList}}
            <div w-class="item" on-tap="itemClick({{i}})">
                <img src="../../../res/image/{{v.img}}" w-class="image"/>
                <span w-class="text">{{v.name}}</span>
            </div>
            {{end}}
        </div>
    {{end}}

    {{if it1.userType > 1}}
    <div on-tap="powerDetail('hWang')">
        <widget w-tag="app-view-member-home-powerCard" style="margin-top:60px;">{name:"海王会员",money:10000}</widget>
    </div>
    {{end}}
    
</div>