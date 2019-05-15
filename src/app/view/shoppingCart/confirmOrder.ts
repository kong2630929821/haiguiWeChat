import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { order, payMoney, payOrder } from '../../net/pull';
import { CartGoods, getStore } from '../../store/memstore';
import { calcFreight, getImageThumbnailPath, popNewLoading, popNewMessage, priceFormat } from '../../utils/tools';
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
        popNew('app-view-mine-addressList',{ isChoose:true },(index:number) => {
            this.props.address = getStore('mall/addresses')[index];
            this.paint();
        });
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
        if (this.props.address) {
            totalFreight += calcFreight(this.props.address.area_id) * frieghts.length;
        }
        
        return {
            totalSale,
            totalTax,
            totalFreight,
            suppliers
        };

    }

    // 添加地址
    public addAddress() {
        popNew('app-view-mine-editAddress',undefined,() => {
            this.props.address = getStore('mall/addresses')[0];
            this.paint();
        });
    }
    // 结算下单
    public async orderClick() {
        if (!this.props.address) {
            popNewMessage('请填写收货地址');

            return;
        }
        const allOrderPromise = [];
        const loading = popNewLoading('提交订单');
        for (const [k,v] of this.props.suppliers) {
            console.log(k,v);
            const no_list = [];
            for (const g of v) {
                no_list.push(g.index);
            }
            const promise = order(no_list,this.props.address.id);
            allOrderPromise.push(promise);
        }
        try {
            const ordersRes = await Promise.all(allOrderPromise);
            console.log('ordersRes ===',ordersRes);
            const allPayPromise = [];
            for (const res of ordersRes) {
                const oid = res.orderInfo[0];
                console.log('oid ====',oid);
                allPayPromise.push(payOrder(oid));
            }
            const totalFee = this.props.totalSale + this.props.totalFreight + this.props.totalTax;
            payMoney(1,'105',1);
            // const payRes = await Promise.all(allPayPromise);
            // console.log('payRes ====',payRes);
            popNewMessage('交易成功');
        } catch (res) {
            loading.callback(loading.widget);
            if (res.result === 2124) {
                popNewMessage('库存不足');
            } 
        }
    }
}