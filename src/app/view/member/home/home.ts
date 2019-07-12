
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAllGifts, getEarningTotal, getInviteCode } from '../../../net/pull';
import { register, setStore, UserType } from '../../../store/memstore';
import { applyToUpHwang, getUserTypeShow, payToUpHbao } from '../../../utils/logic';
import { copyToClipboard, popNewMessage, priceFormat } from '../../../utils/tools';
import { confirmActivityGoods } from '../giftPage';
import { hBaoPower, hWangPower } from '../powerConstant';

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
    public create() {
        super.create();
        this.state = State;
    }

    public setProps(props:any) {
        super.setProps(props);
        getEarningTotal();  // 获取收益统计
        getAllGifts();  // 重新获取所有礼包
    }

    // 权益
    public itemClick(ind:number) {
        const item = this.state.powerList[ind];
        if (item.tpl) {
            popNew(item.tpl,{ fg: item.fg, userType: this.state.userType });
        }
    }

    // 当前用户的会员等级
    public goDetail() {
        popNew('app-view-member-powerDetail',{ userType:this.state.userType });
    }

    // 会员等级介绍
    public powerDetail(user:string) {
        popNew('app-view-member-powerDetail',{ userType:UserType[user] });
    }

    // 收益标签
    public tabClick(num:number) {
        switch (num) {
            case 0: case 2:
                popNew('app-view-member-logList',this.state.earning[num]);
                break;
            case 1: case 3:
                popNew('app-view-member-cashList',this.state.earning[num]);
                break;
            default:
        }
    }

    // 升级会员等级
    public upgradeUser(user:string) {
        popNew('app-view-member-privacypolicy',null,() => {
            popNew('app-view-member-applyModalBox',{ userType:UserType[user] },(sel) => {
                if (user === 'hWang') {
                    applyToUpHwang(sel);
                } else {
                    payToUpHbao(sel);
                    
                }
            });
        });
    }

    // 复制邀请码
    public copy() {
        copyToClipboard(this.state.inviteCode);
        popNewMessage('复制成功');
    }
}

const State = {
    earning:[
        { amount:0,title:'我的海宝',fg:PageFg.baby },
        { amount:'0',title:'现金总收益',fg:PageFg.cash },
        { amount:0,title:'我的伙伴',fg:PageFg.cash },
        { amount:0,title:'海贝总收益',fg:PageFg.shell }
    ],
    userType:UserType.other, // 用户会员等级
    userTypeShow:'',
    inviteCode:'',   // 邀请码
    powerList:hBaoPower  // 权益列表
};
register('earning',r => {
    State.earning[0].amount = r.baby;
    State.earning[1].amount = priceFormat(r.cash);
    State.earning[2].amount = r.partner;
    State.earning[3].amount = r.shell;
    forelet.paint(State);
});
register('user',r => {
    State.userType = r.userType;
    State.userTypeShow = getUserTypeShow();
    State.inviteCode = r.inviteCode;
    State.powerList = r.userType === UserType.hWang ? hWangPower :hBaoPower;
    forelet.paint(State);
});
register('flags/upgradeHbao',() => {
    popNewMessage('升级海宝成功，输入地址立即领取礼包');
    setStore('user/userType', UserType.hBao);
    getInviteCode().then(res => {
        setStore('user/inviteCode',res.code);
    });

    getAllGifts().then(gift => {  // 获取所有礼包
        popNew('app-view-member-fillAddrModalBox',{ selectAddr:true },(addr) => {
            confirmActivityGoods(gift.optionalGift, addr);  // 领取美白礼包
        });
    });  
});