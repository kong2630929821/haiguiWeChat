import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { freeMaskGoodsId, OffClassGoodsId, saleClassGoodsId, vipClassGoodsId, vipMaskGoodsId } from '../../config';
import { getAllGifts, getGoodsDetails, getInviteRebate, orderActiveGoods, payMoney, payOrder, upgradeHWang } from '../../net/pull';
import { Address, getStore, register, UserType } from '../../store/memstore';
import { payToUpHbao } from '../../utils/logic';
import { popNewLoading, popNewMessage, priceFormat } from '../../utils/tools';
import { setWxConfig, shareWithUrl } from '../../utils/wxAPI';
import { PowerFlag } from './powerConstant';
interface Props {
    fg:PowerFlag;   // 进入此页面的标记
    img:string;    // 展示的图片
    isCurVip:boolean;  // 是否是当前等级的会员 例如海宝会员查看海王会员的权益时为false
    userType:UserType;  // 用户会员等级
    btn:string;     // 按钮名称
    isAble:boolean;  // 是否可以领取
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
        // 用户会员等级是否等于当前所查看的会员等级
        this.props.isCurVip = props.isCurVip || getStore('user/userType',-1) === props.userType; 
        if (props.fg === PowerFlag.offClass || props.fg === PowerFlag.free) {
            this.props.img = `${PowerFlag[props.fg]}.png`;
            
        } else if (props.userType === UserType.hWang) {
            this.props.img = `10000_${PowerFlag[props.fg]}.png`;

        } else {
            this.props.img = `399_${PowerFlag[props.fg]}.png`;
        }
        
