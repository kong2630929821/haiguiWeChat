import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { cancelOrder, getOrders, payMoney } from '../../net/pull';
import { getStore, Order, OrderStatus, register } from '../../store/memstore';
import { popNewLoading, popNewMessage } from '../../utils/tools';
import { noResponse, orderPay, setPayLoading, setPayOids } from '../shoppingCart/confirmOrder';

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
            }
        });
    }

    // 点击按钮
    public async btnClick(e:any,index:number) {
        const btn = e.btn;
        const order = this.state.orders.get(this.props.activeStatus)[index];
        if (btn === 1) {  // 确定按钮
            if (this.props.activeStatus === OrderStatus.PENDINGPAYMENT) {   // 去付款
                const oids = [order.id];
                const cash = getStore('balance').cash * 100;  // 余额 
                const totalFee = order.origin + order.tax + order.freight;
                const loading = popNewLoading('支付中');
                if (totalFee > cash) {
                    setPayOids(oids); // 存储即将付款的订单id
                    setPayLoading(loading);
                    noResponse();
                    payMoney(totalFee - cash,'105',1);
                } else {
                    await orderPay(oids);
                    popNewMessage('支付成功');
                    loading.callback(loading.widget);
                    this.paySuccess();
                }
            }
        } else {  // 取消按钮
            if (this.props.activeStatus === OrderStatus.PENDINGPAYMENT) { // 取消订单
                cancelOrder(order.id).then(() => {
                    popNewMessage('取消成功');
                    getOrders(this.props.activeStatus);
                }).catch(() => {
                    popNewMessage('取消失败');
                });
            }

        }

        console.log(e.btn, index);
    }

    public paySuccess() {
        getOrders(OrderStatus.PENDINGDELIVERED);
        this.props.activeStatus = OrderStatus.PENDINGDELIVERED;
        this.paint();
    }
}

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