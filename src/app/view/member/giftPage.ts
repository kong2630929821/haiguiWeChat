import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { payMoney, upgradeHWang } from '../../net/pull';
import { getStore, UserType } from '../../store/memstore';
import { popNewMessage } from '../../utils/tools';
import { PowerFlag } from './powerConstant';
interface Props {
    fg:PowerFlag;   // 进入此页面的标记
    img:string;    // 展示的图片
    isCurVip:boolean;  // 是否是当前等级的会员 例如海宝会员查看海王会员的权益时为false
    userType:UserType;  // 用户会员等级
}
/**
 * 大礼包
 */
export class GiftPage extends Widget {
    public props:Props;

    public setProps(props:any) {
        super.setProps(props);
        if (props.fg === PowerFlag.offClass || props.fg === PowerFlag.free) {
            this.props.img = `${PowerFlag[props.fg]}.png`;

        } else if (props.userType === UserType.hWang) {
            this.props.img = `10000_${PowerFlag[props.fg]}.png`;

        } else {
            this.props.img = `399_${PowerFlag[props.fg]}.png`;
        }
        this.props.isCurVip = getStore('user/userType',-1) === props.userType;  
        console.log(this.props);
    }

    // 免费领取
    public freeReceive() {
        // 不是会员需要填写一些基础信息
        if (getStore('user/userType',-1) >= UserType.normal) {
            popNew('app-view-member-applyModalBox',null,() => {
                // TODO
            });
        } else {
            console.log('免费领取');
        }
    }

    // 报名课程
    public applyClass() {
        // 不是会员需要填写一些基础信息
        if (getStore('user/userType',-1) >= UserType.normal) {
            popNew('app-view-member-applyModalBox',null,() => {
                // TODO
            });
        } else {
            console.log('报名课程');
        }
    }

    // 开通会员
    public open() {
        popNew('app-view-member-applyModalBox',null,() => {
            if (this.props.userType === UserType.hBao) {
                payMoney(39900,'hBao');
            } else {
                upgradeHWang().then(() => {
                    popNewMessage('成功发送海王申请');
                });
            }
        });
    }

    // 分享给好友
    public share() {
        console.log('分享给好友');
        // TODO
    }
}