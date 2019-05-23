<div class="new-page" w-class="new-page">
    <div w-class="mask" on-tap="closeClick"></div>
    <div w-class="body">
        <div w-class="desc">
            <div w-class="basic-msg">
                <div style="background-image:url(../../res/image/{{it.image}});" class="bg-img" w-class="img"></div>
                <div w-class="content-box">
                    <div w-class="box1">
                        <div w-class="good-price">
                            <div w-class="buy-price">{{it.priceFormat(it.finalSale)}}</div>
                            {{if it.discount}}
                            <div w-class="original-price">{{it.priceFormat(it.origin)}}</div>
                            {{end}}
                        </div>
                        <div w-class="left-num">剩余{{it.inventorys}}件</div>
                    </div>
                </div>
                <div on-tap="closeClick" w-class="close-item"><img src="../../res/image/close.png" w-class="close-icon" /></div>
            </div>
           
            <div w-class="choose-item">
                <div w-class="choose-item-title">选择</div>
                <div w-class="choose-box">
                    {{for i,v of it.goods.labels}}
                    <span w-class="item {{i === it.skuIndex ? 'item-active' : ''}} {{v[3] === 0 ? 'item-sold-out' : ''}}" on-tap="clickLableItem(e,{{i}})">{{v[1]}}</span>
                    {{end}}
                </div>
            </div>
        </div>
        <div w-class="buy">
            <div w-class="buy-title">购买数量</div>
            <div w-class="buy-box">
                <div on-tap="addClick" w-class="click-item"><img src="../../res/image/less_icon.png" on-tap="lessClick"/></div>
                <div w-class="buy-num">{{it.amount}}</div>
                <div on-tap="addClick" w-class="click-item"><img src="../../res/image/add_icon.png" /></div>
            </div>
        </div>
    </div>
    <div w-class="fix-bottom">
        <div w-class="fix-item fix-item-2" style="background-color:#8A4AF3;" on-tap="sureClick">确定</div>
    </div>
</div>