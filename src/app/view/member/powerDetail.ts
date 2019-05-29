import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { upgradeHWang } from '../../net/pull';
import { getStore, register, UserType } from '../../store/memstore';
import { getUserTypeShow, payToUpHbao } from '../../utils/logic';
import { popNewMessage } from '../../utils/tools';
import * as Constant from './powerConstant';
interface Props {
    list:string[];  // 权益详情介绍
    userType:UserType;  // 用户会员等级 
    powerList:any[];  // 权益列表
    userTypeShow:string;  // 用户类型名称
    code:string;  // 邀请码
    upgrade:boolean;  // 是否弹出填信息弹窗
}

/**
 * 权益详情
 */
export class PowerDetail extends Widget {
    public ok:() => void;
    public props:Props;
   
    public setProps(props:any) {
        super.setProps(props);
        if (props.userType === UserType.hWang) {
            this.props.list = Constant.hWangDesc;
            this.props.powerList = Constant.hWangPower;
        } else {
            this.props.list = Constant.hBaoDesc;
            this.props.powerList = Constant.hBaoPower;
        }
        if (getStore('user/userType') === props.userType) {
            this.props.code = getStore('user/inviteCode','');
        }
        this.props.userTypeShow = getUserTypeShow(props.userType);
        if (props.upgrade) {
            this.upgradeUser();
        }
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
        popNew('app-view-member-applyModalBox',null,(sel) => {
            if (this.props.userType === UserType.hWang) {
                upgradeHWang(sel).then(() => {
                    popNewMessage('成功发送海王申请');
                });
            } else {
                payToUpHbao(sel,() => {
                    this.ok && this.ok();
                });
                register('flags/upgradeHbao',() => {
                    payToUpHbao(sel,() => {
                        this.ok && this.ok();
                    });
                });
            }
        });
    }
}