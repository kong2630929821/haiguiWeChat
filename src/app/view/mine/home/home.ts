import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { AfterSale, getStore, Order, OrderStatus, register, ReturnGoodsStatus, setStore } from '../../../store/memstore';
import { getUserTypeShow } from '../../../utils/logic';
import { copyToClipboard, popNewMessage, priceFormat1, priceFormat2 } from '../../../utils/tools';

export const forelet = new Forelet();

export const allOrderStatus = [
    { name:'待付款',status:OrderStatus.PENDINGPAYMENT,img:'wallet1.png' },
    { name:'待发货',status:OrderStatus.PENDINGDELIVERED,img:'goods1.png' },
    { name:'待收货',status:OrderStatus.PENDINGRECEIPT,img:'truck1.png' },
    { name:'已完成',status:OrderStatus.PENDINGFINISH ,img:'order1.png' },
    { name:'退货',status:OrderStatus.RETURNSTART,img:'return1.png' }
];

// 退货订单
export const returnOrderStatus = [
    { name:'退货',status:ReturnGoodsStatus.CANRETURN,img:'' },
    { name:'退货中',status:ReturnGoodsStatus.RETURNING,img:'' },
    { name:'已退货',status:ReturnGoodsStatus.RETURNED,img:'' }
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
        State.message = getStore('flags').message ? getStore('flags/message') :false;
        this.state = State;
    }

    public goAddress() {
        popNew('app-view-mine-addressList',{});
    }

    public itemClick(status:OrderStatus) {
        let allStaus;
        if (status === OrderStatus.RETURNSTART) {
            allStaus = returnOrderStatus;
            popNew('app-view-returnGoods-afterSaleOrderList',{ activeStatus: ReturnGoodsStatus.CANRETURN,allStaus });
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
        if (!this.state.verified) {
            popNew('app-view-mine-IDCardUpload');
        } else {
            popNew('app-view-mine-verify');
        }
    }

    // 复制邀请码
    public copy() {
        copyToClipboard(this.state.inviteCode);
        popNewMessage('复制成功');
    }

    // 去我的收藏
    public goCollect() {
        // popNew('app-components-modalBox-modalBoxImg',{ img: 'checkIn.png',btn:true });
        popNew('app-view-mine-favorites',{});
    }

    // 去消息列表
    public gotoMessage() {
        popNew('app-view-mine-messageStation',{});
        setStore('flags/message',false);
        localStorage.setItem('messageStatus',JSON.stringify(getStore('message')[0] ? getStore('message')[0].id :0));
    }

    // 联系我们
    public contactUs() {
        popNew('app-view-mine-contactUs');
    }
}
const State = {
    balance:[
        { key:'现金',value:'0' },
        { key:'海贝',value:0 },
        { key:'积分',value:0 }
    ],
    uid:0,
    userType:'',
    inviteCode:'',
    userName:'微信名',
    avatar:'',
    orders:new Map<OrderStatus,Order[]>(),
    verified:false,
    message:false,
    returnGoodsFg:false  // 退货中订单填写物流单号提醒
};
register('balance',r => {
    State.balance[0].value = priceFormat1(r.cash);
    State.balance[1].value = priceFormat2(r.shell);
    State.balance[2].value = priceFormat2(r.integral);
    forelet.paint(State);
});
register('user',r => {
    State.uid = r.uid;
    State.userType = getUserTypeShow().split('会员')[0];
    State.inviteCode = r.inviteCode;
    State.userName = r.userName;
    State.avatar = r.avatar;
    State.verified = !!r.IDCard; // 有身份证号码表示实名认证成功
    forelet.paint(State);
});

register('mall/orders',(orders:Map<OrderStatus,Order[]>) => {
    State.orders = orders;
    forelet.paint(State);
});

// 监听消息是否查看
register('flags/message',(r => {
    State.message = r;
    forelet.paint(State);
}));

// 监听退货订单
register('mall/afterSales',(orders:Map<ReturnGoodsStatus,AfterSale[]>) => {
    const order = orders.get(ReturnGoodsStatus.RETURNING);
    State.returnGoodsFg = false;
    for (const v of order) {
        if (v.status === 1 && !v.shipId) {
            State.returnGoodsFg = true;  // 只要有一个退货中订单未填运单号则提示
        }
    }
    
    forelet.paint(State);
});