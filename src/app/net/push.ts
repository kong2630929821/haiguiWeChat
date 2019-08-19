/**
 * 后端主动推消息给前端
 */
import { setMsgHandler } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { setStore } from '../store/memstore';
import { getAllMessage10 } from '../utils/logic';
import { popNewMessage, priceFormat } from '../utils/tools';
import { delOrder, getNeedPayOrders } from '../view/shoppingCart/confirmOrder';

/**
 * 支付成功
 */
// tslint:disable-next-line:max-func-body-length
export const payComplete = () => {
    // 支付成功
    setMsgHandler('event_pay_ok', (r) => {
        // alert(JSON.stringify(r));
        if (r.msg && r.msg[2] === 'activity') {  // 购买权益特殊商品
            setStore('flags/activityGoods',true);
        } else if (r.msg && r.msg[2] === '105') {
            setStore('flags/mallRecharge',true);    // 充值成功
        }
    });
    
    // 升级海宝成功
    setMsgHandler('event_update_haibao',() => {
        setStore('flags/upgradeHbao',true);
    });

    // 升级海宝失败
    setMsgHandler('event_update_haibao_fail',(r) => {
        if (r && r.msg[0] === 4012) {
            popNewMessage('获取上级失败');
        } else {
            popNewMessage('升级海宝失败');
        }
    });

    // 购买商品成功
    setMsgHandler('event_pay_order',(res) => {
        console.log('event_pay_order',res);
        delOrder(res.msg[0]);
        if (getNeedPayOrders().length === 0) {
            setStore('flags/payOrder',true);     // 购买成功
        }
    });

    // 购买商品失败
    setMsgHandler('event_pay_order_fail',(r) => {
        console.log('event_pay_order_fail',r);
        if (r && r.msg[0] === 2132) {
            popNewMessage('该礼包，您已领取，无法再次领取');
        } else if (r && r.msg[0] === 2124) {
            popNewMessage('库存不足');
        } else {
            popNewMessage('支付失败');
        }
        delOrder(r[2]);
        if (getNeedPayOrders().length === 0) {
            setStore('flags/payOrder',false);     // 购买失败
        }
    
    });

    // 余额变化
    setMsgHandler('alter_balance_ok',r => {
        if (r.type === 1) { // 现金
            setStore('balance/cash',r.balance[0]);
        } else if (r.type === 2) {  // 海贝
            setStore('balance/shell',r.balance[0]);
        } else {  // 积分
            setStore('balance/integral',r.balance[0]);
        }
        console.log('金额变化推送========alter_balance_ok',r);
    });

    // 收益变化
    setMsgHandler('alter_earnings_ok',r => {
        if (r.type === 1) { // 现金收益
            setStore('earning/cash',priceFormat(r.balance[0]));
        } else if (r.type === 2) {  // 海贝收益
            setStore('earning/shell',r.balance[0]);
        } 
        console.log('收益变化推送========alter_earnings_ok',r);
    });

    // 退货状态变动
    setMsgHandler('event_return_change',r => {
        setStore('flags/returnChange',r.type);
        console.log('退货状态变动========event_return_change',r);
    });

    // 提现开关变化
    setMsgHandler('event_withdraw_switch_change',r => {
        setStore('flags/withdrawal',r.state);
        console.log('提现状态变动========event_withdraw_switch_change',r);
    });

    // 提现配置变化
    setMsgHandler('event_withdraw_config_change',r => {
        const data = {
            singleLimit:r.config[0],
            tariff:r.config[1]
        };
        setStore('withdrawalSetting',data);
        console.log('提现配置========event_withdraw_config_change',r);
    });

    // 消息推送
    setMsgHandler('event_inner_msg',r => {
        getAllMessage10();
    });

};

/**
 * 签到成功
 */
export const checkIn = () => {
    // 签到推送
    setMsgHandler('check_in_msg',r => {
        console.log('签到推送========check_in_msg',r);
        if (r.count === 10) {
            // popNewMessage('签到已满10天，快联系客服领取奖励吧');
            popNew('app-components-modalBox-modalBoxImg',{ img: 'checkIn.png' });
        } else {
            popNewMessage('签到成功');
        }
    });
};
checkIn();