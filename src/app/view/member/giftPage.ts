import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { freeMaskGoodsId, OffClassGoodsId, saleClassGoodsId, vipClassGoodsId, whiteGoodsId_10000, whiteGoodsId_399 } from '../../config';
import { getActiveGoodsPrice, getGoodsDetails, getInviteRebate, orderActiveGoods, payMoney, upgradeHWang } from '../../net/pull';
import { getStore, register, UserType } from '../../store/memstore';
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
                this.confirmGoods(freeMaskGoodsId, addr.area_id);

            } else if (this.props.fg === PowerFlag.gift) {
                if (this.props.userType === UserType.hBao) {
                    this.confirmGoods(whiteGoodsId_399, addr.area_id);
                } else {
                    this.confirmGoods(whiteGoodsId_10000, addr.area_id);
                }
            } else {
                this.confirmGoods(freeMaskGoodsId, addr.area_id);
            }
            
        });
    }

    // 报名课程
    public applyClass() {
        popNew('app-view-member-applyModalBox',null,() => {
            if (this.props.fg === PowerFlag.offClass) {
                this.confirmGoods(OffClassGoodsId,0);
            } else if (this.props.fg === PowerFlag.vipClass) {
                this.confirmGoods(vipClassGoodsId,0);
            } else {
                this.confirmGoods(saleClassGoodsId,0);
            }
           
        });
    }

    // 确认商品信息
    public confirmGoods(goods:number,addrId:number) {
        const loadding = popNewLoading('请稍候');
        getActiveGoodsPrice(goods,addrId).then(r => {
            const cash = getStore('balance/cash');
            if (cash < r.money) { 
                register('flags/activityGoods',() => {
                    this.bugGoods(goods,addrId);
                });
                payMoney(r.money - cash,'activity');
            } else {
                this.bugGoods(goods,addrId);
            }
            loadding && loadding.callback(loadding.widget);
        }).catch(err => {
            loadding && loadding.callback(loadding.widget);
            popNewMessage('获取商品价格失败');
        });
    }

    // 购买商品
    public bugGoods(goods:number,addrId:number) {
        const loadding = popNewLoading('请稍候');
        getGoodsDetails(goods).then(res => {
            orderActiveGoods([goods,1,res.labels[0][0]],addrId).then(r => {
                if (this.props.fg === PowerFlag.free || this.props.fg === PowerFlag.offClass) {
                    getInviteRebate(goods);  // 试用装和线下课程需要调返利接口给上级返利
                } 
                popNewMessage('下单成功');
                loadding && loadding.callback(loadding.widget);

            }).catch(r => {
                popNewMessage('下单失败');
                loadding && loadding.callback(loadding.widget);
            });
            
        }).catch(err => {
            loadding && loadding.callback(loadding.widget);
            popNewMessage('获取商品信息失败');
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
