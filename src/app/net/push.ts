/**
 * 后端主动推消息给前端
 */
import { setMsgHandler } from '../../pi/net/ui/con_mgr';
import { setStore } from '../store/memstore';
import { payToUpHbao } from '../utils/logic';

/**
 * 支付成功
 */
export const payComplete = () => {
    // 支付成功
    setMsgHandler('event_pay_ok', (r) => {
        alert(JSON.stringify(r));
        if (r.msg && r.msg[2] === 'hBao') {
            payToUpHbao();
        } else if (r.msg && r.msg[2] === 'activity') {
            setStore('flags/activityGoods',true);
        } else if (r.msg && r.msg[2] === '105') {
            setStore('flags/mallRecharge',true);
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
};
