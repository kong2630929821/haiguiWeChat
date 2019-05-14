import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { CartGoods, getStore } from '../../store/memstore';
import { calcFreight, getImageThumbnailPath, priceFormat } from '../../utils/tools';
import { calcCartGoodsShow, CartGoodsShow } from './home/home';

interface Props {
    orderGoods:CartGoods[];
}
/**
 * 确认订单
 */
export class ConfirmOrder extends Widget {
    public setProps(props:Props,oldProps:Props) {
        const orderGoodsShow = calcCartGoodsShow(props.orderGoods);
        const ret = this.calcAllFees(orderGoodsShow);
        this.props = {
            ...props,
            ...ret,
            getImageThumbnailPath,
            priceFormat,
            orderGoodsShow,
            address:getStore('mall/addresses')[0]
        };
        super.setProps(this.props,oldProps);
        console.log('ConfirmOrder ======',this.props);
    }
    public selectAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true,selected:0 });
    }

    // 计算商品费用 包括商品总费用 运费总计  税费总计
    // 同一个供应商运费只计算一次
    public calcAllFees(orderGoods:CartGoodsShow[]) {
        let totalSale = 0;
        let totalTax = 0;    // 税费总计
        let totalFreight = 0;           // 运费总计
        const suppliers = new Map();    // 购买同一供应商的所有商品
        const frieghts = [];   // 需要运费的供应商id列表
        for (const v of orderGoods) {
            totalSale += v.finalSale * v.cartGood.amount;
            const supplierId = v.cartGood.goods.supplier;
            if (v.cartGood.goods.has_tax) {     // 保税商品只有税费没有运费
                totalTax += v.cartGood.goods.tax;
            } else {
                if (frieghts.indexOf(supplierId) < 0) frieghts.push(supplierId);
            }
            let oneSupplier = suppliers.get(supplierId);
            if (!oneSupplier) oneSupplier = [];
            oneSupplier.push(v.cartGood);
            suppliers.set(supplierId,oneSupplier);
        }
        totalFreight += calcFreight('123') * frieghts.length;

        return {
            totalSale,
            totalTax,
            totalFreight,
            suppliers
        };

    }
}