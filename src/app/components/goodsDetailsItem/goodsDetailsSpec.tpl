<div class="new-page" w-class="new-page">
    <div w-class="mask"></div>
    <div w-class="body">
        <div w-class="desc">
            <div w-class="basic-msg">
                <div style="background-image:url(../../res/image/{{it.goods.images[0].path}});" class="bg-img" w-class="img"></div>
                <div w-class="content-box">
                    <div w-class="box1">
                        <div w-class="good-price">
                            <div w-class="buy-price">{{it.sale}}</div>
                            {{if it.discount}}
                            <div w-class="original-price">{{it.origin}}</div>
                            {{end}}
                        </div>
                        <div w-class="left-num">剩余{{it.goods.inventorys}}件</div>
                    </div>
                </div>
                <img src="../../res/image/close.png" w-class="close-icon"/>
            </div>
            {{for i,v of it.choosedLabels}}
            <div w-class="choose-item">
                <div w-class="choose-item-title">选择</div>
                <div w-class="choose-box">
                    {{for j,k of v[1]}}
                    <span w-class="item {{k === it.hasLabels[i] ? 'item-active' : ''}}" on-tap="clickLableItem(e,{{i}},{{j}})">{{k}}</span>
                    {{end}}
                </div>
            </div>
            {{end}}
        </div>
        <div w-class="buy">
            <div w-class="buy-title">购买数量</div>
            <div w-class="buy-box">
                <img src="../../res/image/less_icon.png" on-tap="lessClick"/>
                <div w-class="buy-num">{{it.buyNumber}}</div>
                <img src="../../res/image/add_icon.png" on-tap="addClick"/>
            </div>
        </div>
    </div>
    <div w-class="fix-bottom">
        <div w-class="fix-item fix-item-2" style="background-color:#DF4AF3;">加入购物车</div>
        <div w-class="fix-item fix-item-2" style="background-color:#8A4AF3;">立即购买</div>
    </div>
</div>