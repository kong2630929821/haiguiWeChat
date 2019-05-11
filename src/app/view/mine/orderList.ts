import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getStore } from '../../store/memstore';
import { OrderType } from './orderItem';

/**
 * 订单列表
 */
export class OrderList extends Widget {
    public props:any = {
        orderType:[
            { name:'待付款',img:'wallet.png' },
            { name:'待发货',img:'goods.png' },
            { name:'待收货',img:'truck.png' },
            { name:'已完成',img:'order.png' },
            { name:'退货',img:'return.png' }
        ],
        list:[1,2],
        active: OrderType.pay
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        const orders = getStore('mall/orders');
        console.log('OrderList =======',orders);
        super.setProps(this.props);
    }

    // 切换订单类型
    public typeClick(num:number) {
        this.props.active = num;
        this.paint();
    }

    // 点击订单
    public itemClick(num:number) {
        popNew('app-view-mine-freight',{ num:num });
    }

    // 点击按钮
    public btnClick(e:any,num:number) {
        console.log(e.value, num);
    }
}