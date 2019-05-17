import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { payMoney } from '../../net/pull';
import { getStore, Order, OrderStatus, register } from '../../store/memstore';
import { popNewLoading, popNewMessage } from '../../utils/tools';
import { noResponse, orderPay, setPayLoading, setPayOids } from '../shoppingCart/confirmOrder';

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
    public statusShows:any = {
        [OrderStatus.PENDINGPAYMENT]:{
            desc:'等待买家付款',
            btn1:'取消订单',
            btn2:'去付款'
        },
        [OrderStatus.PENDINGDELIVERED]:{
            desc:'等待发货',
            btn1:'',
            btn2:'查看物流'
        },
        [OrderStatus.PENDINGRECEIPT]:{
            desc:'商品已发货',
            btn1:'查看物流',
            btn2:'确认收货'
        },
        [OrderStatus.COMPLETED]:{
            desc:'',
            btn1:'',
            btn2:'再来一单'
        }
    };
    public setProps(props:Props) {
        this.props = {
            ...props,
            statusShow:this.statusShows[props.status]
        };
        super.setProps(this.props);
        console.log('OrderDetail ======',this.props);
    }

    public async btnClick(e:any,num:number) {
        if (num === 1) {
            if (this.props.status === OrderStatus.PENDINGPAYMENT) {  // 去支付
                const order = this.props.order;
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