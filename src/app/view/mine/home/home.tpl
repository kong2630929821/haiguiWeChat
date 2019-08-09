<div>
    <div w-class="top">
        <img src="{{it1.avatar||'../../../res/image/user_avatar.png'}}" w-class="avatar"/>
        <div w-class="desc">
            <div w-class="username">
                <span>{{it1.userName}}</span>
                {{if it1.userType}}
                <span w-class="userType">{{it1.userType}}</span>
                {{end}}
            </div>
            {{if it1.inviteCode}}
            <div w-class="codeRow" on-tap="copy">
                <div w-class="code">邀请码：&nbsp;{{it1.inviteCode}}</div>
                <img src="../../../res/image/copyBtn.png" w-class="copybtn"/>
            </div>
            {{end}}
            <div w-class="code">ID：&nbsp;{{it1.uid}}</div>
            <div w-class="messageBox">
                <img src="../../../res/image/{{it1.message?'message.png':'unmessage.png'}}" alt="" w-class="messageImg" on-tap="gotoMessage"/>
            </div>
        </div>  
    </div>
    <div w-class="orderType">
        {{for i,v of it.allStaus.slice(0,5)}}
        {{: orders = it1.orders.get(v.status) || []}}
        {{: len = orders.length }}
        <div w-class="item" on-tap="itemClick({{v.status}})">
            <img src="../../../res/image/{{v.img}}"/>
            <div w-class="name">{{v.name}}</div>
            {{if len > 0 && (i === 0 || i === 1 || i === 2)}}
            {{:icon =  len > 99 ? "icon3" : (len > 9 ? "icon2" : "icon1" )}}
            <div w-class="icon {{icon}}">{{len > 99 ? "99+" : len}}</div>
            {{end}}
        </div>
        {{end}}
    </div>
    
    <div w-class="divideLine"></div>
    <div w-class="orderType">
        {{for i,v of it1.balance}}
        <div w-class="item" on-tap="balanceLog({{i}})">
            <div w-class="amount">{{v.value}}</div>
            <div w-class="name">{{v.key}}</div>
        </div>
        {{end}}
    </div>
    <div w-class="divideLine"></div>
    <div w-class="row" style="border-bottom:1px solid #E5E5E5" on-tap="goAddress">
        {{%<!-- <img src="../../../res/image/address.png"/> -->}}
        <div w-class="text">收货地址</div>
        <img src="../../../res/image/arrowRight.png" w-class="arrow"/>
    </div>
    <div w-class="row" style="border-bottom:1px solid #E5E5E5" on-tap="verified">
        {{%<!-- <img src="../../../res/image/IDcard.png"/> -->}}
        <div w-class="text">实名认证</div>
        {{if it1.verified}}
        <div style="font-size: 28px;color: rgb(136, 136, 136);">已认证</div>
        {{else}}
        <img src="../../../res/image/arrowRight.png" w-class="arrow"/>
        {{end}}
    </div>
    <div w-class="row" style="border-bottom:1px solid #E5E5E5" on-tap="goCollect">
        {{%<!-- <img src="../../../res/image/shoucang_1.png"/> -->}}
        <div w-class="text">我的收藏</div>
        <img src="../../../res/image/arrowRight.png" w-class="arrow"/>
    </div>
    <div w-class="row" style="border-bottom:1px solid #E5E5E5" on-tap="goOfficial">
        <div w-class="text">联系我们</div>
        <img src="../../../res/image/arrowRight.png" w-class="arrow"/>
    </div>
</div>