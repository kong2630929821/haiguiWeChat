<div class="new-page" w-class="page">
    <div w-class="top" ev-itemClick="selectAddr" ev-rightClick="selectAddr">
        {{if it.address}}
        <widget w-tag="app-components-addressItem-addressItem">{address:{{it.address}}}</widget>
        {{else}}
        <div w-class="row row-addr" on-tap="addAddress">
            <div w-class="row" style="flex:1 0 0;">
                <img src="../../res/image/add_blue.png" style="margin-right:20px;width:46px;height:46px;"/>
                <div w-class="text">添加地址</div>
            </div>
            <img src="../../res/image/arrowRight.png" style="width:30px;height:30px;"/>
        </div>
        {{end}}
    </div>

    <div w-class="all-split-order">
        {{for i,v of it.splitOrders}}
        <app-view-shoppingCart-splitOrder>{splitOrder:{{v}}}</app-view-shoppingCart-splitOrder>
        {{end}}
    </div>
    <div w-class="bottom">
        <div >
            共{{it.totalAmount}}件 合计：
            <span style="font-size:32px;color:#8A4AF3">{{((it.totalSale + it.totalFreight + it.totalTax) / 100).toFixed(2)}}</span>
            <span w-class="pay" on-tap="orderClick">结算</span>
        </div>
    </div>
</div>