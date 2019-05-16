<div class="new-page" w-class="new-page">
    {{for i,v of it.list}}
    <div  ev-rightClick="itemClick({{i}})" ev-itemClick ="itemClick({{i}})">
        <widget w-tag="app-components-addressItem-addressItem">{ address:{{v}},left:{{ it.isChoose ?  (i === it.selected ? "selectBox_active.png" : "selectBox.png") : "" }} }</widget>
    </div>
    {{end}}
    <div w-class="btn" on-tap="addAddr">新增地址</div>
</div>