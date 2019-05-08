<div w-class="page">
    {{if it.list.length==0}}
    <div w-class="empty">
        <img src="../../../res/image/emptyCart.png" w-class="emptyImg"/>
        <div w-class="emptyText">去挑选中意的商品</div>
        <div w-class="shopping">去逛逛</div>
    </div>
    {{else}}
        <div style="position:relative;height: 88px;">
            <div w-class="edit" on-tap="edit">{{it.editStatus?"完成":"编辑"}}</div>
        </div>
        {{for i,v of it.list}}
        <div w-class="goods">
            {{if !it.editStatus}}
                <img src="../../../res/image/{{it.selectList.indexOf(i)>-1?'selectBox_active.png':'selectBox.png'}}" w-class="selectBox" on-tap="select({{i}})"/>
            {{else}}
                <img src="../../../res/image/{{it.deleteList.indexOf(i)>-1?'redSelBox_active.png':'selectBox.png'}}" w-class="selectBox" on-tap="delGoods({{i}})"/>
            {{end}}
            <img src="../../../res/image/classify_active.png" w-class="goodsImg"/>
            <div w-class="column">
                <div w-class="goodsTitle">{{v.name}}</div>
                <div w-class="goodsFg">{{v.label}}</div>
                <div w-class="row">
                    <span style="font-size:32px;color:#8A4AF3;">{{v.price.toFixed(2)}}</span>
                    <div w-class="row">
                        <div w-class="btn" on-tap="delGoodsNum({{i}})">-</div>
                        <div w-class="btn total">{{v.num}}</div>
                        <div w-class="btn" on-tap="addGoodsNum({{i}})">+</div>
                    </div>
                </div>
            </div>
        </div>
        {{end}}

        <div w-class="row bottom">
            {{if !it.editStatus}}
                <div w-class="row" on-tap="selectAll">
                    <img src="../../../res/image/{{it.allSelected?'selectBox_active.png':'selectBox.png'}}" w-class="selectBox"/>
                    <span style="font-size:34px;">全选</span>
                </div>
                <div w-class="column totalMoney">
                    <div>合计：<span style="font-size:32px;color:#8A4AF3">{{it.totalMoney.toFixed(2)}}</span></div>
                    <div style="color:#888">不含运费</div>
                </div>
                <div w-class="pay {{it.selectList.length>0?'active':''}}" on-tap="pay">结算({{it.selectList.length}})</div>
            {{else}}

                <div w-class="row" on-tap="deleteAll">
                    <img src="../../../res/image/{{it.allDelete?'redSelBox_active.png':'selectBox.png'}}" w-class="selectBox"/>
                    <span style="font-size:34px;">全选</span>
                </div>
                <div w-class="pay {{it.deleteList.length>0?'active':''}}">删除</div>
            {{end}}
        </div>
    {{end}}
</div>