<div>
    <div w-class="row row1">
        <div w-class="order">{{it.orderIdShow}}</div>
        <div w-class="status">{{it.statusShow.desc}}</div>
    </div>
    {{for i,v of it.order.orderGoods}}
    <div w-class="row" style="margin:20px 30px;" on-tap="itemClick">
        {{: goods = v[0]}}
        <img src="../../res/image/{{it.getImageThumbnailPath(goods.images)}}" w-class="goodsImg"/>
        <div w-class="column">
            <div w-class="goodsTitle" class="line2-overflow">{{goods.name}}</div>
            <div style="margin-bottom: 20px;">{{goods.labels[0][1]}}</div>
            <div w-class="row">
                <span style="font-size:32px;color:#8A4AF3;">￥ {{it.priceFormat(v[2])}}</span>
                <span style="font-size:20px;color:#353535;">x{{v[1]}}</span>
            </div>
        </div>
    </div>
    {{end}}
    <div w-class="row1">
        <div w-class="total">
            合计<span style="font-size:32px;color:#8A4AF3">￥ {{it.priceFormat(it.order.origin)}}</span>
        </div>
    </div>

    <div w-class="row1">
        <div w-class="total">
            {{if it.statusShow.btn1}}
            <div w-class="btn" on-tap="btnClick(e,0)">{{it.statusShow.btn1}}</div>
            {{end}}
            <div w-class="btn btn1" on-tap="btnClick(e,1)">{{it.statusShow.btn2}}</div>
        </div>
    </div>
</div>