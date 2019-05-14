<div w-class="new-page" class="new-page">
    {{if it1.cartGoodsShow.length==0}}
    <div w-class="empty">
        <img src="../../../res/image/emptyCart.png" w-class="emptyImg"/>
        <div w-class="emptyText">去挑选中意的商品</div>
        <div w-class="shopping">去逛逛</div>
    </div>
    {{else}}
    <div style="position:relative;height: 88px;">
        <div w-class="edit" on-tap="edit">{{it.editStatus?"完成":"编辑"}}</div>
    </div> 
    <div w-class="list">
        {{for i,v of it1.cartGoodsShow}}
        <div w-class="goods">
            {{if !it.editStatus}}
                <img src="../../../res/image/{{v.cartGood.selected ?'selectBox_active.png':'selectBox.png'}}" w-class="selectBox" on-tap="selectOrNot({{i}})"/>
            {{else}}
                <img src="../../../res/image/{{v.cartGood.selected ? 'redSelBox_active.png':'selectBox.png'}}" w-class="selectBox" on-tap="selectOrNot({{i}})"/>
            {{end}}
            <img src="../../../res/image/{{it.getImageThumbnailPath(v.cartGood.goods.images)}}" w-class="goodsImg"/>
            <div w-class="column">
                <div class="line2-overflow" w-class="goodsTitle" on-tap="goodsClick(e,{{i}})">{{v.cartGood.goods.name}}</div>
                <div w-class="goodsFg" class="line1-overflow">{{v.labelShow}}</div>
                <div w-class="row">
                    <div w-class="good-price">
                        <div w-class="buy-price">￥{{it.priceFormat(v.finalSale)}}</div>
                        {{if v.priceRet.discount}}
                        <div w-class="original-price">{{it.priceFormat(v.priceRet.origin)}}</div>
                        {{end}}
                    </div>
                    <div w-class="row1">
                        <div w-class="btn" on-tap="delGoodsNum({{i}})">-</div>
                        <div w-class="btn total">{{v.cartGood.amount}}</div>
                        <div w-class="btn" on-tap="addGoodsNum({{i}})">+</div>
                    </div>
                </div>
            </div>
        </div>
        {{end}} 
    </div>
        

        <div w-class="row bottom">
            {{if !it.editStatus}}
                <div w-class="row" on-tap="selectAllOrNot">
                    <img src="../../../res/image/{{it.allSelected?'selectBox_active.png':'selectBox.png'}}" w-class="selectBox"/>
                    <span style="font-size:34px;">全选</span>
                </div>
                <div w-class="column totalMoney">
                    <div>合计：<span style="font-size:32px;color:#8A4AF3">{{(it.totalSale/100).toFixed(2)}}</span></div>
                    <div style="color:#888;{{it.canOrder ? '' : 'visibility: hidden;'}}">{{it.isIncludeShipping ? "含运费" : "不含运费"}}</div>
                </div>
                <div w-class="pay {{it.canOrder ? 'active':''}}" on-tap="pay">结算({{it.totalAmount}})</div>
            {{else}}
                <div w-class="row" on-tap="selectAllOrNot">
                    <img src="../../../res/image/{{it.allSelected ? 'redSelBox_active.png':'selectBox.png'}}" w-class="selectBox"/>
                    <span style="font-size:34px;">全选</span>
                </div>
                <div w-class="pay {{it.canOrder ? 'active': '' }}" on-tap="delCartGoods">删除</div>
            {{end}}
        </div>
    {{end}}
</div>