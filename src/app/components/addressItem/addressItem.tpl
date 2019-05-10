<div w-class="item" on-tap="itemClick">
    {{if it.left}}
    <img src="../../res/image/{{it.left}}" w-class="img" on-tap="leftImg"/>
    {{end}}
    <div w-class="{{it.left?'':'left'}} {{it.right?'':'right'}}">
        <div w-class="row text">
            <div>收货人：{{it.address.name}}</div>
            <div>{{it.address.tel}}</div>
        </div>
        <div w-class="address">收货地址：{{it.address.address}}</div>
    </div>
    {{if it.right}}
    <img src="../../res/image/{{it.right}}" w-class="img1" on-tap="rightImg"/>
    {{end}}
</div>