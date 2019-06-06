import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { freeMaskGoodsId, OffClassGoodsId } from '../../config';
import { cancelOrder, getOrders, payMoney, receiptOrder } from '../../net/pull';
import { getStore, Order, OrderStatus, register } from '../../store/memstore';
import { popNewLoading, popNewMessage, priceFormat } from '../../utils/tools';
import { clearNoResponse, closeLoading, noResponse, orderPay, setGoodsId, setPayLoading, setPayOids } from '../shoppingCart/confirmOrder';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    allStaus:any[];   // 订单的所有状态
    activeStatus:OrderStatus;    // 当前查询的订单状态
}
/**
 * 订单列表
 */
export class OrderList extends Widget {
    public create() {
        super.create();
        this.state = STATE;
    }
    public setProps(props:Props) {
        this.props = {
            ...props
        };
        console.log('OrderList =======',this.props);
        super.setProps(this.props);
        getOrders(props.activeStatus);
    }
    
    // 切换订单类型
    public typeClick(status:OrderStatus) {
        getOrders(status);
        this.props.activeStatus = status;
        this.paint();
    }

    // 点击订单
    public itemClick(index:number) {
        const status = this.props.activeStatus;
        const props = {
            order:this.state.orders.get(status)[index],
            status
        };
        popNew('app-view-mine-orderDetail',{ ...props },(status:OrderStatus) => {
            if (status === OrderStatus.PENDINGDELIVERED) {
                this.paySuccess();
            } else if (status === OrderStatus.PENDINGRECEIPT) {
                this.typeClick(OrderStatus.PENDINGFINISH);
            }
        });
    }

    // 点击按钮
    public async btnClick(e:any,index:number) {
        const btn = e.btn;
        const order = this.state.orders.get(this.props.activeStatus)[index];
        const activeStatus = this.props.activeStatus;
        if (btn === 1) {  // 确定按钮
            if (activeStatus === OrderStatus.PENDINGPAYMENT) {   // 待付款 去付款
                payOrderNow(order,this.paySuccess.bind(this));  // 去付款
            } else if (activeStatus === OrderStatus.PENDINGRECEIPT) {  // 待收货  确认收货
                popNew('app-components-popModel-popModel',{ title:'是否确认收货' },() => {
                    receiptOrder(order.id).then(() => {
                        this.typeClick(OrderStatus.PENDINGFINISH);
                        getOrders(OrderStatus.PENDINGRECEIPT);
                    }).catch(err => {
                        popNewMessage('出错了');
                    });
                });
               
            }
        } else {  // 取消按钮
            if (activeStatus === OrderStatus.PENDINGPAYMENT) { // 待付款  取消订单
                cancelOrder(order.id).then(() => {
                    popNewMessage('取消成功');
                    getOrders(activeStatus);
                }).catch(() => {
                    popNewMessage('取消失败');
                });
            } else if (activeStatus === OrderStatus.PENDINGRECEIPT) {  // 待收货  查看物流
                popNew('app-view-mine-freight',{ order: order });
            }
        }

        console.log(e.btn, index);
    }

    public paySuccess() {
        getOrders(OrderStatus.PENDINGPAYMENT);
        getOrders(OrderStatus.PENDINGDELIVERED);
        this.props.activeStatus = OrderStatus.PENDINGDELIVERED;
        this.paint();
    }
}

// 去付款
export const payOrderNow = async (order:Order,success:Function) => {
    const oids = [order.id];
    const cash = getStore('balance').cash;  // 余额 
    const totalFee = order.origin + order.tax + order.freight;
    const loading = popNewLoading('支付中');
    const goodsid = order.orderGoods[0][0].id;
    try {
        if (totalFee > cash) {
            console.log('余额不足 充值');
            setPayOids(oids); // 存储即将付款的订单id
            setGoodsId(goodsid); // 存储即将付款的商品id
            setPayLoading(loading);
            noResponse();
            payMoney(totalFee - cash,'105',1,['pay_order',oids],() => {
                popNewMessage('支付失败');
                clearNoResponse();
                closeLoading();
            });
        } else {
            popNew('app-view-member-confirmPayInfo',{ money:priceFormat(totalFee) },async () => {
                try {
                    await orderPay(oids);
                    popNewMessage('支付成功');
                    loading.callback(loading.widget);
                    success && success(); 
                    // alert(goodsid);
                    if (goodsid === freeMaskGoodsId || goodsid === OffClassGoodsId) {
                        popNew('app-view-member-turntable');  // 打开大转盘
                    }
                } catch (err) {
                    loading.callback(loading.widget);
                    if (err.type === 2132) {
                        popNewMessage('该商品已领过');
                        cancelOrder(order.id).then(() => {
                            getOrders(OrderStatus.PENDINGPAYMENT);
                        });
                    } else {
                        popNewMessage('支付失败');
                    }
                }
               
            },() => {
                loading.callback(loading.widget);
            });
        }
    } catch (e) {
        console.log('payOrderNow err',e);
        loading.callback(loading.widget);
        popNewMessage('支付失败');
    }
};

const STATE = {
    orders:new Map<OrderStatus,Order[]>()
};

register('mall/orders',(orders:Map<OrderStatus,Order[]>) => {
    STATE.orders = orders;
    forelet.paint(STATE);
});

register('flags/mallRecharge',async () => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.paySuccess();
});