import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { cancelOrder, cancelPaidOrder, getOrders, receiptOrder } from '../../net/pull';
import { Order, OrderStatus, register } from '../../store/memstore';
import { addressFormat, popNewMessage } from '../../utils/tools';
import { payOrderNow } from './orderList';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    order:Order; 
    status:OrderStatus;
}
/**
 * 订单详情
 */
export class OrderDetail extends Widget {
    public ok:(status:OrderStatus) => void;
    public setProps(props:Props) {
        if (props.status === OrderStatus.PENDINGDELIVERED && (Date.now() - props.order.pay_time) < 60 * 60 * 1000) {  // 下单一小时以内可以取消订单
            statusShows[props.status].btn1 = '取消订单';
        }
        this.props = {
            ...props,
            statusShow:statusShows[props.status],
            addressFormat
        };
        super.setProps(this.props);
        console.log('OrderDetail ======',this.props);
    }

    public async btnClick(e:any,num:number) {
        const order = this.props.order;
        const activeStatus = this.props.status;
        if (num === 1) {  // 确认按钮
            if (activeStatus === OrderStatus.PENDINGPAYMENT) {  // 待付款 去付款
                payOrderNow(order); 

            } else if (activeStatus === OrderStatus.PENDINGRECEIPT) {  // 待收货  确认收货
                popNew('app-components-popModel-popModel',{ title:'是否确认收货' },() => {
                    receiptOrder(order.id).then(() => {
                        getOrders(activeStatus);
                        this.ok && this.ok(activeStatus);
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
                    this.ok && this.ok(activeStatus);
                }).catch(() => {
                    popNewMessage('取消失败');
                });
            } else if (activeStatus === OrderStatus.PENDINGDELIVERED) {  // 待发货 取消订单
                popNew('app-components-popModel-popModel',{ title:'确认取消订单' },() => {
                    cancelPaidOrder(order.id).then(() => {
                        popNewMessage('取消成功');
                        getOrders(activeStatus);
                        this.ok && this.ok(activeStatus);
                    }).catch((e:any) => {
                        if (e.type === 2136) {
                            popNewMessage('特殊商品无法退款');
                        } else {
                            popNewMessage('取消失败');
                        }
                    });
                });

            } else if (activeStatus === OrderStatus.PENDINGRECEIPT) {  // 待收货  查看物流
                popNew('app-view-mine-freight',{ order: order });
            }

        }
    }

    public paySuccess() {
        this.ok && this.ok(OrderStatus.PENDINGDELIVERED);
    }
        
}

// 支付成功
register('flags/payOrder',(succeed) => {
    console.log('flags/payOrder',succeed);
    if (!succeed) return;
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.paySuccess();
});

export const statusShows:any = {
    [OrderStatus.PENDINGPAYMENT]:{
        desc:'等待买家付款',
        btn1:'取消订单',
        btn2:'去付款'
    },
    [OrderStatus.PENDINGDELIVERED]:{
        desc:'等待发货',
        btn1:'',
        btn2:''
    },
    [OrderStatus.PENDINGRECEIPT]:{
        desc:'商品已发货',
        btn1:'查看物流',
        btn2:'确认收货'
    },
    [OrderStatus.PENDINGFINISH]:{
        desc:'',
        btn1:'',
        btn2:''
    }
};