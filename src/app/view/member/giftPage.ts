import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { baoSaleClassGoodsId, baoVipClassGoodsId, baoVipMaskGoodsId, freeMaskGoodsId, OffClassGoodsId, onlyWXPay, wangSaleClassGoodsId, wangVipClassGoodsId, wangVipMaskGoodsId } from '../../config';
import { getAllGifts, getGoodsDetails, orderActiveGoods, payMoney, payOrder } from '../../net/pull';
import { Address, getStore, register, unregister, UserType } from '../../store/memstore';
import { copyToClipboard, popNewLoading, popNewMessage } from '../../utils/tools';
import { setWxConfig, shareWithUrl } from '../../utils/wxAPI';
import { localInviteCode } from '../base/main';
import { PowerFlag } from './powerConstant';
interface Props {
    fg:PowerFlag;   // 进入此页面的标记
    img:string;    // 展示的图片
    isCurVip:boolean;  // 是否是当前等级的会员 例如海宝会员查看海王会员的权益时为false
    userType:UserType;  // 用户会员等级
    btn:string;     // 按钮名称
    isAble:boolean;  // 是否可以领取
    ableGain:boolean;  // 是否可以领取试用装或线下课程
    inviteCode:string;   // 邀请码
}
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

/**
 * 大礼包
 */
export class GiftPage extends Widget {
    public props:Props;

    public setProps(props:any) {
        super.setProps(props);
        this.props.inviteCode = getStore('user/inviteCode','');
        // 用户会员等级是否等于当前所查看的会员等级
        this.props.isCurVip = props.isCurVip || getStore('user/userType',-1) === props.userType; 
        if (props.userType === UserType.hWang) {
            this.props.img = `10000_${PowerFlag[props.fg]}1.png`;

        } else {
            this.props.img = `399_${PowerFlag[props.fg]}1.png`;
            if (props.fg === PowerFlag.gift) {
                this.props.img = `399_${PowerFlag[props.fg]}.png`;
            }
        }        
        this.initData();
        getAllGifts().then(r => {
            console.log('getAllGifts return ',r);
            if (r) {
                this.initData();
            } else {
                popNewMessage('获取礼包数据失败，请退出重进');
            }
        });
        
    }

    public initData() {
        // 领取按钮
        this.props.isAble = true;  // 默认值可以领取
        const memberGifts = getStore('user/memberGifts');
        if (this.props.fg === PowerFlag.vipGift) { // 尊享礼包
            const v = memberGifts.vipGift;
            const endTime = v[5];  // 结束时间
            const nextTime = v[3];  // 下次可领时间
            const nowTime = Date.now();  // 当前时间
            const perTime = v[4];  // 间隔时间
            if (v[0] < v[1] && nextTime > nowTime) {
                // 未到下次可领时间，且未领完
                this.props.btn = `本周已领，还剩 ${Math.ceil((endTime - nextTime) / perTime)} 盒`;
                this.props.isAble = false;
            } else if (v[0] === v[1] || endTime < nowTime) {
                // 已超过结束时间，或已经全部领完
                this.props.btn = '已全部领完';
                this.props.isAble = false;
            } else {
                this.props.btn = '领取本期面膜';
            }
        } else if (this.props.fg === PowerFlag.free) {  // 免费试用装
            this.initBtn(memberGifts.free,1);
           
        } else if (this.props.fg === PowerFlag.offClass) {  // 线下课程 
            this.initBtn(memberGifts.offClass,2);
            
        } else if (this.props.fg === PowerFlag.gift) {  // 美白礼包 
            this.initBtn(memberGifts.gift,1);
            
        } else if (this.props.fg === PowerFlag.vipClass) { // 精品课程
            this.initBtn(memberGifts.vipClass,2);

        } else if (this.props.fg === PowerFlag.saleClass) { // 销售课程
            this.initBtn(memberGifts.saleClass,2);
        } 
    }

    // 复制邀请码
    public copyCode() {
        copyToClipboard(this.props.inviteCode);
        popNewMessage('复制成功');
    }

    /**
     * 更新按钮名称
     * @param v v[0] 已领数量 v[1] 领取上限
     * @param fg 1 免费领取 2 报名听课
     */
    public initBtn(v:number[],fg:number) {
        if (v[1] > 0 && v[0] >= v[1]) {
            this.props.btn = '已全部领完';
            this.props.isAble = false;
        } else if (fg === 1) { 
            this.props.btn = '免费领取';
        } else {
            this.props.btn = '报名听课';
        }
        
    }

    // 免费领取
    public freeReceive() {
        if (localInviteCode && localInviteCode ===  getStore('user/inviteCode','')) {
            popNewMessage('不能领取自己分享的试用装');

            return;
        }
        if (this.props.isAble) {
            popNew('app-view-member-fillAddrModalBox',{ selectAddr:true },(addr) => {
                if (this.props.fg === PowerFlag.free) {
                    this.buyGoods(freeMaskGoodsId, addr);

                } else if (this.props.fg === PowerFlag.gift) {
                    this.buyGoods(getStore('user/memberGifts/optionalGift',0), addr);
                } else {
                    if (this.props.userType === UserType.hBao) {
                        this.buyGoods(baoVipMaskGoodsId, addr);
                    } else if (this.props.userType === UserType.hWang) {
                        this.buyGoods(wangVipMaskGoodsId, addr);
                    }
                    
                }
            
            });
        }
    }

