import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { freeMaskGoodsId, OffClassGoodsId, saleClassGoodsId, vipClassGoodsId, vipMaskGoodsId } from '../../config';
import { getGoodsDetails, getInviteRebate, orderActiveGoods, payMoney, payOrder, upgradeHWang } from '../../net/pull';
import { Address, getStore, register, UserType } from '../../store/memstore';
import { payToUpHbao } from '../../utils/logic';
import { popNewLoading, popNewMessage, priceFormat } from '../../utils/tools';
import { PowerFlag } from './powerConstant';
interface Props {
    fg:PowerFlag;   // 进入此页面的标记
    img:string;    // 展示的图片
    isCurVip:boolean;  // 是否是当前等级的会员 例如海宝会员查看海王会员的权益时为false
    userType:UserType;  // 用户会员等级
    btn:string;     // 按钮名称
    isAble:boolean;  // 是否可以领取
}
/**
 * 大礼包
 */
export class GiftPage extends Widget {
    public props:Props;

    public setProps(props:any) {
        super.setProps(props);
        if (props.fg === PowerFlag.offClass || props.fg === PowerFlag.free) {
            this.props.img = `${PowerFlag[props.fg]}.png`;

        } else if (props.userType === UserType.hWang) {
            this.props.img = `10000_${PowerFlag[props.fg]}.png`;

        } else {
            this.props.img = `399_${PowerFlag[props.fg]}.png`;
        }
        // 用户会员等级是否等于当前所查看的会员等级
        this.props.isCurVip = props.isCurVip || getStore('user/userType',-1) === props.userType; 
        this.props.isAble = true;  // 默认值可以领取
        const memberGifts = getStore('user/memberGifts');

        if (props.fg === PowerFlag.gift) { // 美白礼包
            const v = memberGifts.gift;
            if (v[0] > 0) {
                this.props.btn = '已全部领完';
                this.props.isAble = false;
            } else {
                this.props.btn = '免费领取';
            }
            
        } else if (props.fg === PowerFlag.vipGift) { // 尊享礼包
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
                } else {
                    popNewMessage('下单失败');
                    
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

    // // 分享给好友
    // public share(name:string) {
    //     if (name === 'free') {
    //         shareWithUrl('免费领面膜','好友送了你一份面膜，快来领取吧',`${location.href}?page=${name}`,'');

    //     } else {
    //         shareWithUrl('免费领课程','好友送了你一个线下课程，快来领取吧',`${location.href}?page=${name}`,'');
    //     }
    // }
}
