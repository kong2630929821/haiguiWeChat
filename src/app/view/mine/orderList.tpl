<div class="new-page" w-class="page">
    <div w-class="orderType">
        {{for i,v of it.allStaus}}
        <div w-class="item" on-tap="typeClick({{v.status}})">
            <div w-class="name {{it.activeStatus == v.status ? 'active':''}}">{{v.name}}</div>
        </div>
        {{end}}
    </div>

    <div w-class="content">
        {{for i,v of it.curShowOrders}}
        <div ev-btn-click="btnClick(e,{{i}})" ev-item-click="itemClick({{i}})">
            <widget w-tag="app-view-mine-orderItem">{status:{{it.activeStatus}},order:{{v}} }</widget>
        </div>
        {{end}}
    </div>

</div>