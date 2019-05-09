<div class="new-page" w-class="page">
    {{for i,v of it.list}}
    <div ev-leftClick="leftClick({{i}})" ev-rightClick="rightClick({{i}})">
        <widget w-tag="app-components-addressItem-addressItem">{{v}}</widget>
    </div>
    {{end}}
    <div w-class="btn" on-tap="addAddr">新增地址</div>
</div>