<div class="new-page" w-class="page">
    <div w-class="orderType">
        {{for i,v of it.allStaus}}
        <div w-class="item" on-tap="typeClick({{v.status}})">
            <div w-class="name {{it.activeStatus == v.status ? 'active':''}}">{{v.name}}</div>
            {{if it1.returnGoodsFg && i===1}}
            <div w-class="spot"></div>
            {{end}}
        </div>
        {{end}}
    </div>

    <div w-class="content">
        {{: list = it1.orders.get(it.activeStatus) || []}}
        {{for i,v of list}}
        <div ev-btn-click="btnClick(e,{{i}})" >
            <widget w-tag="app-view-returnGoods-afterSaleOrderItem">{status:{{it.activeStatus}},afterSaleOrder:{{v}} }</widget>
        </div>
        {{end}}
    </div>

</div>