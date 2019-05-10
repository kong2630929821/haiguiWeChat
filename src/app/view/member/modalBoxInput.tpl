<div class="new-page" w-class="page">
    <div w-class="contain">
        <div w-class="title">填写申请信息</div>
        <div w-class="row">
            <widget w-tag="app-components-input-input">{placeHolder:"输入你的姓名",style:"padding:10px;font-size:28px;"}</widget>
        </div>
        <div w-class="row">
            <widget w-tag="app-components-input-input">{placeHolder:"输入你的手机",style:"padding:10px;font-size:28px;"}</widget>
        </div>
        <div w-class="row">
            <widget w-tag="app-components-input-input">{placeHolder:"输入验证码",style:"padding:10px;font-size:28px;"}</widget>
            <div w-class="btn" on-tap="">获取验证码</div>
        </div>
        <div w-class="row">
            <widget w-tag="app-components-input-input">{placeHolder:"推荐人邀请码",style:"padding:10px;font-size:28px;"}</widget>
            <div w-class="btn">推荐一个</div>
        </div>

        {{if it.selectAddr}}
        <div w-class="row">
            <div style="margin-right:10px;" on-tap="selectArea">
                <widget w-tag="app-components-input-input">{placeHolder:"选择省/市/区",style:"padding:10px;font-size:28px;",input:{{it.area}} }</widget>
            </div>
            <div>
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