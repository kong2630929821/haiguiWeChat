<div class="new-page" w-class="page">
    <div w-class="top" ev-itemClick="selectAddr">
        {{if !it.address}}
        <widget w-tag="app-components-addressItem-addressItem"></widget>
        {{else}}
        <div w-class="row">
            <div w-class="row">
                <img src="../../res/image/add_blue.png"/>
                <div w-class="text">添加地址</div>
            </div>
            <img src="../../res/image/arrowRight.png"/>
        </div>
        {{end}}
    </div>

    <div w-class="goodsList">
        {{for i,v of it.orderGoods}}
        <div w-class="row " style="padding:20px 30px;" on-tap="itemClick">
            <img src="../../res/image/classify_active.png" w-class="goodsImg"/>
            <div w-class="column">
                <div w-class="goodsTitle">商品标题商品标题商品标题商品标题商品标题商品标题商品标题</div>
                <div style="margin-bottom: 20px;">红色，规格1</div>
                <div w-class="row">
                    <span style="font-size:32px;color:#8A4AF3;">￥ 88.00</span>
                    <span style="font-size:20px;color:#353535;">x1</span>
                </div>
            </div>
        </div>
        {{end}}
    </div>

    <div w-class="row row1">
        <div>商品金额</div>
        <div w-class="total">
            合计<span style="font-size:32px;color:#8A4AF3">￥ 88.00</span>
        </div>
    </div>
    <div w-class="row row1">
        <div>运费</div>
        <span style="font-size:32px;color:#8A4AF3">￥ 88.00</span>
    </div>
    <div w-class="row row1">
        <div>税费</div>
        <span style="font-size:32px;color:#8A4AF3">￥ 88.00</span>
    </div>
    <div w-class="bottom">
        <div >
            共4件 合计：
            <span style="font-size:32px;color:#8A4AF3">88.00</span>
            <span w-class="pay">结算</span>
        </div>
    </div>
</div>