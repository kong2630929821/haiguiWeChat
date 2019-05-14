import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getOrders, order } from '../../net/pull';
import { getStore, Order, OrderStatus, register } from '../../store/memstore';

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
        const props = {
            order:this.props.curShowOrders[index],
            status:this.props.activeStatus
        };
        popNew('app-view-mine-freight',{ ...props });
    }

    // 点击按钮
    public btnClick(e:any,num:number) {
        console.log(e.value, num);
    }
}

const STATE = {
    orders:new Map<OrderStatus,Order[]>()
};
register('mall/orders',(orders:Map<OrderStatus,Order[]>) => {
    STATE.orders = orders;
    forelet.paint(STATE);
});