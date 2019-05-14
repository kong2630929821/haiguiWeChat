<div>
    <div w-class="top">
        <img src="../../../res/image/income.png" w-class="avatar"/>
        <div w-class="desc">
            <div w-class="username">
                <span>用户名</span>
                {{if it1.userType}}
                <span w-class="userType">{{it1.userType}}</span>
                {{end}}
            </div>
            {{if it1.inviteCode}}
            <div w-class="code">
                邀请码：&nbsp;{{it1.inviteCode}}
            </div>
            {{end}}
        </div>
        <img src="../../../res/image/arrowRight.png" w-class="arrow"/>
    </div>
    <div w-class="orderType">
        {{for i,v of it.allStaus.slice(0,5)}}
        <div w-class="item" on-tap="itemClick({{v.status}})">
            <img src="../../../res/image/{{v.img}}"/>
            <div w-class="name">{{v.name}}</div>
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
        <img src="../../../res/image/address.png"/>
        <div w-class="text">收货地址</div>
        <img src="../../../res/image/arrowRight.png"/>
    </div>
    <div w-class="row" on-tap="verified">
        <img src="../../../res/image/IDcard.png"/>
        <div w-class="text">实名认证</div>
        <img src="../../../res/image/arrowRight.png"/>
    </div>
</div>