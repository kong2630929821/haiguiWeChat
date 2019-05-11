<div>
    <div w-class="top">
        <img src="../../../res/image/income.png" w-class="avatar"/>
        <div w-class="desc">
            <div style="font-size:36px;">
                用户名<span w-class="userType">海宝</span>
            </div>
            <div w-class="code">
                邀请码：&nbsp;002233
            </div>
        </div>
        <img src="../../../res/image/arrowRight.png" w-class="arrow"/>
    </div>
    <div w-class="orderType">
        {{for i,v of it.orderType}}
        <div w-class="item" on-tap="itemClick({{i}})">
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
    <div w-class="row">
        <img src="../../../res/image/IDcard.png"/>
        <div w-class="text">实名认证</div>
        <img src="../../../res/image/arrowRight.png"/>
    </div>
</div>