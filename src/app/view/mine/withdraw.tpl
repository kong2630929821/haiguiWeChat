<div class="new-page">
    <div w-class="content" ev-input-change="moneyChange">
        <div w-class="money">提现金额</div>
        <widget w-tag="app-components-input-inputLabel">{label:"￥",style:"font-size:80px;padding:10px;",itype:"integer",labelStyle:"width:auto;font-size: 80px;",input:{{Number(it.inputMoney)}} }</widget>
        <div w-class="desc">提现金额必须是10的倍数</div>
        <div w-class="desc">今日单笔提现不超过{{it1.singleLimit}}元</div>
        {{if it.tax}}
        <div w-class="desc">额外扣除￥{{it.tax}}元的手续费（费率{{it1.tariff * 100}}%）</div>
        {{end}}
        {{if it.notice}}
        <div w-class="desc" style="color:rgb(241, 44, 32);">输入金额超过余额总数</div>
        {{end}}
    </div>
    <div w-class="total">现金余额&nbsp;{{it.balance}}元</div>
    <div w-class="btn" on-tap="confirm">申请提现</div>
</div>