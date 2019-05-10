<div w-class="tab">
    <div w-class="row">
        <div w-class="title">权益升级</div>
        {{if it.code}}
        <div w-class="code">我的邀请码&nbsp;{{it.code}}</div>
        {{else}}
        <div w-class="update" on-tap="update">立即开通</div>
        {{end}}
    </div>
    <div w-class="desc">{{it.name}}</div>
    <div w-class="row">
        <div w-class="more">· 更多专享 · 更多权益</div>
        <div w-class="money">{{it.money}}</div>
    </div>
</div>