<div class="new-page" w-class="new-page">
    <div w-class="top">
        <div w-class="row">
            <div w-class="text row">
                <img src="../../res/image/address.png" w-class="img"/>
                <span>收货人：{{it.order.name}}</span>
            </div>
            <div w-class="text">{{it.order.tel}}</div>
        </div>
        <div w-class="address">收货地址：{{it.order.address}}</div>
    </div>

    <div w-class="orders"><widget w-tag="app-view-mine-orderItemDetail">{status:{{it.status}},order:{{it.order}} }</widget></div>

    <div w-class="row row1">
        <div w-class="order">
            百世快递&nbsp;<span style="color:#000;">12323565612154</span>
        </div>
        <img src="../../res/image/copy.png" w-class="copy"/>
    </div>
    <div w-class="process-box">
    {{for i,v of [1,2,3,4,5,6]}}
    <div w-class="process">
        <div>商品等待揽收</div>
        <div style="font-size: 26px;margin-top: 10px;">04-14 23:00</div>
    </div>
    {{end}}
    </div>
</div>