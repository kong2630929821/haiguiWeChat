<div class="new-page" w-class="page">
    <div w-class="contain">
        <div w-class="title">{{it.title ? it.title : "填写申请信息"}}</div>
        {{if it.unaccalimed}}
        <div w-class="prompt">您还有会员礼包未领取</div>
        {{else}}
        
        {{if it.realName}}
        <div w-class="row" style="border-bottom:1px solid #888;">
            <div w-class="addr" style="color:#222;">{{it.realName}}</div>
            <div style="font-size:24px;color:#B2B2B2">*不可修改</div>
        </div>
        {{else}}
        <div w-class="row" ev-input-change="nameChange">
            <widget w-tag="app-components-input-input">{placeHolder:"输入你的姓名",style:"padding:10px;font-size:28px;",input:{{it.userName}} }</widget>
        </div>
        {{end}}
        <div w-class="row" ev-input-change="phoneChange">
            <widget w-tag="app-components-input-input">{placeHolder:"输入你的手机",style:"padding:10px;font-size:28px;",itype:"integer",maxLength:11,input:{{it.phoneNum}} }</widget>
        </div>

        {{% ===================修改手机号显示验证码===================}}
        {{if it.changePhone}}
        <div w-class="row" ev-input-change="phoneCodeChange">
            <widget w-tag="app-components-input-input">{placeHolder:"输入验证码",style:"padding:10px;font-size:28px;",maxLength:4}</widget>
            {{if it.nowCount}}
            <div w-class="btn" style="color:#ccc;border-color:#ccc;">{{it.nowCount}}&nbsp;秒</div>
            {{else}}
            <div w-class="btn" on-tap="getPhoneCode">获取验证码</div>
            {{end}}
        </div>
        {{end}}

        {{% ===================绑定过邀请码不可修改===================}}
        {{if it.fcode}}
        <div w-class="row" style="border-bottom:1px solid #888;">
            <div w-class="addr" style="color:#222;">{{it.fcode}}</div>
            <div style="font-size:24px;color:#B2B2B2">*不可修改</div>
        </div>
        {{else}}
        <div w-class="row" ev-input-change="inviteCodeChange">
            <widget w-tag="app-components-input-input">{placeHolder:"推荐人邀请码",style:"padding:10px;font-size:28px;",input:{{it.inviteCode}} }</widget>
            {{:flag=true}}
            {{if flag}}
                <div w-class="btn" on-tap="getInvoteCode">推荐一个</div>
            {{end}}
        </div>
        {{end}}
        {{end}}
        
        {{if it.needAddress}}
        <div w-class="row">
            <div w-class="addr">{{it.address ? it.addressFormat(it.address.address):"详细地址"}}</div>
            <div w-class="btn" on-tap="selAddr">选择地址</div>
        </div>
        {{end}}

        {{if it.needSelGift}}
        <div w-class="row" style="justify-content: space-between;">
            <div w-class="selbtn {{it.selected=='A'?'active':''}}" on-tap="changeSel('A')">焕颜亮肤礼包</div>
            <div w-class="selbtn {{it.selected=='B'?'active':''}}" on-tap="changeSel('B')">商户联盟礼包</div>
        </div>
        {{end}}

        <div w-class="btns">
            <div w-class="cancel" on-tap="close">取消</div>
            <div w-class="sure" on-tap="confirm">确定</div>
        </div>
    </div>
</div>