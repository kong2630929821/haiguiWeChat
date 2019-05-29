// ===================================  导入
import { userAgent } from '../../pi/util/html';
import { getWX_sign, uploadFile } from '../net/pull';
import { loadJS } from './logic';
import { popNewMessage } from './tools';
 
// ===================================  导出
let wxconfig;
let apiReady: boolean = false;

/**
 * 注册wxapi
 */
export const registerWXAPI = (cb?:any) => {
    loadJS('http://res2.wx.qq.com/open/js/jweixin-1.4.0.js', (info) => {
        if (info.result === 1) {
            if ((<any>self).wx) {
                const agent = userAgent('');
                if (agent.os.name === 'ios') {
                     // iOS获取签名只能是不带参数的URL，否则签名无效
                    getWX_sign(location.origin + location.pathname).then((resp:any) => {
                        initWxConfig(resp,cb);
                    });

                } else {
                    // 安卓获取签名需要完整的URL，不完整则签名无效
                    getWX_sign(location.href.split('#')[0]).then((resp:any) => {
                        initWxConfig(resp,cb);
                    });
                }
            }
        }
    });
};

/**
 * 初始化wxconfig
 */
const initWxConfig = (resp:any,cb:any) => {
    console.log('initWxConfig success');
    resp.debug = false;
    resp.jsApiList = ['hideMenuItems', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage','uploadImage', 'getLocalImgData','scanQRCode','closeWindow'];
    wxconfig = resp;
    (<any>self).wx.config(resp);

    (<any>self).wx.ready(() => {
        apiReady = true;
        (<any>self).wx.hideMenuItems({
            menuList: ['menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:facebook', 'menuItem:share:QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
        cb && cb();
    });

    (<any>self).wx.error(() => {  
        // config信息验证失败会执行error函数
        // console.log('wxconfig验证失败');
    });
};

/**
 * 重新设置wxconfig
 */
export const setWxConfig = () => {
    if (wxconfig) (<any>self).wx.config(wxconfig);
};

/**
 * 分享链接，需要在点击分享按钮之前调用
 */
export const shareWithUrl = (title:string, desc:string, url: string, img:string, cb?) => {
    if (!apiReady) {
        // popNewMessage('获取微信API失败,无法分享');
            
        return;
    } 
    const linkObj = {
        title: title,
        desc: desc,
        link: url,
        imgUrl: img,
        success: () => {
            cb && cb();
        },
        fail: () => {
            popNewMessage('分享失败');
        }
    };

    // 分享给朋友
    (<any>self).wx.onMenuShareAppMessage(linkObj);
            
    // 分享到朋友圈
    (<any>self).wx.onMenuShareTimeline(linkObj);
    
};

/**
 * 选择图片
 * @param num 最多数量
 */
export const takeImage = (num:number,cb) => {
    if (!apiReady) {
        // popNewMessage('获取微信API失败,无法拍照');
        
        return;
    }
    (<any>self).wx.chooseImage({
        count: num || 1,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
            cb && cb(res.localIds[0]);// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片            
        },
        fail: (res) => {
            popNewMessage(`拍照失败, ${JSON.stringify(res)}`);
        }
    });
};

/**
 * 上传图片
 * @param imgid 本地ID
 * @param cb callback
 */
export const upImage = (imgid: string, cb) => {
    if (!apiReady) {
        // popNewMessage('获取微信API失败,无法上传图片');
        
        return;
    }
    (<any>self).wx.uploadImage({
        localId: imgid, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: (res) => {
            // 上传到服务器
            uploadFile(res.serverId).then((ans) => {
                cb && cb(ans.sid);
            });

        }, fail: (res) => {
            popNewMessage(`发送图片失败：, ${JSON.stringify(res)}`);
        }

    });
};

/**
 * 扫描二维码
 */
export const scanQR = (cb) => {
    if (!apiReady) {
        // popNewMessage('获取微信API失败,无法扫描');

        return;
    }
    (<any>self).wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: (res) => {
            cb && cb(res.resultStr);// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片            
        },
        fail: (res) => {
            popNewMessage(`扫描失败, ${JSON.stringify(res)}`);
        }
    });
};
