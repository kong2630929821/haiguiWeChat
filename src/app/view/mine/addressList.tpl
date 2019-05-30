<div class="new-page" w-class="new-page">
    <div w-class="box">
        {{for i,v of it.list}}
        <div  ev-rightClick="itemClick({{i}})" ev-itemClick ="itemClick({{i}})" ev-leftClick="leftClick({{i}})">
            <widget w-tag="app-components-addressItem-addressItem">{ address:{{v}},left:{{ it.isChoose ?  (i === it.selected ? "selectBox_active.png" : "selectBox.png") : "" }} }</widget>
        </div>
        {{end}}
    </div>
    <div w-class="btn" on-tap="addAddr">新增地址</div>
</div>