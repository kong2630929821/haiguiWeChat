/**
 * 后端主动推消息给前端
 */
import { setMsgHandler } from '../../pi/net/ui/con_mgr';
import { setStore } from '../store/memstore';
import { popNewMessage } from '../utils/tools';
import { getBalance, getInviteRebate, upgradeHBao } from './pull';

/**
 * 支付成功
 */
export const payComplete = () => {
    setMsgHandler('event_pay_ok', (r) => {
        getBalance();
        if (r.msg.GoodID === 'hBao') {
            upgradeHBao().then(() => {
                popNewMessage('升级海宝成功');
            });
        } else if (r.msg.GoodID === 'free') {
            getInviteRebate(20001);
        } else if (r.msg.GoodID === 'offClass') {
            getInviteRebate(20002);
        } else if (r.msg && r.msg.GoodID === '105') {
            setStore('flags/mallRecharge',true);

        }
    });
};
