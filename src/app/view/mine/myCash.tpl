<div class="new-page" w-class="page">
    <div w-class="content">
        <div w-class="money">￥{{it1}}</div>
        <div w-class="text">我的现金</div>
        <div w-class="btn {{it.ableWithdraw?'active':''}}" on-tap="withdraw">提现</div>
    </div>
    <div w-class="detail text" on-tap="goDetail">现金明细</div>
</div>