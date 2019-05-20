import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { freeMaskGoodsId, OffClassGoodsId, saleClassGoodsId, vipClassGoodsId, whiteGoodsId_10000, whiteGoodsId_399 } from '../../config';
import { getActiveGoodsPrice, getGoodsDetails, getInviteRebate, orderActiveGoods, payMoney, payOrder, upgradeHWang } from '../../net/pull';
import { Address, getStore, register, UserType } from '../../store/memstore';
import { payToUpHbao } from '../../utils/logic';
import { popNewLoading, popNewMessage } from '../../utils/tools';
import { shareWithUrl } from '../../utils/wxAPI';
import { PowerFlag } from './powerConstant';
interface Props {
    fg:PowerFlag;   // 进入此页面的标记
    img:string;    // 展示的图片
    isCurVip:boolean;  // 是否是当前等级的会员 例如海宝会员查看海王会员的权益时为false
    userType:UserType;  // 用户会员等级
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
        this.props.isCurVip = getStore('user/userType',-1) === props.userType;  
        console.log(this.props);
    }

    // 免费领取
    public freeReceive() {
        popNew('app-view-member-applyModalBox',{ selectAddr:true },(addr) => {
            if (this.props.fg === PowerFlag.free) {
                this.confirmGoods(freeMaskGoodsId, addr);

            } else if (this.props.fg === PowerFlag.gift) {
                if (this.props.userType === UserType.hBao) {
                    this.confirmGoods(whiteGoodsId_399, addr);
                } else {
                    this.confirmGoods(whiteGoodsId_10000, addr);
                }
            } else {
                this.confirmGoods(freeMaskGoodsId, addr);
            }
            
        });
    }

    // 报名课程
    public applyClass() {
        popNew('app-view-member-applyModalBox',{ selectAddr:true },(addr) => {
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
                // 获取商品价格
                getActiveGoodsPrice(goods,addr.area_id).then(price => {
                    const cash = getStore('balance/cash');
                    if (cash < price.money) { 
                        register('flags/activityGoods',() => {
                            this.buyGoods(goods,order.orderInfo[0]);
                        });
                        payMoney(price.money - cash,'activity');
                    } else {
                        this.buyGoods(goods,order.orderInfo[0]);
                    }
                    loadding && loadding.callback(loadding.widget);

                }).catch(err => {
                    popNewMessage('获取商品价格失败');
                    loadding && loadding.callback(loadding.widget);
                });
                
            }).catch(r => {
                popNewMessage('下单失败');
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
        popNew('app-view-member-applyModalBox',null,() => {
            if (this.props.userType === UserType.hBao) {
                payToUpHbao();
            } else {
                upgradeHWang().then(() => {
                    popNewMessage('成功发送海王申请');
                });
            }
        });
    }

    // 分享给好友
    public share(name:string) {
        if (name === 'free') {
            shareWithUrl('免费领面膜','好友送了你一份面膜，快来领取吧',`${location.href}?page=${name}`,'');

        } else {
            shareWithUrl('免费领课程','好友送了你一个线下课程，快来领取吧',`${location.href}?page=${name}`,'');
        }
    }
}
