<div w-class="page" >

    {{if it1.userType > 2}}
    <div on-tap="powerDetail('hWang')" ev-update="upgradeUser('hWang')">
        <div style="position:relative">
            <img src="../../../res/image/hWangCard.png" w-class="card"/>
            <div w-class="update" on-tap="upgradeUser('hWang')">立即申请</div>
        </div>
        {{%<!-- <widget w-tag="app-view-member-home-powerCard" style="margin-top:60px;">{name:"海王会员",money:10000,privilegeNumber:8}</widget> -->}}
    </div>
    
    <div on-tap="powerDetail('hBao')" ev-update="upgradeUser('hBao')">
        <div style="position:relative">
            <img src="../../../res/image/hBaoCard.png" w-class="card"/>
            <div w-class="update" on-tap="upgradeUser('hBao')">立即申请</div>
        </div>
        {{%<!-- <widget w-tag="app-view-member-home-powerCard">{name:"海宝会员",money:399,privilegeNumber:6}</widget> -->}}
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
                <div w-class="name">{{it1.userTypeShow}}</div>
                <div w-class="codeRow" on-tap="copy">
                    <div w-class="code" >我的邀请码&nbsp;{{it1.inviteCode}}</div>
                    <img src="../../../res/image/copyBtn.png" w-class="copybtn"/>
                </div>
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

    {{%===================已经是海宝===================}}
    {{if it1.userType == 2}}
    <div on-tap="powerDetail('hWang')" ev-update="upgradeUser('hWang')">
        <div style="position:relative">
            <img src="../../../res/image/hWangCard.png" w-class="card"/>
            <div w-class="update" on-tap="upgradeUser('hWang')">立即申请</div>
        </div>
        {{%<!-- <widget w-tag="app-view-member-home-powerCard" style="margin-top:60px;">{name:"海王会员",money:10000,privilegeNumber:8}</widget> -->}}
    </div>
    {{end}}
    
</div>