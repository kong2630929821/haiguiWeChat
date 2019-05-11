import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getStore, UserType } from '../../store/memstore';
import { PowerFlag } from './powerConstant';

/**
 * 大礼包
 */
export class GiftPage extends Widget {
    public props:any;

    public setProps(props:any) {
        super.setProps(props);
        if (props.fg === PowerFlag.free || props.fg === PowerFlag.offClass) {
            this.props.img = `${PowerFlag[props.fg]}.png`;

        } else if (props.userType === UserType.hBao) {
            this.props.img = `399_${PowerFlag[props.fg]}.png`;

        } else {
            this.props.img = `10000_${PowerFlag[props.fg]}.png`;
        }
        this.props.isVip = getStore('user/userType') === props.userType;
        console.log(this.props);
    }

    // 免费领取
    public freeReceive() {
        popNew('app-view-member-applyModalBox');
    }

    // 报名课程
    public applyClass() {
        console.log('报名课程');
        // TODO 
    }

    // 开通会员
    public open() {
        console.log('开通会员');
        // TODO
    }

    // 分享给好友
    public share() {
        console.log('分享给好友');
        // TODO
    }
}