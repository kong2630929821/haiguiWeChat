import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { cancelOrder, getOrders } from '../../net/pull';
import { Order, OrderStatus, register } from '../../store/memstore';
import { popNewMessage } from '../../utils/tools';
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
        this.props = {
            ...props,
            statusShow:statusShows[props.status]
        };
        super.setProps(this.props);
        console.log('OrderDetail ======',this.props);
    }

    public async btnClick(e:any,num:number) {
        const order = this.props.order;
        const activeStatus = this.props.status;
        if (num === 1) {  // 确认按钮
            if (activeStatus === OrderStatus.PENDINGPAYMENT) {  // 去支付
                payOrderNow(order,this.paySuccess);  // 去付款
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
    }

    public paySuccess() {
        this.ok && this.ok(OrderStatus.PENDINGDELIVERED);
    }
        
}

register('flags/mallRecharge',async () => {
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