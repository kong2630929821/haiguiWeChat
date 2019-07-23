import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { freeMaskGoodsId, mallImagPre, OffClassGoodsId, onlyWXPay } from '../../config';
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
    totalAmount:number;  // 商品总数量
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
        
        this.props = {
            ...props,
            priceFormat,
            orderGoodsShow,
            address,
            mallImagPre,
            splitOrders:[],
            totalSale:0,
            totalTax:0,
            totalFreight:0
        };
        super.setProps(this.props,oldProps);
        plitOrder(orderGoodsShow,address).then(ret => {
            this.props = {
                ...this.props,
                ...ret
            };
            this.paint();
            console.log('plitOrder =',ret);
        });
        console.log('ConfirmOrder ======',this.props);
    }

    public selectAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true },(num) => {
            const address = getStore('mall/addresses');
            this.props.address = address[num];
            this.paint();

            plitOrder(this.props.orderGoodsShow,this.props.address).then(ret => {
                this.props.splitOrders = ret.splitOrders;
                this.props.totalFreight = ret.totalFreight;
                this.props.totalSale = ret.totalSale;
                this.props.totalTax = ret.totalTax;
                this.paint();
            });
            
        });
    }

    // 添加地址
    public addAddress() {
        popNew('app-view-mine-editAddress',undefined,() => {
            const addr = getLastAddress();
            this.props.address = addr[2];
            plitOrder(this.props.orderGoodsShow,this.props.address).then(ret => {
                this.props.splitOrders = ret.splitOrders;
                this.props.totalFreight = ret.totalFreight;
                this.props.totalSale = ret.totalSale;
                this.props.totalTax = ret.totalTax;
                this.paint();
            });
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
        let hasTax = false;  // 是否有海外购商品，需要实名
        for (let i = 0;i < cartGood.length;i++) {
            const goods = cartGood[i].goods;
            if (goods.goodsType > 0) {
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
        if (this.props.buyNow) {    // 立即购买
            const cartGood = this.props.orderGoods[0];
            const promise = orderNow([cartGood.goods.id,cartGood.amount,cartGood.goods.labels[cartGood.skuIndex][0]],this.props.address.id);
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
            loading.callback(loading.widget);
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

        const oids = [];
        let totalFee = 0;
        for (const res of ordersRes) {
            const oid = res.orderInfo[0];
            oids.push(oid);
            totalFee +=  res.orderInfo[3] + res.orderInfo[4] + res.orderInfo[5] + res.orderInfo[6];   // 商品原支付金额  商品税费  商品运费  其它费用
            console.log('oid ====',oid);
        }
        // const totalFee = this.props.totalSale + this.props.totalFreight + this.props.totalTax;
        try {
            if (onlyWXPay) {
                // 微信支付（正式服）
                setNeedPayOrders(oids);
                payMoney(totalFee,'105',1,['pay_order',oids],() => {
                    console.log('payMoney --------------failed');
                    popNewMessage('支付失败');
                    this.payFaile();
                });
                
            } else {
                // 用余额支付 (自测使用)
                const cash = getStore('balance/cash',0);
                if (cash > totalFee) {
                    payOrder(oids[0]).then(r => {
                        popNewMessage('支付成功');
                        this.paySuccess();
                    });
                } else {
                    setNeedPayOrders(oids);
                    payMoney(totalFee - cash,'105',1,['pay_order',oids],() => {
                        console.log('payMoney --------------failed');
                        popNewMessage('支付失败');
                        this.payFaile();
                    });
                }
            }
            
        } catch (res) {
            if (res.result === 2127) {
                popNewMessage('购买免税商品超出限制');
            } else {
                popNewMessage('支付失败');
            }
            console.log('错误 ',res);
        }
    }

    public paySuccess() {
        this.ok && this.ok();
        console.log('paySuccess OrderStatus.PENDINGDELIVERED');
        popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGDELIVERED,allStaus:allOrderStatus.slice(0,4) });
    }

    // 支付失败
    public payFaile() {
        setStore('flags/gotoMine',true);
        console.log('payFaile OrderStatus.PENDINGPAYMENT');
        popNew('app-view-mine-orderList',{ activeStatus: OrderStatus.PENDINGPAYMENT,allStaus:allOrderStatus.slice(0,4) });
        this.ok && this.ok();
    }
}

export const setGoodsId = (goodsId:number) => {  
    if (goodsId === freeMaskGoodsId || goodsId === OffClassGoodsId) {
        turntable = true;
    }
};

// 拆分订单
export interface SplitOrder {
    order:CartGoodsShow[];     // 订单包含的商品
    saleFee:number;            // 所有商品总售价
    taxFee:number;             // 所有商品总税费
    freightFee:number;         // 所有商品总运费
}
// 拆分订单
const plitOrder = async (orderGoods:CartGoodsShow[],address:Address) => {
    const suppliers = new Map();    // 购买同一供应商的所有商品 保税商品/普通商品/海外直购分离
    for (const v of orderGoods) {
        const supplierId = v.cartGood.goods.supplier;
        let oneSupplier = suppliers.get(supplierId);
        if (!oneSupplier) oneSupplier = [];
        // 商品类型 0 普通商品 1 保税商品 2 海外直购
        if (v.cartGood.goods.goodsType === 0) { // 普通商品
            const normalGoods = oneSupplier[1] || [];
            normalGoods.push(v);
            oneSupplier[0] = normalGoods;
        } else if (v.cartGood.goods.goodsType === 1) { // 保税商品
            const taxGoods = oneSupplier[0] || [];
            taxGoods.push(v);
            oneSupplier[1] = taxGoods;
        } else {  // 海外直购
            const overseaGoods = oneSupplier[2] || [];
            overseaGoods.push(v);
            oneSupplier[2] = overseaGoods;
        }
        suppliers.set(supplierId,oneSupplier);
    }

    const splitOrders:SplitOrder[] = [];
    for (const [k,v] of suppliers) {
       
        if (v[0]) {// 普通商品
            let totalNoTaxSale = 0;
            for (const cartGoodShow of v[0]) {   // 普通商品
                totalNoTaxSale += cartGoodShow.finalSale * cartGoodShow.cartGood.amount;
            }
            const freightFee = await calcFreight(address && address.area_id, k, 0);
            const splitOrder:SplitOrder = {     // 普通商品税费0
                order:v[0],
                saleFee:totalNoTaxSale,
                taxFee:0,
                freightFee
            };
            splitOrders.push(splitOrder);
        }

        if (v[1]) { // 保税商品
            let totalTax = 0;
            let totalTaxSale = 0;
            for (const cartGoodShow of v[1]) {   // 保税商品
                totalTax += cartGoodShow.cartGood.goods.tax * cartGoodShow.cartGood.amount;
                totalTaxSale += cartGoodShow.finalSale * cartGoodShow.cartGood.amount;
            }
            const freightFee = await calcFreight(address && address.area_id, k, 1);
            const splitOrder:SplitOrder = {     // 保税商品运费0
                order:v[1],
                saleFee:totalTaxSale,
                taxFee:totalTax,
                freightFee
            };
            splitOrders.push(splitOrder);
        }

        if (v[2]) {  // 海外直购
            let totalTax = 0;
            let totalTaxSale = 0;
            for (const cartGoodShow of v[2]) {   // 海外直购
                totalTax += cartGoodShow.cartGood.goods.tax * cartGoodShow.cartGood.amount;
                totalTaxSale += cartGoodShow.finalSale * cartGoodShow.cartGood.amount;
            }
            const freightFee = await calcFreight(address && address.area_id, k, 2);
            const splitOrder:SplitOrder = {     // 海外直购运费税费都有
                order:v[2],
                saleFee:totalTaxSale,
                taxFee:totalTax,
                freightFee
            };
            splitOrders.push(splitOrder);
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

let turntable;

// 需要支付的订单id列表   用来判断多订单支付是否全部响应成功
let needPayOrders:number[] = [];

// set
export const setNeedPayOrders = (orders:number[]) => {
    needPayOrders = orders;
};

// get
export const getNeedPayOrders = () => {
    return needPayOrders;
};

// 删除已处理订单
export const delOrder = (orderId:number) => {
    return needPayOrders = needPayOrders.filter((orderid:number) => {
        return orderid !== orderId;
    });
};
// 购买成功
register('flags/payOrder',(successed:boolean) => {
    console.log('flags/payOrder',successed);
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (successed) {
        popNewMessage('支付成功');
        w && w.paySuccess();
        if (turntable) {
            popNew('app-view-member-turntable');  // 打开大转盘
            turntable = false;
        }
    } else {   // 购买失败
        console.log('购买失败');
        w && w.payFaile();
    }
    
});
