import { Widget } from '../../../pi/widget/widget';
import { applyWithdraw } from '../../net/pull';
import { getStore } from '../../store/memstore';
import { popNewMessage, priceFormat } from '../../utils/tools';
interface Props {
    balance:string;  // 余额
    tax:number;    // 税费
    tariff:number;  // 税率 6%
    inputMoney:number;  // 输入金额
    notice:boolean;  // 显示提示
}
/**
 * 提现
 */
export class Withdraw extends Widget {
    public ok :() => void;
    public props:Props = {
        balance:priceFormat(getStore('balance/cash',0)),
        tax:0,    // 税费
        tariff:0.06,  // 税率 6%
        inputMoney:0,
        notice:false
    };

    // 输入提现金额
    public moneyChange(e:any) {
        this.props.inputMoney = Number(e.value);
        if (this.props.inputMoney <= Number(this.props.balance)) {
            this.props.tax = this.props.inputMoney * this.props.tariff;
            this.props.notice = false;
        } else {
            this.props.tax = 0;
            this.props.notice = true;
        }
        this.paint();
    }

    // 确认提现
    public confirm() {
        if (this.props.inputMoney > 0 && this.props.inputMoney <= Number(this.props.balance && this.props.inputMoney % 10 === 0)) {
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