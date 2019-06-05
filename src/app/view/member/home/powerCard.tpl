<div w-class="tab">
    <div w-class="row">
        <div w-class="title">尊享{{it.privilegeNumber}}大特权</div>
        {{if it.code}}
        <div w-class="code" on-tap="copy">我的邀请码&nbsp;{{it.code}}</div>
        {{else}}
        <div w-class="update" on-tap="update">立即申请</div>
        {{end}}
    </div>
    <div w-class="desc">{{it.name}}</div>
    <div w-class="row">
        <div w-class="more">· 更多专享 · 更多权益</div>
        <div w-class="money">{{it.money}}</div>
    </div>
</div>