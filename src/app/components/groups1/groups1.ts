import { popNew } from '../../../pi/ui/root';
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { mallImagPre } from '../../config';
import { getStore, Groups, UserType } from '../../store/memstore';
import { getImageThumbnailPath } from '../../utils/tools';
import { localInviteCode } from '../../view/base/main';
import { PowerFlag } from '../../view/member/powerConstant';

interface Props {
    list:Groups[];   // 展示的分组列表1
}

/**
 * 首页显示分组样式1
 */
export class GroupsOne extends Widget {
    // tslint:disable-next-line:no-unnecessary-override
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props,
            getImageThumbnailPath,
            mallImagPre
        };
        super.setProps(this.props,oldProps);
        // console.log('GroupsOne ----------------',props);
    }

    public clickItem(e:any,index:number) {
        notify(e.node,'ev-click-groups-one',{ group:this.props.list[index] }); 
    }

    public gotoTurntableClick() {
        popNew('app-view-member-turntable');
    }
    
    public becomeHaiBao() {
        const userType = getStore('user/userType');
        if (userType === UserType.hWang) {
            popNew('app-view-member-powerDetail',{ userType:UserType.hWang });
        } else {
            popNew('app-view-member-powerDetail',{ userType:UserType.hBao });
        }
    }

    public becomeHaiWang() {
        popNew('app-view-member-powerDetail',{ userType:UserType.hWang });
    }

    public shareGift() {
        const userType = getStore('user/userType');
        if (userType === UserType.normal || userType === UserType.other) {
            popNew('app-components-popModel-popModel',{ title:'是否升级海宝' },() => {
                popNew('app-view-member-powerDetail',{ userType:UserType.hBao });
            });
        } else {
            popNew('app-view-member-giftPage',{ fg:PowerFlag.free, isCurVip:true, ableGain:localInviteCode && localInviteCode !== 'undefined'  });
        }
    }
}