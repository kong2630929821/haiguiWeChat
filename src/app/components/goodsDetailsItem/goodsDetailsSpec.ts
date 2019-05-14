import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { GoodsDetails } from '../../store/memstore';
import { calcInventorys, calcPrices, getImageThumbnailPath, popNewMessage, priceFormat } from '../../utils/tools';

interface Props {
    goods:GoodsDetails;
    amount:number;           // 选择数量
}
/**
 * 规格选择
 */
export class GoodsDetailsSpec extends Widget {
    public setProps(props:Props,oldProps:Props) {
        const ret = calcPrices(props.goods);
        this.props = {
            ...props,
            ...ret,
            priceFormat,
            inventorys:calcInventorys(props.goods.labels),  // 库存
            finalSale:ret.sale,  // 卖价加上标签影响的价格
            skuIndex:-1,     // 选择的sku下标
            image:getImageThumbnailPath(props.goods.images)
        };
        super.setProps(this.props,oldProps);
    }

    // 选择标签
    public clickLableItem(e:any,index:number) {
        this.props.skuIndex = index;
        const sku = this.props.goods.labels[index];
        this.props.finalSale = this.props.sale  + sku[2];
        this.props.inventorys = sku[3];
        this.props.amount = this.props.amount > this.props.inventorys ? this.props.inventorys : this.props.amount;
        this.paint();
    }

    // 减少购买数量
    public lessClick() {
        const nowAmount = --this.props.amount;
        this.props.amount = nowAmount >= 1 ? nowAmount : 1;
        this.paint();
    }

    // 增加购买数量
    public addClick(e:any) {
        const nowAmount = ++this.props.amount;
        this.props.amount = nowAmount > this.props.inventorys ? this.props.inventorys : nowAmount;
        this.paint();
    }

    // 关闭
    public closeClick(e:any) {
        notify(e.node,'ev-close-spec',{ amount:this.props.amount,sku:this.props.goods.labels[this.props.skuIndex] });
    }

    // 加入购物车
    public pushShoppingCart(e:any) {
        if (this.props.skuIndex === -1) {
            popNewMessage('请选择规格');
            
            return;
        }
        this.closeClick(e);
        notify(e.node,'ev-push-shopping-cart',undefined);
    }

    public buyNow(e:any) {
        if (this.props.skuIndex === -1) {
            popNewMessage('请选择规格');
            
            return;
        }
        this.closeClick(e);
        notify(e.node,'ev-buy-now',undefined);
    }
}