    // 报名课程
    public applyClass() {
        if (localInviteCode && localInviteCode === getStore('user/inviteCode','')) {
            popNewMessage('不能领取自己分享的线下课程');

            return;
        }
        if (this.props.isAble) {
            popNew('app-view-member-fillAddrModalBox',{ selectAddr:true },(addr) => {
                if (this.props.fg === PowerFlag.offClass) {
                    this.buyGoods(OffClassGoodsId,addr);
                } else if (this.props.fg === PowerFlag.vipClass) {
                    if (this.props.userType === UserType.hBao) {
                        this.buyGoods(baoVipClassGoodsId,addr);
                    } else if (this.props.userType === UserType.hWang) {
                        this.buyGoods(wangVipClassGoodsId,addr);
                    }
                    
                } else {
                    if (this.props.userType === UserType.hBao) {
                        this.buyGoods(baoSaleClassGoodsId,addr);
                    } else if (this.props.userType === UserType.hWang) {
                        this.buyGoods(wangSaleClassGoodsId,addr);
                    }
                }
            });
        }
    }

    // 购买商品成功
    public buySuccess() {
        if (this.props.fg === PowerFlag.free || this.props.fg === PowerFlag.offClass) {
            popNew('app-view-member-turntable');  // 打开大转盘
        } 
        // popNewMessage('领取成功');   // 购买商品成功会提示
        this.props.isAble = false;
        this.props.btn = '您已领取';
        this.paint();
        getAllGifts();  // 重新获取所有礼包
        
    }

    // 分享给好友
    public share(pop:boolean = true) {
        const flag = window.sessionStorage.appInflag;

        if (flag) {  // app进入
            popNew('app-components-share-share');

        } else {   // 公众号进入
            setWxConfig();
            if (this.props.fg === PowerFlag.free) {
                shareWithUrl('免费领面膜','好友送了你一份面膜，快来领取吧',`${location.origin + location.pathname}?page=free&inviteCode=${this.props.inviteCode}`,'');

            } else if (this.props.fg === PowerFlag.offClass) {
                shareWithUrl('免费领课程','好友送了你一个线下课程，快来领取吧',`${location.origin + location.pathname}?page=offClass&inviteCode=${this.props.inviteCode}`,'');

            } else {
                shareWithUrl('海龟壹号','更多精彩，就等你来',`${location.origin + location.pathname}`,'');
            }
            if (pop) {
                popNew('app-components-bigImage-bigImage',{ img:'../../res/image/shareBg.png' });
            }
        }
    }

    // 邀请好友开通会员
    public inviteShare(str:string) {
        setWxConfig();
        if (str === 'hBao') {
            shareWithUrl('升级海宝','好友邀请你来成为海宝，享受海宝专属福利',`${location.origin + location.pathname}?page=upHbao&inviteCode=${this.props.inviteCode}`,'');

        } else {
            shareWithUrl('升级海王','好友邀请你来成为海王，享受海王专属福利',`${location.origin + location.pathname}?page=upHwang&inviteCode=${this.props.inviteCode}`,'');
        }
        popNew('app-components-bigImage-bigImage',{ img:'../../res/image/shareBg.png' });
    }

    public buyGoods(goods:number,addr:Address) {
        register('flags/payOrder',() => {
            this.buySuccess();
        });
        confirmActivityGoods(goods,addr);
    }

    public destroy() {
        super.destroy();
        unregister('flags/payOrder',() => {
            this.buySuccess();
        });

        return true;
    }
}

register('flags/wxReady',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.share(false);
});
register('flags/activityGoods',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.buySuccess();
});

// 购买活动商品
export const confirmActivityGoods = (goods:number,addr:Address) => {
    const loadding = popNewLoading('请稍候');
    // 获取商品详情
    getGoodsDetails(goods).then(res => {  
        // 下单商品
        orderActiveGoods([goods,1,res.labels[0][0]],addr.id).then(order => { 
            const price = order.orderInfo[3] + order.orderInfo[5]; // 商品总价+运费
            const oid = order.orderInfo[0];

            if (price > 0) {
                if (onlyWXPay) {
                    // 微信支付（正式服）
                    payMoney(price,'activity',1,['pay_order',[oid]]);
                } else {
                    // 用余额支付 (自测使用)
                    const cash = getStore('balance/cash',0);
                    if (cash > price) {
                        payOrder(oid).catch(r => {
                            popNewMessage('领取失败');
                        });
                    } else {
                        payMoney(price - cash,'activity',1,['pay_order',[oid]]);
                    }
                }
                // 提示需要支付费用
                // popNew('app-view-member-confirmPayInfo',{ money: priceFormat(price) },() => {
                //     const cash = getStore('balance/cash');
                //     if (cash < price) { 
                //         payMoney(price - cash,'activity',1,['pay_order',[oid]]);
                //     } else {
                //         payOrder(oid).then(() => {
                //             this.buySuccess();
                //         }).catch(err => {
                //             popNewMessage('领取失败');
                //         });
                //     }
                // });
            } else {
                payOrder(oid).then(() => {
                    // 支付成功后会有推送, register 中会提示
                }).catch(err => {
                    popNewMessage('领取失败');
                });
            }
            loadding && loadding.callback(loadding.widget);

        }).catch(err => {
            if (err.result === 2124) {
                popNewMessage('库存不足');
            } else if (err.type === 2132) {
                popNewMessage('该礼包，您已领取，无法再次领取');
            } else {
                popNewMessage('领取失败');
            }
            loadding && loadding.callback(loadding.widget);
        });
        
    }).catch(err => {
        loadding && loadding.callback(loadding.widget);
        popNewMessage('获取商品信息失败');
    });
};