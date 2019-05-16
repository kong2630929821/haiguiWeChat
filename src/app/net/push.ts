/**
 * 后端主动推消息给前端
 */
import { setMsgHandler } from '../../pi/net/ui/con_mgr';
import { setStore, UserType } from '../store/memstore';
import { popNewMessage } from '../utils/tools';
import { getBalance, getInviteRebate, upgradeHBao } from './pull';

/**
 * 支付成功
 */
export const payComplete = () => {
    setMsgHandler('event_pay_ok', (r) => {
        alert(JSON.stringify(r));
        getBalance();
        if (r.msg && r.msg[2] === 'hBao') {
            upgradeHBao().then(() => {
                popNewMessage('升级海宝成功');
                setStore('user/userType', UserType.hBao);
            });
        } else if (r.msg && r.msg[2] === 'free') {
            getInviteRebate(20001);
        } else if (r.msg && r.msg[2] === 'offClass') {
            getInviteRebate(20002);
        } else if (r.msg && r.msg[2] === '105') {
            setStore('flags/mallRecharge',true);
        }
    });
};
