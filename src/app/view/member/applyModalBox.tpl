<div class="new-page" w-class="page">
    <div w-class="contain">
        <div w-class="title">填写申请信息</div>
        <div w-class="row" ev-input-change="nameChange">
            <widget w-tag="app-components-input-input">{placeHolder:"输入你的姓名",style:"padding:10px;font-size:28px;",input:{{it.userName}} }</widget>
        </div>
        <div w-class="row" ev-input-change="phoneChange">
            <widget w-tag="app-components-input-input">{placeHolder:"输入你的手机",style:"padding:10px;font-size:28px;",itype:"integer",input:{{it.phoneNum}} }</widget>
        </div>
        <div w-class="row" ev-input-change="phoneCodeChange">
            <widget w-tag="app-components-input-input">{placeHolder:"输入验证码",style:"padding:10px;font-size:28px;"}</widget>
            {{if it.nowCount}}
            <div w-class="btn" style="color:#ccc;border-color:#ccc;">{{it.nowCount}}&nbsp;秒</div>
            {{else}}
            <div w-class="btn" on-tap="getPhoneCode">获取验证码</div>
            {{end}}
        </div>
        <div w-class="row" ev-input-change="inviteCodeChange">
            <widget w-tag="app-components-input-input">{placeHolder:"推荐人邀请码",style:"padding:10px;font-size:28px;",input:{{it.inviteCode}} }</widget>
            <div w-class="btn" on-tap="getInvoteCode">推荐一个</div>
        </div>

        {{if it.selectAddr}}
        <div w-class="row">
            <div style="margin-right:10px;" on-tap="selectArea">
                <widget w-tag="app-components-input-input">{placeHolder:"选择省/市/区",style:"padding:10px;font-size:28px;",input:{{it.area}} }</widget>
            </div>
            <div ev-input-change="addressChange">
                <widget w-tag="app-components-input-input">{placeHolder:"街道门牌、房间号等",style:"padding:10px;font-size:28px;"}</widget>
            </div>
        </div>
        {{end}}
        <div w-class="btns">
            <div w-class="cancel" on-tap="close">取消</div>
            <div w-class="sure" on-tap="confirm">确定</div>
        </div>
    </div>
</div>