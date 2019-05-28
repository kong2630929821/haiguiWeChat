import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { order, orderNow, payMoney, payOrder } from '../../net/pull';
import { CartGoods, getStore, OrderStatus, register } from '../../store/memstore';
import { getLastAddress } from '../../utils/logic';
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
        const addr = getLastAddress();
        this.props = {
            ...props,
            getImageThumbnailPath,
            priceFormat,
            orderGoodsShow,
            address:addr[2]
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
        popNew('app-view-mine-addressList',{ isChoose:true },() => {
            const addr = getLastAddress();
            this.props.address = addr[2];
            const ret = this.calcAllFees(this.props.orderGoodsShow);
            this.props.totalFreight = ret.totalFreight;
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
                totalTax += v.cartGood.goods.tax * v.cartGood.amount;
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
            const addr = getLastAddress();
            this.props.address = addr[2];
            const ret = this.calcAllFees(this.props.orderGoodsShow);
            this.props.totalFreight = ret.totalFreight;
            this.paint();
        });
    }
    // 结算下单
    public async orderClick() {
        if (!this.props.address) {
            popNewMessage('请填写收货地址');

            return;
        }
        if (!getStore('user/fcode')) {
            popNew('app-view-member-applyModalBox',{ needSelGift:false,title:'请填写个人信息' },() => {
                this.order();
            });

            return;
        } 
        const cartGood = this.props.orderGoods; 
        let hasTax = false;  // 是否有保税商品
        for (let i = 0;i < cartGood.length;i++) {
            const goods = cartGood[i].goods;
            if (goods.has_tax) {
                hasTax = true;
                break;
            }
        }
        if (hasTax && !getStore('user/IDCard')) {
            popNew('app-components-popModel-popModel',{ title:'海外购商品必须实名' },() => {
                popNew('app-view-mine-IDCardUpload');
            });

            return;
        } 
           
        this.order();
        
    }

    public async order() {
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
        let ordersRes;
        try {
            ordersRes = await Promise.all(allOrderPromise);
            console.log('ordersRes ====',ordersRes);
        } catch (res) {
            loading.callback(loading.widget);
            if (res.result === 2124) {
                popNewMessage('库存不足');
            } else if (res.result === 2127) {
                popNewMessage('购买免税商品超出限制');
            } else {
                popNewMessage('下单失败');
            }
            console.log('错误 ',res);

            return;
        }
        try {
           
            const oids = [];
            for (const res of ordersRes) {
                const oid = res.orderInfo[0];
                oids.push(oid);
                console.log('oid ====',oid);
            }
            const totalFee = this.props.totalSale + this.props.totalFreight + this.props.totalTax;
            const cash = getStore('balance').cash;  // 余额
            console.log('cash ========',cash);
            if (totalFee > cash) {
                payOids = oids;// 存储即将付款的订单id
                payLoading = loading;
                noResponse(() => {
                    popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGPAYMENT,allStaus:allOrderStatus.slice(0,4) });
                });
                payMoney(totalFee - cash,'105',1,() => {
                    popNewMessage('支付失败');
                    clearNoResponse();
                    closeLoading();
                    popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGPAYMENT,allStaus:allOrderStatus.slice(0,4) });
                });
            } else {
                popNew('app-view-member-confirmPayInfo',{ money:priceFormat(totalFee) },async () => {
                    await orderPay(oids);
                    this.ok && this.ok();
                    popNewMessage('支付成功');
                    loading.callback(loading.widget);
                    popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGDELIVERED,allStaus:allOrderStatus.slice(0,4) });
                    
                },() => {
                    loading.callback(loading.widget);
                });
            }
        } catch (res) {
            loading.callback(loading.widget);
            if (res.result === 2124) {
                popNewMessage('库存不足');
            } else if (res.result === 2127) {
                popNewMessage('购买免税商品超出限制');
            } else {
                popNewMessage('支付失败');
            }
            console.log('错误 ',res);
        }
    }

    public paySuccess() {
        this.ok && this.ok();
        popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGDELIVERED,allStaus:allOrderStatus.slice(0,4) });
    }
}

export const setPayLoading = (loading:any) => {
    payLoading = loading;
};

export const closeLoading = () => {
    payLoading && payLoading.callback(payLoading.widget);
    payLoading = undefined;
};
export const setPayOids = (oids:number[]) => {
    payOids = oids;
};

// 15秒没有收到充值成功的消息  认为失败
export const noResponse = (cb?:Function) => {
    timer = setTimeout(() => {
        closeLoading();
        cb && cb();
    },12 * 1000);
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
        await orderPay(payOids);
        popNewMessage('支付成功');
        w && w.paySuccess();
        closeLoading();
        payOids = undefined;
    } catch (e) {
        console.log('充值成功之后 支付失败',e);
        popNewMessage('支付失败');
        payLoading.callback(payLoading.widget);
        payLoading = undefined;
        payOids = undefined;
    }
});
