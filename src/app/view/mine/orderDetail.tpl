<div class="new-page" w-class="new-page">
    <div w-class="top">
        <div w-class="row">
            <div w-class="text row">
                <img src="../../res/image/address.png" w-class="img"/>
                <span>收货人：{{it.order.name}}</span>
            </div>
            <div w-class="text">{{it.order.tel}}</div>
        </div>
        <div w-class="address">收货地址：{{it.addressFormat(it.order.address)}}</div>
    </div>

    <div w-class="orders"><widget w-tag="app-view-mine-orderItemDetail">{status:{{it.status}},order:{{it.order}} }</widget></div>
    <div w-class="divid"></div>
    <div w-class="row2">
        <div w-class="total">
            {{if it.statusShow.btn1}}
            <div w-class="btn" on-tap="btnClick(e,0)">{{it.statusShow.btn1}}</div>
            {{end}}
            {{if it.statusShow.btn2}}
            <div w-class="btn btn1" on-tap="btnClick(e,1)">{{it.statusShow.btn2}}</div>
            {{end}}
        </div>
    </div>
</div>