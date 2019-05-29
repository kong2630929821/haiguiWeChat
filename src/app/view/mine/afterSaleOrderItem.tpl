<div>
    
    {{for i,v of it.afterSaleOrder.order.orderGoods}}
    <div w-class="id">退货单号:{{it.afterSaleOrder.id}}</div>
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
            {{if it.statusShow.btn1}}
            <div w-class="btn" on-tap="btnClick(e,0)">{{it.statusShow.btn1}}</div>
            {{end}}
            {{: showText = it.status === it.ReturnGoodsStatus.CANRETURN ? it.afterSaleOrder.request_time > 0 : !!it.statusShow.text}}
            {{if !showText}}
            <div w-class="btn btn1" on-tap="btnClick(e,1)">{{it.statusShow.btn2}}</div>
            {{else}}
            {{:text = it.status === it.ReturnGoodsStatus.RETURNED ? (it.afterSaleOrder.status === 1 ? it.statusShow.text1 : it.statusShow.text2) : it.statusShow.text}}
            <div w-class="text">{{text}}</div>
            {{end}}
        </div>
    </div>
</div>