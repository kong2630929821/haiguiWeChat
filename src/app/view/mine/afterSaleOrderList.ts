import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getReturnGoods, ReturnGoodsStatus } from '../../net/pull';
import { AfterSale, register } from '../../store/memstore';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    allStaus:any[];   // 订单的所有状态
    activeStatus:ReturnGoodsStatus;    // 当前查询的订单状态
}
/**
 * 订单列表
 */
export class AfterSaleOrderList extends Widget {
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
        getReturnGoods(props.activeStatus);
    }
    
    // 切换订单类型
    public typeClick(status:ReturnGoodsStatus) {
        this.props.activeStatus = status;
        this.paint();
    }

    // 点击按钮
    public async btnClick(e:any,index:number) {
        const btn = e.btn;
        const order = this.state.orders.get(this.props.activeStatus)[index].order;
        const activeStatus = this.props.activeStatus;
        console.log('order=====',order);
        console.log('activeStatus=====',activeStatus);
        if (btn === 1) {  // 确定按钮
           
        } else {  // 取消按钮
            
        }

        console.log(e.btn, index);
    }
}

const STATE = {
    orders:new Map<ReturnGoodsStatus,AfterSale[]>()
};

register('mall/afterSales',(afterSaleOrders:Map<ReturnGoodsStatus,AfterSale[]>) => {
    STATE.orders = afterSaleOrders;
    forelet.paint(STATE);
});
