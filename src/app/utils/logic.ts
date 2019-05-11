import { getStore, UserType } from '../store/memstore';

/**
 * 本地方法
 */
declare var wx;
declare var WeixinJSBridge;
/**
 * 选择图片
 * @param num 最多数量
 */
export const selectImg = (num:number,cb:Function) => {
    wx.chooseImage({
        count: num || 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res:any) {
            const src = res.tempFilePaths;  
            cb(src);  // 返回图片路径数组
        }
    });
};

/**
 * 上传图片
 * @param img 需要上传的图片的本地ID，由chooseImage接口获得
 */
export const updateImg = (img,cb) => {
    wx.uploadImage({
        localId: img, 
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: (res) => {
            const serverId = res.serverId; // 返回图片的服务器端ID
            // TODO 上传到本地服务器
        }
    });
};

/**
 * 分享给微信或QQ好友
 * @param title 标题
 * @param desc 描述
 * @param link 链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
 * @param imgUrl 图标
 */
export const shareToFriend = (title,desc,link,imgUrl,cb?) => {
    wx.ready(() => {   // 需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData({ 
            title: title, 
            desc: desc, 
            link: link, 
            imgUrl: imgUrl, 
            success: () => {
                cb && cb();
            }
        });
    });
};

/**
 * 分享到朋友圈或QQ空间
 * @param title 标题
 * @param link 链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
 * @param imgUrl 图标
 */
export const shareToGround = (title,link,imgUrl,cb?) => {
    wx.ready(() => {      // 需在用户可能点击分享按钮前就先调用
        wx.updateTimelineShareData({ 
            title: title,
            link: link, 
            imgUrl: imgUrl, 
            success: () => {
                cb && cb();
            }
        });
    });
};

/**
 * 时间戳格式化 毫秒为单位
 * timeType 1 返回时分， 2 返回月日， 3 返回月日时分， 4 返回月日时分 
 */ 
export const timestampFormat = (timestamp: number,timeType?: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    if (timeType === 1) {
        return `${hour}:${minutes}`;
    }
    if (timeType === 2) {
        return `${month}月${day}日`;
    }
    if (timeType === 3) {
        return `${month}月${day}日 ${hour}:${minutes}`;
    }
    if (timeType === 4) {
        return `${month}-${day} ${hour}:${minutes}`;
    }

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

/**
 * 打开微信支付
 */
export const openWXPay = (param:any) => {
    const onBridgeReady = () => {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
            appId:'wx2421b1c4370ec43b',     // 公众号名称，由商户传入     
            timeStamp:'1395712654',         // 时间戳，自1970年以来的秒数     
            nonceStr:'e61463f8efa94090b1f366cccfbbb444', // 随机串     
            package:'prepay_id=u802345jgfjsdfgsdg888',     
            signType:'MD5',         // 微信签名方式：     
            paySign:'70EA570631E4BB79628FBCA90534C63FF7FADD89' // 微信签名 
        });
    };

    if (WeixinJSBridge === 'undefined') {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      
    } else {
        onBridgeReady();
    }
};

/**
 * 获取会员等级名称
 */
export const getUserTypeShow = (user?:UserType) => {
    if (!user) user = getStore('user/userType',0);
    if (user === UserType.hWang) return '海王';
    if (user === UserType.hBao) return '海宝';
    
    return '';
};