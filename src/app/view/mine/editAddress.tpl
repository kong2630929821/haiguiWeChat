<div class="new-page" w-class="new-page">
    {{if it.onlyDel}}
        <div w-class="row row1">
            <div w-class="column">姓名</div><div>{{it.name}}</div>
        </div>
        <div w-class="row row1" >
            <div w-class="column">电话</div><div>{{it.tel}}</div>
        </div>
        <div w-class="row row1" >
            <div w-class="column">地区</div><div>{{it.province.join("")}}</div>
        </div>
        <div w-class="row row1">
            <div w-class="column">详细地址</div><div>{{it.address}}</div>
        </div>
    {{else}}
        <div w-class="row" ev-input-change="nameChange">
            <widget w-tag="app-components-input-inputLabel">{placeHolder:"收货人姓名",style:"padding:20px;font-size:34px;",label:"姓名",input:{{it.name}},maxLength:10 }</widget>
        </div>
        <div w-class="row" ev-input-change="telChange">
            <widget w-tag="app-components-input-inputLabel">{placeHolder:"收货人手机号",style:"padding:20px;font-size:34px;",label:"电话",itype:"integer",input:{{it.tel}},maxLength:11}</widget>
        </div>
        <div w-class="row address" on-tap="selectArea">
            <div style="width: 160px;flex-shrink: 0;">地区</div>
            {{if it.province.length === 0}}
            <div w-class="selectArea" style="color: #B2B2B2;">选择省/市/区</div>
            {{else}}
            <div w-class="selectArea">{{it.province.join("")}}</div>
            {{end}}
        </div>
        <div w-class="row" ev-input-change="addressChange">
            <widget w-tag="app-components-input-inputLabel">{placeHolder:"街道门牌、楼层房间号等",style:"padding:20px;font-size:34px;",label:"详细地址",input:{{it.address}}}</widget>
        </div>
        <div w-class="row setDefault">
            <div w-class="setTitle">设为默认地址</div>
            <img src="{{it.defaultAddr?'../../res/image/selectBox_active.png':'../../res/image/selectBox.png'}}" w-class="img" on-tap="leftImg"/>
        </div>
    {{end}}
    <div w-class="">
        <div w-class="btn" style="margin-top:400px;" on-tap="saveAddress">保存</div>
        <div w-class="btn btn1" on-tap="delAddress">删除收货地址</div>
    </div>
</div>