import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { whiteGoodsId_399A, whiteGoodsId_399B } from '../../config';
import { getStore, register, UserType } from '../../store/memstore';
import { applyToUpHwang, getUserTypeShow, payToUpHbao } from '../../utils/logic';
import { confirmActivityGoods } from './giftPage';
import * as Constant from './powerConstant';
interface Props {
    list:string[];  // 权益详情介绍
    userType:UserType;  // 用户会员等级 
    powerList:any[];  // 权益列表
    userTypeShow:string;  // 用户类型名称
}
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
/**
 * 权益详情
 */
export class PowerDetail extends Widget {
    public ok:() => void;
    public props:Props;
    public state:string = '';  // 自己的邀请码
   
    public setProps(props:any) {
        super.setProps(props);
        this.initData();
        if (getStore('user/userType') === this.props.userType) {
            this.state = getStore('user/inviteCode','');
        }
    }

    public initData() {
        if (this.props.userType === UserType.hWang) {
            this.props.list = Constant.hWangDesc;
            this.props.powerList = Constant.hWangPower;
        } else {
            this.props.list = Constant.hBaoDesc;
            this.props.powerList = Constant.hBaoPower;
        }
        this.props.userTypeShow = getUserTypeShow(this.props.userType);
    }
    
    // 权益
    public itemClick(ind:number) {
        const item = this.props.powerList[ind];
        if (item.tpl) {
            popNew(item.tpl,{ fg: item.fg, userType: this.props.userType });
        }
    }

    // 升级会员等级
    public upgradeUser() {
        if (!this.state) {  // 没有邀请码，不是当前等级的会员可以开通
            popNew('app-view-member-privacypolicy',null,() => {
                
                popNew('app-view-member-applyModalBox',{ needAddress:this.props.userType !== UserType.hWang, userType:this.props.userType },(data) => {
                    
                    if (this.props.userType === UserType.hWang) {
                        applyToUpHwang(data.sel);
                    } else {
                        let optional = whiteGoodsId_399A;
                        if (data.sel === 'B') optional = whiteGoodsId_399B;
                        confirmActivityGoods(optional, data.addr);
                        // payToUpHbao(data.sel,() => {
                        //     this.ok && this.ok();
                        // });
                    }
                });
            });
        }
    }
}

register('user',(r) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    // 已经是海王 不能再开通海宝
    if (w && r.userType <= w.props.userType) {
        w.props.userType = r.userType;
        w.initData();
        forelet.paint(r.inviteCode); 
    }
});
register('flags/upgradeHbao',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.ok && w.ok();
});