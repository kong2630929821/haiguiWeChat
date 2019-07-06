<div w-class="item" on-tap="itemClick">
    {{if it.left}}
    <img src="../../res/image/{{it.left}}" w-class="img" on-tap="leftImg"/>
    {{end}}
    <div w-class="{{it.left?'':'left'}} {{it.right?'':'right'}}" style="flex: 1 0 0;">
        <div w-class="row text">
            <div>收货人：{{it.address.name}}</div>
            <div>
                {{it.address.tel}}
                {{if it.defaultFlag}}
                    <div w-class="flag">默认</div>
                {{end}}
            </div>
            
        </div>
        <div w-class="address">收货地址：{{it.addressShow}}</div>
    </div>
    {{if it.right}}
    <img src="../../res/image/{{it.right}}" w-class="img1" on-tap="rightImg"/>
    {{end}}
</div>