import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { OrderStatus, register } from '../../../store/memstore';
import { getUserTypeShow } from '../../../utils/logic';
import { priceFormat } from '../../../utils/tools';

export const forelet = new Forelet();

export const allOrderStatus = [
    { name:'待付款',status:OrderStatus.PENDINGPAYMENT,img:'wallet.png' },
    { name:'待发货',status:OrderStatus.PENDINGDELIVERED,img:'goods.png' },
    { name:'待收货',status:OrderStatus.PENDINGRECEIPT,img:'truck.png' },
    { name:'已完成',status:OrderStatus.PENDINGFINISH ,img:'order.png' },
    { name:'退货',status:OrderStatus.RETURNSTART,img:'return.png' },
    { name:'退货中',status:OrderStatus.RETURNING,img:'return.png' },
    { name:'已退货',status:OrderStatus.RETURNEND,img:'return.png' }
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
        let allStaus = this.props.allStaus.slice(0,4);
        if (status === OrderStatus.RETURNSTART) {
            allStaus = this.props.allStaus.slice(4);
        }
        popNew('app-view-mine-orderList',{ activeStatus: status,allStaus });
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
    avatar:''
};
register('balance',r => {
    State.balance[0].value = priceFormat(r.cash);
    State.balance[1].value = r.shell;
    State.balance[2].value = r.integral;
    forelet.paint(State);
});
register('user',r => {
    State.userType = getUserTypeShow(r.userType);
    State.inviteCode = r.inviteCode;
    State.userName = r.userName;
    State.avatar = r.avatar;
    forelet.paint(State);
});