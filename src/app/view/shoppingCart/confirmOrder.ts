import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { freeMaskGoodsId, mallImagPre, OffClassGoodsId } from '../../config';
import { getCart, order, orderNow, payMoney, payOrder } from '../../net/pull';
import { Address, CartGoods, getStore, OrderStatus, register, setStore } from '../../store/memstore';
import { getLastAddress } from '../../utils/logic';
import { calcFreight, popNewLoading, popNewMessage, priceFormat } from '../../utils/tools';
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
        const address = addr[2];
        const ret = plitOrder(orderGoodsShow,address);
        console.log('plitOrder =',ret);
        
        this.props = {
            ...props,
            priceFormat,
            orderGoodsShow,
            address,
            mallImagPre,
            ...ret
        };
        super.setProps(this.props,oldProps);
        console.log('ConfirmOrder ======',this.props);
    }

    public selectAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true },() => {
            const addr = getLastAddress();
            this.props.address = addr[2];
            const ret = plitOrder(this.props.orderGoodsShow,this.props.address);
            this.props.splitOrders = ret.splitOrders;
            this.props.totalFreight = ret.totalFreight;
            this.props.totalSale = ret.totalSale;
            this.props.totalTax = ret.totalTax;
            this.paint();
        });
    }

    // 添加地址
    public addAddress() {
        popNew('app-view-mine-editAddress',undefined,() => {
            const addr = getLastAddress();
            this.props.address = addr[2];
            const ret = plitOrder(this.props.orderGoodsShow,this.props.address);
            this.props.splitOrders = ret.splitOrders;
            this.props.totalFreight = ret.totalFreight;
            this.props.totalSale = ret.totalSale;
            this.props.totalTax = ret.totalTax;

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
                this.orderClick();
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
        // if (hasTax && !getStore('user/IDCard')) {
        //     popNew('app-components-popModel-popModel',{ title:'海外购商品必须实名' },() => {
        //         popNew('app-view-mine-IDCardUpload');
        //     });

        //     return;
        // } 
           
        this.order();
        
    }

    public async order() {
        const allOrderPromise = [];
        const loading = popNewLoading('提交订单');
        if (this.props.buyNow) {    // 立即购买
            const cartGood = this.props.orderGoods[0];
            const promise = orderNow([cartGood.goods.id,cartGood.amount,cartGood.goods.labels[0][0]],this.props.address.id);
            allOrderPromise.push(promise);
        } else {
            for (const splitOrder of this.props.splitOrders) {
                const no_list = [];
                for (const goodShow of splitOrder.order) {
                    no_list.push(goodShow.cartGood.index);
                }
                const promise = order(no_list,this.props.address.id);
                allOrderPromise.push(promise);
            }
        }
        
        let ordersRes;
        try {
            ordersRes = await Promise.all(allOrderPromise);
            getCart();    // 下单成功后刷新购物车
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
                noResponse(this.payFaile.bind(this));
                payMoney(totalFee - cash,'105',1,() => {
                    popNewMessage('支付失败');
                    clearNoResponse();
                    closeLoading();
                    this.payFaile();
                });
            } else {
                popNew('app-view-member-confirmPayInfo',{ money:priceFormat(totalFee) },async () => {
                    await orderPay(oids);
                    this.ok && this.ok();
                    popNewMessage('支付成功');
                    loading.callback(loading.widget);
                    popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGDELIVERED,allStaus:allOrderStatus.slice(0,4) });
                    
                },() => {   // 取消支付
                    this.payFaile();
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

    // 支付失败
    public payFaile() {
        setStore('flags/gotoMine',true);
        popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGPAYMENT,allStaus:allOrderStatus.slice(0,4) });
        this.ok && this.ok();
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

export const setGoodsId = (goodsId:number) => {  
    if (goodsId === freeMaskGoodsId || goodsId === OffClassGoodsId) {
        turntable = true;
    }
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
let turntable;
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

// 拆分订单
export interface SplitOrder {
    order:CartGoodsShow[];     // 订单包含的商品
    saleFee:number;            // 所有商品总售价
    taxFee:number;             // 所有商品总税费
    freightFee:number;         // 所有商品总运费
}
// 拆分订单
const plitOrder = (orderGoods:CartGoodsShow[],address:Address) => {
    const suppliers = new Map();    // 购买同一供应商的所有商品 保税商品和普通商品分离
    for (const v of orderGoods) {
        const supplierId = v.cartGood.goods.supplier;
        let oneSupplier = suppliers.get(supplierId);
        if (!oneSupplier) oneSupplier = [];
        if (v.cartGood.goods.has_tax) {     // 保税商品只有税费没有运费
            const taxGoods = oneSupplier[0] || [];
            taxGoods.push(v);
            oneSupplier[0] = taxGoods;
        } else {
            const noTaxGoods = oneSupplier[1] || [];
            noTaxGoods.push(v);
            oneSupplier[1] = noTaxGoods;
        }
        suppliers.set(supplierId,oneSupplier);
    }

    const splitOrders:SplitOrder[] = [];
    for (const [k,v] of suppliers) {
        if (v[0]) {
            let totalTax = 0;
            let totalTaxSale = 0;
            for (const cartGoodShow of v[0]) {   // 保税商品
                totalTax += cartGoodShow.cartGood.goods.tax * cartGoodShow.cartGood.amount;
                totalTaxSale += cartGoodShow.finalSale * cartGoodShow.cartGood.amount;
            }
            const splitOrder1:SplitOrder = {     // 保税商品运费0
                order:v[0],
                saleFee:totalTaxSale,
                taxFee:totalTax,
                freightFee:0
            };
            splitOrders.push(splitOrder1);
        }
        if (v[1]) {
            let totalNoTaxSale = 0;
            for (const cartGoodShow of v[1]) {   // 普通商品
                totalNoTaxSale += cartGoodShow.finalSale * cartGoodShow.cartGood.amount;
            }
            const splitOrder2:SplitOrder = {     // 普通商品税费0
                order:v[1],
                saleFee:totalNoTaxSale,
                taxFee:0,
                freightFee:calcFreight(address && address.area_id)
            };
            splitOrders.push(splitOrder2);
        }
        
    }
    
    const ret = calcAllFees(splitOrders);

    return {
        splitOrders,
        ...ret
    };
};

// 计算商品费用 包括商品总费用 运费总计  税费总计
const calcAllFees = (splitOrder:SplitOrder[]) => {
    let totalSale = 0;
    let totalTax = 0;    // 税费总计
    let totalFreight = 0;           // 运费总计
    for (const v of splitOrder) {
        totalSale += v.saleFee;
        totalTax += v.taxFee;
        totalFreight += v.freightFee;
    }
    
    return {
        totalSale,
        totalTax,
        totalFreight
    };
};

register('flags/mallRecharge',async () => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    clearNoResponse();
    try {
        await orderPay(payOids);
        popNewMessage('支付成功');
        w && w.paySuccess();
        if (turntable) {
            popNew('app-view-member-turntable');  // 打开大转盘
            turntable = false;
        }
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
