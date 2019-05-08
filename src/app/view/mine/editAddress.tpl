<div class="new-page">
    <div w-class="row">
        <widget w-tag="app-components-input-inputLabel">{placeHolder:"收货人姓名",style:"padding:20px;font-size:34px;",label:"姓名",input:{{it.name}} }</widget>
    </div>
    <div w-class="row">
        <widget w-tag="app-components-input-inputLabel">{placeHolder:"收货人手机号",style:"padding:20px;font-size:34px;",label:"电话",itype:"integer",input:{{it.tel}}}</widget>
    </div>
    <div w-class="row">
        <widget w-tag="app-components-input-inputLabel">{placeHolder:"选择省/市/区",style:"padding:20px;font-size:34px;",label:"地区",input:{{it.province}}}</widget>
    </div>
    <div w-class="row">
        <widget w-tag="app-components-input-inputLabel">{placeHolder:"街道门牌、楼层房间号等",style:"padding:20px;font-size:34px;",label:"详细地址",input:{{it.address}}}</widget>
    </div>

    <div w-class="btn" style="margin-top:400px;">保存并使用</div>
    <div w-class="btn btn1">删除收货地址</div>
</div>