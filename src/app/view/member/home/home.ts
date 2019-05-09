
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { register } from '../../../store/memstore';
interface Props {
    userType:number;  // 用户会员等级 0 普通 1 海宝 2 海王
    powerList:any[]; // 权益列表
    code:string;   // 邀请码
}
export const PageFg = {
    baby:'baby',  // 海宝
    cash:'cash', // 现金
    partner:'partner', // 伙伴
    shell:'shell' // 海贝
};
export const forelet = new Forelet();
/**
 * 收益  
 */
export class Home extends Widget {
    public props:Props = {
        userType:1,
        powerList:[
            { name:'免费试用装',img:'../../../res/image/income_active.png',tpl:'app-view-member-modalBoxInput' },
            { name:'线下课程',img:'../../../res/image/income_active.png',tpl:'' },
            { name:'邀请返利',img:'../../../res/image/income_active.png',tpl:'' },
            { name:'新品预留',img:'../../../res/image/income_active.png',tpl:'' }
        ],
        code:'123456'
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.state = State;
    }

    // 权益
    public itemClick(ind:number) {
        if (this.props.powerList[ind].tpl) {
            popNew(this.props.powerList[ind].tpl);
        }
    }

    // 当前用户的会员等级
    public goDetail() {
        popNew('app-view-member-powerDetail',{ userType:this.props.userType, code:this.props.code });
    }

    // 会员等级介绍
    public powerDetail(num:number) {
        popNew('app-view-member-powerDetail',{ userType:num });
    }

    // 收益标签
    public tabClick(num:number) {
        switch (num) {
            case 0: case 2:
                popNew('app-view-member-logList',this.state[num]);
                break;
            case 1: case 3:
                popNew('app-view-member-cashList',this.state[num]);
                break;
            default:
        }
    }

}

const State = [
    { amount:0,title:'我的海宝',fg:PageFg.baby },
    { amount:0,title:'现金总收益',fg:PageFg.cash },
    { amount:0,title:'我的伙伴',fg:PageFg.cash },
    { amount:0,title:'海贝总收益',fg:PageFg.shell }
];
register('earning',(r) => {
    State[0].amount = r.baby;
    State[1].amount = r.cash;
    State[2].amount = r.partner;
    State[3].amount = r.shell;
    forelet.paint(State);
});