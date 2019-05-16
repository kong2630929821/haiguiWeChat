
/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

import { popNew } from '../../../pi/ui/root';
import { addWidget } from '../../../pi/widget/util';
import { queryLogistics } from '../../net/thirdPull';
import { PowerFlag } from '../member/powerConstant';

// ============================== 导出
export const run = (cb): void =>  {
    addWidget(document.body, 'pi-ui-root');
    const page = /page=([a-zA-Z]+)&*/.exec(location.search) ? /page=([a-zA-Z]+)&*/.exec(location.search)[1] :'';
    if (page === 'free') {
        // 打开免费试用装
        popNew('app-view-member-giftPage',{ fg:PowerFlag.free });
    } else if (page === 'offClass') {
        // 打开线下课程
        popNew('app-view-member-giftPage',{ fg:PowerFlag.offClass });
    } else {
        // 打开首页面
        popNew('app-view-base-app');
    }
    queryLogistics();
    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
    }, 100);
};
