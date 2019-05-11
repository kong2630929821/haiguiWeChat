import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStore, register } from '../../../store/memstore';
import { getUserTypeShow } from '../../../utils/logic';

export const forelet = new Forelet();
/**
 * 我的首页
 */
export class Home extends Widget {
    public props:any = {
        orderType:[
            { name:'待付款',img:'wallet.png' },
            { name:'待发货',img:'goods.png' },
            { name:'待收货',img:'truck.png' },
            { name:'已完成',img:'order.png' },
            { name:'退货',img:'return.png' }
        ]
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.state = State;
    }

    public goAddress() {
        popNew('app-view-mine-addressList');
    }

    public itemClick(num:number) {
        popNew('app-view-mine-orderList',{ active: num });
    }

    public balanceLog(num:number) {
        if (num === 0) {
            popNew('app-view-mine-myCash');
        }
    }
}
const State = {
    balance:[
        { key:'现金',value:0 },
        { key:'海贝',value:0 },
        { key:'积分',value:0 }
    ],
    userType:'',
    inviteCode:''
};
register('balance',r => {
    State.balance[0].value = r.cash;
    State.balance[1].value = r.shell;
    State.balance[2].value = r.integral;
    forelet.paint(State);
});
register('user',r => {
    State.userType = getUserTypeShow(r.userType);
    State.inviteCode = r.inviteCode;
    forelet.paint(State);
});