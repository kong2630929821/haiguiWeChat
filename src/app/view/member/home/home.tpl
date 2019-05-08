<div>
    {{if it.userType == 0}}
    <div on-tap="powerDetail(1)">
        <widget w-tag="app-view-member-home-powerCard">{name:"海宝会员",money:399}</widget>
    </div>
    {{else}}
        <div w-class="top">
            {{for i,v of it1}}
            <div w-class="tab" on-tap="tabClick({{i}})">
                <div w-class="amount">{{v.amount}}</div>
                <div>{{v.title}}</div>
            </div>
            {{end}}
            <div w-class="row" on-tap="goDetail">
                <div w-class="name">{{it.userType==2 ? "海王" :"海宝"}}会员</div>
                <div w-class="code">我的邀请码&nbsp;{{it.code}}</div>
            </div>
        </div>

        <div w-class="title">我的权益</div>
        <div w-class="content">
            {{for i,v of it.powerList}}
            <div w-class="item" on-tap="itemClick({{i}})">
                <img src="{{v.img}}" w-class="image"/>
                <span w-class="text">{{v.name}}</span>
            </div>
            {{end}}
        </div>
    {{end}}

    {{if it.userType < 2}}
    <div on-tap="powerDetail(2)">
        <widget w-tag="app-view-member-home-powerCard" style="margin-top:60px;">{name:"海王会员",money:10000}</widget>
    </div>
    {{end}}
    
</div>