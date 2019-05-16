import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { order, orderNow, payMoney, payOrder } from '../../net/pull';
import { CartGoods, getStore, OrderStatus, register } from '../../store/memstore';
import { calcFreight, getImageThumbnailPath, popNewLoading, popNewMessage, priceFormat } from '../../utils/tools';
import { allOrderStatus } from '../mine/home/home';
import { calcCartGoodsShow, CartGoodsShow } from './home/home';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    orderGoods:CartGoods[];
    buyNow:boolean;    // 立即购买
}
/**
 * 确认订单
 */
export class ConfirmOrder extends Widget {
    public ok:() => void;
    public loading:any;
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
            let promise;
            if (this.props.buyNow) {
                const cartGood = this.props.orderGoods[0];
                promise = orderNow([cartGood.goods.id,cartGood.amount,cartGood.goods.labels[0][0]],this.props.address.id);
            } else {
                promise = order(no_list,this.props.address.id);
            }
            
            allOrderPromise.push(promise);
        }
        try {
            const ordersRes = await Promise.all(allOrderPromise);
            console.log('ordersRes ====',ordersRes);
            const oids = [];
            for (const res of ordersRes) {
                const oid = res.orderInfo[0];
                oids.push(oid);
                console.log('oid ====',oid);
            }
            const totalFee = this.props.totalSale + this.props.totalFreight + this.props.totalTax;
            const cash = getStore('balance').cash * 100;  // 余额
            console.log('cash ========',cash);
            if (totalFee > cash) {
                payOids = oids;// 存储即将付款的订单id
                payLoading = loading;
                noResponse();
                payMoney(totalFee - cash,'105',1);
            } else {
                await orderPay(oids);
                popNewMessage('支付成功');
                loading.callback(loading.widget);
                popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGDELIVERED,allStaus:allOrderStatus.slice(0,4) });
                this.ok && this.ok();
            }
        } catch (res) {
            loading.callback(loading.widget);
            if (res.result === 2124) {
                popNewMessage('库存不足');
            } else {
                popNewMessage('支付失败');
            }
        }
    }

    public paySuccess() {
        popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGDELIVERED,allStaus:allOrderStatus.slice(0,4) });
        this.ok && this.ok();
    }
}

export const setPayLoading = (loading:any) => {
    payLoading = loading;
};

const closeLoading = () => {
    payLoading && payLoading.callback(payLoading.widget);
    payLoading = undefined;
};
export const setPayOids = (oids:number[]) => {
    payOids = oids;
};

// 15秒没有收到充值成功的消息  认为失败
export const noResponse = () => {
    timer = setTimeout(() => {
        closeLoading();
        popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGPAYMENT,allStaus:allOrderStatus.slice(0,4) });
    },5 * 1000);
};

export const clearNoResponse = () => {
    clearTimeout(timer);
};
let payLoading;
let payOids;
let timer;
// 支付
export const orderPay = (orderIds:number[]) => {
    if (!orderIds) return;
    const allPayPromise = [];
    for (const id of orderIds) {
        console.log('oid ====',id);
        allPayPromise.push(payOrder(id));
    }

    return Promise.all(allPayPromise);
};

register('flags/mallRecharge',async () => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    clearNoResponse();
    try {
        alert(JSON.stringify(payOids));
        await orderPay(payOids);
        popNewMessage('支付成功');
        w && w.paySuccess();
        closeLoading();
        payOids = undefined;
    } catch (e) {
        popNewMessage('支付失败');
        payLoading.callback(payLoading.widget);
        payLoading = undefined;
        payOids = undefined;
    }
});
