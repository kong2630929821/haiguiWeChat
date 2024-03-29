import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { mallImagPre } from '../../config';
import { Order, OrderStatus } from '../../store/memstore';
import { calcPrices, getImageThumbnailPath, priceFormat } from '../../utils/tools';
import { statusShows } from './orderDetail';
import { calcLeftTime } from './orderItem';

export interface Props {
    order:Order;  // 订单
    status:OrderStatus;        // 订单状态
}
/**
 * 订单
 */
export class OrderItemDetail extends Widget {
    public timer:number;

    public setProps(props:any) {
        clearTimeout(this.timer);
        let orderIdShow = `订单号:${props.order.id}`;
        if (props.status === OrderStatus.PENDINGPAYMENT) {
            orderIdShow = `倒计时：${calcLeftTime(props.order.order_time)}`;
            this.countdown();
        }
        if (props.status === OrderStatus.PENDINGDELIVERED && (Date.now() - props.order.pay_time) < 60 * 60 * 1000) {  // 下单一小时以内可以取消订单
            statusShows[props.status].btn1 = '取消订单';
        }
        this.props = {
            ...props,
            statusShow:statusShows[props.status],
            orderIdShow,
            getImageThumbnailPath,
            priceFormat,
            calcPrices,
            mallImagPre
        };
        super.setProps(this.props);
        // console.log('orderdetailitem ====',this.props);
    }

    public btnClick(e:any,num:number) {
        notify(e.node,'ev-btn-click',{ btn: num,status:this.props.status });
    }

    public itemClick(e:any) {
        notify(e.node,'ev-item-click',null);
    }

    public countdown() {
        this.timer = setTimeout(() => {
            this.countdown();
            this.props.orderIdShow = `倒计时：${calcLeftTime(this.props.order.order_time)}`;
            this.paint();
        },1000);
    }

    public destroy() {
        clearTimeout(this.timer);

        return super.destroy();
    }
}
