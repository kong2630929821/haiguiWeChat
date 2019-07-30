
/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

import { addActivityBackPressed } from '../../../pi/browser/app_comon_event';
import { ExitApp } from '../../../pi/browser/exitApp';
import { backCall1, backList, lastBack, popNew } from '../../../pi/ui/root';
import { userAgent } from '../../../pi/util/html';
import { addWidget } from '../../../pi/widget/util';
import { setStore, UserType } from '../../store/memstore';
import { setWxConfig } from '../../utils/wxAPI';
import { PowerFlag } from '../member/powerConstant';

export const localInviteCode = /inviteCode=([a-zA-Z0-9]+)&*/.exec(location.search) ? /inviteCode=([a-zA-Z0-9]+)&*/.exec(location.search)[1] :'';
// ============================== 导出
export const run = (cb): void =>  {
    addWidget(document.body, 'pi-ui-root');
    const page = /page=([a-zA-Z]+)&*/.exec(location.search) ? /page=([a-zA-Z]+)&*/.exec(location.search)[1] :'';
    if (localInviteCode && localInviteCode !== 'undefined') setStore('user/fcode',localInviteCode);

    if (page === 'free') {
        // 打开免费试用装
        popNew('app-view-member-giftPage',{ fg:PowerFlag.free, isCurVip:true, ableGain:localInviteCode && localInviteCode !== 'undefined'  });
    } else if (page === 'offClass') {
        // 打开线下课程
        popNew('app-view-member-giftPage',{ fg:PowerFlag.offClass, isCurVip:true, ableGain:localInviteCode && localInviteCode !== 'undefined' });
    } else if (page === 'turntable') {
        // 打开大转盘
        popNew('app-view-member-turntable');
    } else {
        // 打开首页面
        popNew('app-view-base-app');
        if (page === 'upHbao') {
            // 升级海宝
            popNew('app-view-member-powerDetail',{ userType:UserType.hBao });
        } else if (page === 'upHwang') { 
            // 升级海王
            popNew('app-view-member-powerDetail',{ userType:UserType.hWang });
        }
    }
    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
    }, 100);

    backCall();
    addAppEvent();
};

declare var wx;
const backCall = () => {
    // 当前URL
    const CUR_URL = location.origin + location.pathname;
    const agent = userAgent('');
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
            if (agent.os.name !== 'ios') {  // iOS返回本不会刷新不需要设置状态
                win.history.pushState({}, '', `${CUR_URL}${search}from=0`);
            } else {
                win.history.pushState({}, '', '');
            }
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
       
        if (agent.os.name !== 'ios') {  // iOS返回本不会刷新不需要设置状态
            win.history.pushState({}, '', `${CUR_URL}${search}from=0`);
            console.log('location href2',location.href);
        } else {
            win.history.pushState({}, '', '');
        }
    // tslint:disable-next-line:no-empty
    } catch (e) {
    }
};

/**
 * 注册app event
 */
const addAppEvent = () => {
    let startTime = 0;
    // 注册appBackPressed返回键
    addActivityBackPressed(() => {
        let doubleClick = false;
        const now = new Date().getTime();
        if (now - startTime <= 300) {
            doubleClick = true;
        }
        startTime = now;
        console.log('addActivityBackPressed callback called');
        if (backList.length === 1) {
            if (!doubleClick) return;
            const exitApp = new ExitApp();
            exitApp.init();
            exitApp.ToHome({});
        } else {
            const widget = lastBack();
            const entranceName = 'app-view-base-entrance';
            const entranceName1 = 'app-view-base-entrance1';
            if (widget.name === entranceName || widget.name === entranceName1) return;
            backCall1();
        }
    });
};
