import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { CartGoods, MallLabels, register, setStore } from '../../../store/memstore';
import { calcPrices, calLabelPrice, filterShowLabelImage } from '../../../utils/tools';

export const forelet = new Forelet();

interface Props {
    allSelected:boolean;  // 全选
    editStatus:boolean;  // 购物车编辑状态
    totalSale:string;   // 总价显示
    isIncludeShipping:boolean;  // 是否包含运费 保税商品都无需运费
    canOrder:boolean;   // 是否可以下单
    totalAmount:number;   // 商品购买总数量
}
/**
 * 购物车
 */
export class ShoppingCart extends Widget {
    public create() {
        super.create();
        this.state = STATE;
    }

    public setProps(props:Props) {
        this.props = {
            ...props,
            allSelected:false,
            editStatus:false,
            totalSale:'0.00',
            isIncludeShipping:false, // 是否包含运费 保税商品都无需运费
            canOrder:false,           // 是否可以下单
            totalAmount:0
        };
        super.setProps(this.props);
    }

    // 编辑
    public edit() {
        this.props.editStatus = !this.props.editStatus;
        this.props.allDelete = false;
        this.props.deleteList = [];
        this.paint();
    }

    // 选中或取消
    public selectOrNot(index:number) {
        this.state.cartGoodsShow[index].cartGood.selected = !this.state.cartGoodsShow[index].cartGood.selected;
        let isSelectAll = true;
        const cartGoodsShow = this.state.cartGoodsShow;
        for (const v of cartGoodsShow) {
            if (!v.cartGood.selected) {
                isSelectAll = false;
                break;
            }
        }
        this.props.allSelected = isSelectAll;
        this.calcTotalFee();
        this.paint();
    }
    
    // 全选或取消全选
    public selectAllOrNot() {
        const cartGoodsShow = this.state.cartGoodsShow;
        const isSelectAll = !this.props.allSelected;
        for (const v of cartGoodsShow) {
            v.cartGood.selected = isSelectAll;
        }
        this.props.allSelected = isSelectAll;
        this.calcTotalFee();
        this.paint();
    }

    // 减少商品数量
    public delGoodsNum(index:number) {
        const cartGood = this.state.cartGoodsShow[index].cartGood;
        const nowAmount = --cartGood.amount;
        cartGood.amount = nowAmount >= 1 ? nowAmount : 1;
        this.calcTotalFee();
        this.paint();
    }

    // 增加商品数量
    public addGoodsNum(index:number) {
        const cartGood = this.state.cartGoodsShow[index].cartGood;
        const nowAmount = ++cartGood.amount;
        cartGood.amount = nowAmount > cartGood.goods.inventorys ? cartGood.goods.inventorys : nowAmount;
        this.calcTotalFee();
        this.paint();
    }

    // 结算
    public pay() {
        if (!this.props.canOrder) return;
        const wantGoods = [];
        this.state.cartGoodsShow.forEach(v => {
            if (v.cartGood.selected) wantGoods.push(v);
        });
        popNew('app-view-shoppingCart-confirmOrder',{ orderGoods:wantGoods });
    }

    // 计算商品总价
    public calcTotalFee() {
        const cartGoodsShow = this.state.cartGoodsShow;
        let totalSale = 0;
        let isIncludeShipping = true;    // 是否包含运费 保税商品都无需运费
        let canOrder = false;           // 是否可以下单
        let totalAmount = 0;          // 购买商品的总数量
        for (const v of cartGoodsShow) {
            if (v.cartGood.selected) {
                totalSale += v.finalSale * v.cartGood.amount;
                totalAmount += v.cartGood.amount;
                canOrder = true;
            }
            
            if (!v.cartGood.goods.has_tax) isIncludeShipping = false;
        }

        this.props.totalSale = totalSale;
        this.props.isIncludeShipping = isIncludeShipping;
        this.props.canOrder = canOrder;
        this.props.totalAmount = totalAmount;
    }

    // 删除购物车商品
    public delCartGoods() {
        const cartGoodsShow = this.state.cartGoodsShow;
        const cartGoods = [];
        cartGoodsShow.forEach(v => {
            if (!v.cartGood.selected) cartGoods.push(v.cartGood);
        });
        setStore('mall/cartGoods',cartGoods);
    }
}
const STATE = {
    cartGoodsShow:[]  // 购物车列表显示
};

// 购物车商品显示信息
export interface CartGoodsShow {
    cartGood:CartGoods;   // 放入购物车的商品
    labelShow:string;    // 显示标签
    priceRet:any;       // 计算后的价格相关信息
    finalSale:number;     // 最终的商品售价  包括标签的不同影响的价格 
    image:MallLabels;   // 要展示的图片
}
register('mall/cartGoods',(cartGoods:CartGoods[]) => {
    const cartGoodsShow:CartGoodsShow[] = [];
    for (const cartGood of cartGoods) {
        const cartGoodShow:any = {};
        const labelName = [];
        for (const label of cartGood.labels) {
            labelName.push(label.name);
        }
        const priceRet = calcPrices(cartGood.goods);
        cartGoodShow.cartGood = cartGood;          // 购物车原始信息
        cartGoodShow.labelShow = labelName.join(',');   // 显示标签
        cartGoodShow.priceRet = priceRet;           // 价格相关信息
        cartGoodShow.finalSale = priceRet.sale + calLabelPrice(cartGood.labels);                  // 最终的商品售价  包括标签的不同影响的价格
        cartGoodShow.image = filterShowLabelImage(cartGood.goods.labels,cartGood.labels[cartGood.labels.length - 1]);  // 要展示的图片
        cartGoodsShow.push(cartGoodShow);
    }
    STATE.cartGoodsShow = cartGoodsShow;
    console.log('cartGoods STATE====',STATE);
    forelet.paint(STATE);
});