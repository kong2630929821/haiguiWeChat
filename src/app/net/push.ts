/**
 * 后端主动推消息给前端
 */
import { setMsgHandler } from '../../pi/net/ui/con_mgr';
import { setStore } from '../store/memstore';
import { popNewMessage } from '../utils/tools';
import { delOrder, getNeedPayOrders } from '../view/shoppingCart/confirmOrder';

/**
 * 支付成功
 */
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
            popNewMessage('该商品已领过');
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
            setStore('balance/cash',r.balance);
        } else if (r.type === 2) {  // 海贝
            setStore('balance/shell',r.balance);
        } else {  // 积分
            setStore('balance/integral',r.balance);
        }
        console.log('金额变化推送========alter_balance_ok',r);
    });

    // 收益变化
    setMsgHandler('alter_earnings_ok',r => {
        if (r.type === 1) { // 现金收益
            setStore('earning/cash',r.balance);
        } else if (r.type === 2) {  // 海贝收益
            setStore('earning/shell',r.balance);
        } 
        console.log('收益变化推送========alter_earnings_ok',r);
    });

    // 退货状态变动
    setMsgHandler('event_return_change',r => {
        setStore('flags/returnChange',r.type);
        console.log('退货状态变动========event_return_change',r);
    });
};
