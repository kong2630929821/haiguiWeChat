
/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

import { popNew } from '../../../pi/ui/root';
import { addWidget } from '../../../pi/widget/util';
import { setStore, UserType } from '../../store/memstore';
import { PowerFlag } from '../member/powerConstant';

// ============================== 导出
export const run = (cb): void =>  {
    addWidget(document.body, 'pi-ui-root');
    const page = /page=([a-zA-Z]+)&*/.exec(location.search) ? /page=([a-zA-Z]+)&*/.exec(location.search)[1] :'';
    const inviteCode = /inviteCode=([a-zA-Z]+)&*/.exec(location.search) ? /inviteCode=([a-zA-Z]+)&*/.exec(location.search)[1] :'';
    if (inviteCode && inviteCode !== 'undefined') setStore('user/fcode',inviteCode);

    if (page === 'free') {
        // 打开免费试用装
        popNew('app-view-member-giftPage',{ fg:PowerFlag.free, isCurVip:true });
    } else if (page === 'offClass') {
        // 打开线下课程
        popNew('app-view-member-giftPage',{ fg:PowerFlag.offClass, isCurVip:true  });
    } else if (page === 'turntable') {
        // 打开大转盘
        popNew('app-view-member-turntable');
    } else if (page === 'upHbao') {
        // 升级海宝
        popNew('app-view-member-powerDetail',{ userType:UserType.hBao,upgrade:true });
    } else if (page === 'upHwang') { 
        // 升级海王
        popNew('app-view-member-powerDetail',{ userType:UserType.hWang,upgrade:true });
    } else {
        // 打开首页面
        popNew('app-view-base-app');
    }
    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
    }, 100);
};
