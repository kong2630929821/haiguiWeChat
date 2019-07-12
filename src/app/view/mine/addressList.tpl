<div class="new-page" w-class="new-page">
    {{if it.list.length==0}}
    <div w-class="empty">
        <img src="../../res/image/addressEmpty.png" w-class="emptyImg"/>
        <div w-class="emptyText">没有收货地址，快添加一个</div>
    </div>
    {{else}}
    <div w-class="box">
        {{for i,v of it.list}}
        <div  ev-rightClick="itemClick({{i}})" ev-itemClick ="itemClick({{i}})" ev-leftClick="leftClick({{i}})">
            <widget w-tag="app-components-addressItem-addressItem">{ address:{{v}},left:{{ it.isChoose ?  (i === it.selected ? "selectBox_active.png" : "selectBox.png") : "" }} defaultFlag:{{i === it.defaultAddrId ?true:false}}}</widget>
        </div>
        {{end}}
    </div>
    {{end}}
    <div w-class="btn" on-tap="addAddr">新增地址</div>
</div>