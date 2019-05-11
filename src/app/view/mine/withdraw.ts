import { Widget } from '../../../pi/widget/widget';
import { applyWithdraw } from '../../net/pull';
import { getStore } from '../../store/memstore';

/**
 * 提现
 */
export class Withdraw extends Widget {
    public props:any = {
        balance:getStore('balance/cash',0),
        tax:0,    // 税费
        tariff:0.5,  // 税率 0.5%
        money:0,
        notice:false
    };

    // 输入提现金额
    public moneyChange(e:any) {
        this.props.money = e.value;
        if (e.value <= this.props.balance) {
            this.props.tax = e.value * this.props.tariff / 100;
            this.props.notice = false;
        } else {
            this.props.tax = 0;
            this.props.notice = true;
        }
        this.paint();
    }

    // 确认提现
    public confirm() {
        if (this.props.money < this.props.balance) {
            applyWithdraw(this.props.money * 100).then(r => {
                
            });
        } 
    }
}