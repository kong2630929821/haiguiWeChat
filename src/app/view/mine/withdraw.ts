import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { applyWithdraw } from '../../net/pull';
import { getStore, register } from '../../store/memstore';
import { popNewLoading, popNewMessage, priceFormat } from '../../utils/tools';
export const forelet = new Forelet();
interface Props {
    balance:string;  // 余额
    tax:string;    // 税费
    inputMoney:number;  // 输入金额
    notice:boolean;  // 显示提示
}
let STATE = {
    singleLimit:'0',// 提现单笔上限
    tariff:0// 税率
};
/**
 * 提现
 */
export class Withdraw extends Widget {
    public ok :() => void;
    public props:Props = {
        balance:priceFormat(getStore('balance/cash',0)),
        tax:'',    // 税费
        inputMoney:0,
        notice:false
    };
    
    public create() {
        super.create();
        STATE.singleLimit = priceFormat(getStore('withdrawalSetting/singleLimit',0));
        STATE.tariff = getStore('withdrawalSetting/tariff',0);
        this.state = STATE;
    }
    // 输入提现金额
    public moneyChange(e:any) {
        this.props.inputMoney = Number(e.value);
        if (this.props.inputMoney <= Number(this.props.balance)) {
            this.props.tax = (this.props.inputMoney * this.state.tariff).toFixed(2);
            this.props.notice = false;
        } else {
            this.props.tax = '';
            this.props.notice = true;
        }
        this.paint();
    }

    // 确认提现
    public confirm() {
        if (this.props.inputMoney > 0 && this.props.inputMoney <= Number(this.props.balance) && this.props.inputMoney % 10 === 0 && this.props.inputMoney <= Number(this.state.singleLimit)) {
            const loadding = popNewLoading('申请提交中');
            applyWithdraw(this.props.inputMoney * 100).then(r => {
                loadding && loadding.callback(loadding.widget);
                this.ok && this.ok();
                popNewMessage('申请提交成功');
                
            }).catch(r => {
                loadding && loadding.callback(loadding.widget);

                if (r.type === 6002) {
                    popNewMessage('今日提现已超过上限');
                } else {
                    popNewMessage('申请提交失败');
                }
            });
        } else {
            popNewMessage('请输入合适的金额');
        }
    }
}
register('withdrawalSetting',r => {
    STATE = {
        singleLimit:priceFormat(r.singleLimit),// 提现单笔上限
        tariff:r.tariff// 税率
    };
    forelet.paint(STATE);
});