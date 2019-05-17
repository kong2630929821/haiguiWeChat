import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { freeMaskGoodsId, offClassGoodsId } from '../../config';
import { getGoodsDetails, upgradeHWang } from '../../net/pull';
import { CartGoods, getStore, UserType } from '../../store/memstore';
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
        // 不是会员需要填写一些基础信息
        if (getStore('user/userType',-1) >= UserType.normal) {
            popNew('app-view-member-applyModalBox',{ selectAddr:true },() => {
                
                this.confirmOrder(freeMaskGoodsId);
            });
        } else {
            this.confirmOrder(freeMaskGoodsId);            
        }
    }

    // 报名课程
    public applyClass() {
        // 不是会员需要填写一些基础信息
        if (getStore('user/userType',-1) >= UserType.normal) {
            popNew('app-view-member-applyModalBox',{ selectAddr:true },() => {
                
                this.confirmOrder(offClassGoodsId);
            });
        } else {
            this.confirmOrder(offClassGoodsId);
        }
    }

    // 确认下单
    public async confirmOrder (id:number) {
        const loadding = popNewLoading('请稍候');
        const goods = await getGoodsDetails(id);
        const cartGood:CartGoods = {
            index:-1,
            goods,
            amount:1,
            selected:true
        };
        loadding.callback(loadding.widget);
        popNew('app-view-shoppingCart-confirmOrder',{ orderGoods:[cartGood],buyNow:true });
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
