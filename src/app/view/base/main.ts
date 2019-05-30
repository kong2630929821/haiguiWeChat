
/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

import { backCall1, backList, popNew } from '../../../pi/ui/root';
import { addWidget } from '../../../pi/widget/util';
import { setStore, UserType } from '../../store/memstore';
import { unicode2Str } from '../../utils/tools';
import { setWxConfig } from '../../utils/wxAPI';
import { PowerFlag } from '../member/powerConstant';

// ============================== 导出
export const run = (cb): void =>  {
    addWidget(document.body, 'pi-ui-root');
    const page = /page=([a-zA-Z]+)&*/.exec(location.search) ? /page=([a-zA-Z]+)&*/.exec(location.search)[1] :'';
    const inviteCode = /inviteCode=([a-zA-Z0-9]+)&*/.exec(location.search) ? /inviteCode=([a-zA-Z0-9]+)&*/.exec(location.search)[1] :'';
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
        popNew('app-view-member-powerDetail',{ userType:UserType.hBao });
    } else if (page === 'upHwang') { 
        // 升级海王
        popNew('app-view-member-powerDetail',{ userType:UserType.hWang });
    } else {
        // 打开首页面
        popNew('app-view-base-app');
    }
    const a = '[36229,20154,19981,20250,39134,55357,32,55357]';
    console.log('---------',unicode2Str(JSON.parse(a)));
    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
    }, 100);

    backCall();
};
declare var wx;
const backCall = () => {
    // 当前URL
    const CUR_URL = location.origin + location.pathname;
    let search = location.search.split('?from=0')[0];
    search = search.split('&from=0')[0];
    if (search) {
        search += '&';
    } else {
        search = '?';
    }
    try {
        const win = top.window; // 取顶层窗口
    // 注册系统返回事件
        win.onpopstate = () => {
            win.history.pushState({}, '',  `${CUR_URL}${search}from=0`);
            if (backList.length > 1) {
                backCall1();
            } else {
                console.log('closwWindow',wx);
           
            // 所有需要使用JS-SDK的页面必须先注入配置信息，否则将无法调用（同一个url仅需调用一次，
            // 对于变化url的SPA的web app可在每次url变化时进行调用,目前Android微信客户端不支持pushState的H5新特性，
            // 所以使用pushState来实现web app的页面会导致签名失败，此问题会在Android6.2中修复）
                setWxConfig();
                (<any>self).wx.ready(() => {
                    console.log('closwWindow ready success');
                    wx.closeWindow({
                        success:(res) => {
                            console.log('closeWindow success ===',res);
                        },
                        fail:(res) => {
                            console.log('closeWindow fail ===',res);
                        },
                        complete:(res) => {
                            console.log('closeWindow complete ===',res);
                        }
                    });
                });
            // listenerList({ type: 'back' });
            }
            console.log('location href3',location.href);
            console.log('popstate ===',backList.map(item => item.widget.name));
        };
        console.log('location href1',location.href);
        win.history.pushState({}, '', `${CUR_URL}${search}from=0`);
        console.log('location href2',location.href);
    // tslint:disable-next-line:no-empty
    } catch (e) {
    }
};