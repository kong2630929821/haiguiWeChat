import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getOrders } from '../../net/pull';
import { getStore, OrderStatus } from '../../store/memstore';

interface Props {
    allStaus:any[];   // 订单的所有状态
    activeStatus:OrderStatus;    // 当前查询的订单状态
}
/**
 * 订单列表
 */
export class OrderList extends Widget {
    public setProps(props:Props) {
        const orders = getStore('mall/orders');
        const curShowOrders = orders.get(props.activeStatus) || [];
        this.props = {
            ...props,
            curShowOrders
        };
        
        console.log('OrderList =======',this.props);
        super.setProps(this.props);
        getOrders(OrderStatus.PENDINGPAYMENT);
    }

    // 切换订单类型
    public typeClick(status:OrderStatus) {
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