import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { fillReturnGoodsId, getReturnGoods } from '../../net/pull';
import { AfterSale, register, ReturnGoodsStatus } from '../../store/memstore';
import { popNewMessage } from '../../utils/tools';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    allStaus:any[];   // 订单的所有状态
    activeStatus:ReturnGoodsStatus;    // 当前查询的订单状态
}
/**
 * 退货订单列表
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
        getReturnGoods(status);
        this.props.activeStatus = status;
        this.paint();
    }

    // 点击按钮
    public async btnClick(e:any,index:number) {
        const btn = e.btn;
        const afterOrder = this.state.orders.get(this.props.activeStatus)[index];
        const activeStatus = this.props.activeStatus;
        console.log('order=====',afterOrder);
        console.log('activeStatus=====',activeStatus);
        if (btn === 1) {  // 右侧按钮
            if (activeStatus === ReturnGoodsStatus.CANRETURN) { // 申请退货
                popNew('app-view-returnGoods-applyReturnGoods',{ order:afterOrder.order,returnId:afterOrder.id },() => {
                    getReturnGoods(ReturnGoodsStatus.CANRETURN);
                });
            } else if (activeStatus === ReturnGoodsStatus.RETURNING && !afterOrder.shipId) {  // 填写退货运单号
                popNew('app-components-modalBox-modalBoxInput',{ title:'填写退货单号',placeHolder:'运单号' },(r) => {
                    if (r.trim()) {
                        fillReturnGoodsId(afterOrder.id, r).then(r => {
                            popNewMessage('填入退货运单号成功');
                            getReturnGoods(ReturnGoodsStatus.RETURNING);
                        });
                    } else {
                        popNewMessage('请输入运单号');
                    }
                });

            } else if (activeStatus === ReturnGoodsStatus.RETURNING && afterOrder.shipId) {  // 查看退货物流
                // popNew('app-view-mine-freight',{ order: afterOrder.order });
                popNew('app-view-mine-freight',{ order: { ship_id:afterOrder.shipId } });
            }
        } 
        console.log(e.btn, index);
    }

    // 退货状态变化
    public returnChnage(rtype:ReturnChangeType) {
        if (rtype === ReturnChangeType.ACCEPT) {
            this.typeClick(ReturnGoodsStatus.RETURNING);
        } else if (rtype === ReturnChangeType.SUCCESS) {
            this.typeClick(ReturnGoodsStatus.RETURNED);
        } else if (rtype === ReturnChangeType.FAILED) {
            this.typeClick(ReturnGoodsStatus.RETURNED);
        }
    }
}

// 退货状态变动
export enum ReturnChangeType {
    ACCEPT = 0,   // 接受退货申请
    SUCCESS = 1,  // 退货成功
    FAILED = -1   // 退货失败
}

const STATE = {
    orders:new Map<ReturnGoodsStatus,AfterSale[]>()
};

register('mall/afterSales',(afterSaleOrders:Map<ReturnGoodsStatus,AfterSale[]>) => {
    STATE.orders = afterSaleOrders;
    forelet.paint(STATE);
});

register('flags/returnChange',(rtype:ReturnChangeType) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.returnChnage(rtype);
});
