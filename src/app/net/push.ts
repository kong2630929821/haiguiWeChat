/**
 * 后端主动推消息给前端
 */
import { setMsgHandler } from '../../pi/net/ui/con_mgr';
import { popNewMessage } from '../utils/tools';
import { getBalance, upgradeHBao } from './pull';

/**
 * 支付成功
 */
export const payComplete = () => {
    setMsgHandler('event_pay_ok', (r) => {
        getBalance();
        if (r.msg && r.msg.GoodID === '101') {
            upgradeHBao().then(() => {
                popNewMessage('升级海宝成功');
            });
        }
    });
};
