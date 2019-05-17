import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { PendingPaymentDuration } from '../../config';
import { getOrders } from '../../net/pull';
import { Order, OrderStatus } from '../../store/memstore';
import { calcPrices, getImageThumbnailPath, priceFormat } from '../../utils/tools';
import { statusShows } from './orderDetail';

export interface Props {
    order:Order;  // 订单
    status:OrderStatus;        // 订单状态
}
/**
 * 订单
 */
export class OrderItem extends Widget {
    public timer:number;
    public setProps(props:any) {
        clearTimeout(this.timer);
        let orderIdShow = `订单号:${props.order.id}`;
        if (props.status === OrderStatus.PENDINGPAYMENT) {
            orderIdShow = `倒计时：${calcLeftTime(props.order.order_time)}`;
            this.countdown();
        }
        this.props = {
            ...props,
            statusShow:statusShows[props.status],
            orderIdShow,
            getImageThumbnailPath,
            priceFormat,
            calcPrices
        };
        super.setProps(this.props);
        console.log('orderdetailitem ====',this.props);
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

// 计算倒计时
export const calcLeftTime = (start:number) => {
    const leftTime = start + PendingPaymentDuration - new Date().getTime();
    if (leftTime < 0) {
        getOrders(OrderStatus.PENDINGPAYMENT);

        return `0分0秒`;
    }
    const leftMinutes = Math.floor(leftTime / 1000 / 60);
    const leftSeconds = Math.floor(leftTime / 1000) % 60;

    return `${leftMinutes}分${leftSeconds}秒`;
};