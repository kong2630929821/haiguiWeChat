import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { ReturnGoodsStatus } from '../../../net/pull';
import { Order, OrderStatus, register } from '../../../store/memstore';
import { getUserTypeShow } from '../../../utils/logic';
import { copyToClipboard, popNewMessage, priceFormat1, priceFormat2 } from '../../../utils/tools';

export const forelet = new Forelet();

export const allOrderStatus = [
    { name:'待付款',status:OrderStatus.PENDINGPAYMENT,img:'wallet.png' },
    { name:'待发货',status:OrderStatus.PENDINGDELIVERED,img:'goods.png' },
    { name:'待收货',status:OrderStatus.PENDINGRECEIPT,img:'truck.png' },
    { name:'已完成',status:OrderStatus.PENDINGFINISH ,img:'order.png' },
    { name:'退货',status:OrderStatus.RETURNSTART,img:'return.png' }
];

// 退货订单
export const returnOrderStatus = [
    { name:'退货',status:ReturnGoodsStatus.CANRETURN,img:'return.png' },
    { name:'退货中',status:ReturnGoodsStatus.RETURNING,img:'return.png' },
    { name:'已退货',status:ReturnGoodsStatus.RETURNED,img:'return.png' }
];
/**
 * 我的首页
 */
export class Home extends Widget {
    public setProps(props:any) {
        this.props = {
            ...props,
            allStaus:allOrderStatus
        };
        super.setProps(this.props);
        this.state = State;
    }

    public goAddress() {
        popNew('app-view-mine-addressList',{});
    }

    public itemClick(status:OrderStatus) {
        let allStaus;
        if (status === OrderStatus.RETURNSTART) {
            allStaus = returnOrderStatus;
            popNew('app-view-mine-afterSaleOrderList',{ activeStatus: ReturnGoodsStatus.CANRETURN,allStaus });
        } else {
            allStaus = this.props.allStaus.slice(0,4);
            popNew('app-view-mine-orderList',{ activeStatus: status,allStaus });
        }
        
    }

    public balanceLog(num:number) {
        if (num === 0) {
            popNew('app-view-mine-myCash');
        }
    }

    // 实名认证
    public verified() {
        popNew('app-view-mine-IDCardUpload');
    }

    // 复制邀请码
    public copy() {
        copyToClipboard(this.state.inviteCode);
        popNewMessage('复制成功');
    }
}
const State = {
    balance:[
        { key:'现金',value:'0' },
        { key:'海贝',value:0 },
        { key:'积分',value:0 }
    ],
    userType:'',
    inviteCode:'',
    userName:'',
    avatar:'',
    orders:new Map<OrderStatus,Order[]>()
};
register('balance',r => {
    
    State.balance[0].value = priceFormat1(r.cash);
    State.balance[1].value = priceFormat2(r.shell);
    State.balance[2].value = priceFormat2(r.integral);
    forelet.paint(State);
});
register('user',r => {
    State.userType = getUserTypeShow().split('会员')[0];
    State.inviteCode = r.inviteCode;
    State.userName = r.userName;
    State.avatar = r.avatar;
    forelet.paint(State);
});

register('mall/orders',(orders:Map<OrderStatus,Order[]>) => {
    State.orders = orders;
    forelet.paint(State);
});