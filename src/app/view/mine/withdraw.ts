import { Widget } from '../../../pi/widget/widget';
import { applyWithdraw } from '../../net/pull';
import { getStore } from '../../store/memstore';
import { popNewMessage, priceFormat } from '../../utils/tools';

/**
 * 提现
 */
export class Withdraw extends Widget {
    public ok :() => void;
    public props:any = {
        balance:priceFormat(getStore('balance/cash',0)),
        tax:0,    // 税费
        tariff:0.06,  // 税率 6%
        inputMoney:0,
        notice:false
    };

    // 输入提现金额
    public moneyChange(e:any) {
        this.props.inputMoney = e.value;
        if (e.value <= this.props.balance) {
            this.props.tax = e.value * this.props.tariff;
            this.props.notice = false;
        } else {
            this.props.tax = 0;
            this.props.notice = true;
        }
        this.paint();
    }

    // 确认提现
    public confirm() {
        // && this.props.inputMoney % 10 === 0
        if (this.props.inputMoney < this.props.balance) {
            applyWithdraw(this.props.inputMoney * 100).then(r => {
                popNewMessage('申请提交成功');
                this.ok && this.ok();
            }).catch(r => {
                popNewMessage('申请提交失败');
            });
        } else {
            popNewMessage('请输入合适的金额');
        }
    }
}