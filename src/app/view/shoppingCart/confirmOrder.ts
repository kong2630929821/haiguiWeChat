import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { order } from '../../net/pull';
import { CartGoods, getStore } from '../../store/memstore';
import { calcFreight, getImageThumbnailPath, popNewMessage, priceFormat } from '../../utils/tools';
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
        this.props = {
            ...props,
            getImageThumbnailPath,
            priceFormat,
            orderGoodsShow,
            address:getStore('mall/addresses')[0]
        };
        const ret = this.calcAllFees(orderGoodsShow);
        this.props = {
            ...this.props,
            ...ret
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
        totalFreight += calcFreight(this.props.address.provinceId) * frieghts.length;

        return {
            totalSale,
            totalTax,
            totalFreight,
            suppliers
        };

    }

    // 添加地址
    public addAddress() {
        popNew('app-view-mine-editAddress');
    }
    // 结算下单
    public async orderClick() {
        const allPromise = [];
        for (const [k,v] of this.props.suppliers) {
            console.log(k,v);
            const no_list = [];
            for (const g of v) {
                no_list.push(g.index);
            }
            const promise = order(no_list,this.props.address.id);
            allPromise.push(promise);
        }
        try {
            const res = await Promise.all(allPromise);
        } catch (res) {
            if (res.result === 2124) {
                popNewMessage('库存不足');
            }
        }
    }
}