        // 领取按钮
        this.props.isAble = true;  // 默认值可以领取
        const memberGifts = getStore('user/memberGifts');
        if (props.fg === PowerFlag.vipGift) { // 尊享礼包
            const v = memberGifts.vipGift;
            if (v[0] < v[1] && v[3] > Date.now()) {
                // 未到下次可领时间，且未领完
                this.props.btn = `本周已领，还剩 ${v[1] - v[0]} 盒`;
                this.props.isAble = false;
            } else if (v[0] === v[1] || v[5] < Date.now()) {
                // 已超过结束时间，或已经全部领完
                this.props.btn = '已全部领完';
                this.props.isAble = false;
            } else {
                this.props.btn = '领取本期面膜';
            }
        } else if (props.fg === PowerFlag.free) {  // 免费试用装
            this.initBtn(memberGifts.free,1);
           
        } else if (props.fg === PowerFlag.offClass) {  // 线下课程 
            this.initBtn(memberGifts.offClass,2);
            
        } else if (props.fg === PowerFlag.gift) {  // 美白礼包 
            this.initBtn(memberGifts.gift,1);
            
        } else if (props.fg === PowerFlag.vipClass) { // 精品课程
            this.initBtn(memberGifts.vipClass,2);

        } else if (props.fg === PowerFlag.saleClass) { // 销售课程
            this.initBtn(memberGifts.saleClass,2);
        } 
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
        if (this.props.isAble) {
            popNew('app-view-member-fillAddrModalBox',{ selectAddr:true },(addr) => {
                if (this.props.fg === PowerFlag.free) {
                    this.confirmGoods(freeMaskGoodsId, addr);

                } else if (this.props.fg === PowerFlag.gift) {
                    this.confirmGoods(getStore('user/memberGifts/optionalGift',0), addr);
                } else {
                    this.confirmGoods(vipMaskGoodsId, addr);
                }
            
            });
        }
    }

    // 报名课程
    public applyClass() {
        if (this.props.isAble) {
            popNew('app-view-member-fillAddrModalBox',{ selectAddr:true },(addr) => {
                if (this.props.fg === PowerFlag.offClass) {
                    this.confirmGoods(OffClassGoodsId,addr);
                } else if (this.props.fg === PowerFlag.vipClass) {
                    this.confirmGoods(vipClassGoodsId,addr);
                } else {
                    this.confirmGoods(saleClassGoodsId,addr);
                }
           
            });
        }
    }

    // 购买商品
    public confirmGoods(goods:number,addr:Address) {
        const loadding = popNewLoading('请稍候');
        // 获取商品详情
        getGoodsDetails(goods).then(res => {  
            // 下单商品
            orderActiveGoods([goods,1,res.labels[0][0]],addr.id).then(order => { 
                const cash = getStore('balance/cash');
                const price = order.orderInfo[3] + order.orderInfo[5]; // 商品总价+运费
                // 提示需要支付费用
                popNew('app-view-member-confirmPayInfo',{ money: priceFormat(price) },() => {
                    if (cash < price) { 
                        register('flags/activityGoods',() => {
                            this.buyGoods(goods,order.orderInfo[0]);
                        });
                        payMoney(price - cash,'activity');
                    } else {
                        this.buyGoods(goods,order.orderInfo[0]);
                    }
                });
                loadding && loadding.callback(loadding.widget);

            }).catch(err => {
                if (err.result === 2124) {
                    popNewMessage('库存不足');
                } else if (err.type === 2132) {
                    popNewMessage('已全部领完');
                } else {
                    popNewMessage('领取失败');
                }
                loadding && loadding.callback(loadding.widget);
            });
            
        }).catch(err => {
            loadding && loadding.callback(loadding.widget);
            popNewMessage('获取商品信息失败');
        });
    }

    // 购买商品
    public buyGoods(goods:number,oid:number) {
        payOrder(oid).then(pay => {
            if (this.props.fg === PowerFlag.free || this.props.fg === PowerFlag.offClass) {
                getInviteRebate(goods);  // 试用装和线下课程需要调返利接口给上级返利
            } 
            popNewMessage('支付成功');
            getAllGifts();  // 重新获取所有礼包
            
        }).catch(err => {
            popNewMessage('支付失败');
        });
    }

    // 开通会员
    public openVIP() {
        popNew('app-view-member-applyModalBox',null,(sel) => {
            if (this.props.userType === UserType.hBao) {
                payToUpHbao(sel);
                register('flags/upgradeHbao',() => {
                    payToUpHbao(sel);
                });
            } else {
                upgradeHWang(sel).then(() => {
                    popNewMessage('成功发送海王申请');
                });
            }
        });
    }

    // 分享给好友
    public share() {
        setWxConfig();
        if (this.props.fg === PowerFlag.free) {
            shareWithUrl('免费领面膜','好友送了你一份面膜，快来领取吧',`${location.origin + location.pathname}?page=free&inviteCode=${getStore('user/inviteCode','')}`,'');

        } else if (this.props.fg === PowerFlag.offClass) {
            shareWithUrl('免费领课程','好友送了你一个线下课程，快来领取吧',`${location.origin + location.pathname}?page=offClass&inviteCode=${getStore('user/inviteCode','')}`,'');

        } else {
            shareWithUrl('海龟壹号','更多精彩，就等你来',`${location.origin + location.pathname}`,'');
        }
        popNew('app-components-bigImage-bigImage',{ img:'../../res/image/shareBg.png' });
    }

    // 邀请好友开通会员
    public inviteShare(str:string) {
        setWxConfig();
        if (str === 'hBao') {
            shareWithUrl('升级海宝','好友邀请你来成为海宝，享受海宝专属福利',`${location.origin + location.pathname}?page=upHbao&inviteCode=${getStore('user/inviteCode','')}`,'');
        } else {
            shareWithUrl('升级海王','好友邀请你来成为海王，享受海王专属福利',`${location.origin + location.pathname}?page=upHwang&inviteCode=${getStore('user/inviteCode','')}`,'');
        }
        popNew('app-components-bigImage-bigImage',{ img:'../../res/image/shareBg.png' });
    }
}

register('flags/wxReady',() => {
    const w = forelet.getWidget(WIDGET_NAME);
    w && w.share();
});