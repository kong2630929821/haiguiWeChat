import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getBalanceList, getWithdrawStatus } from '../../net/pull';
import { CashLogType, getCashLogName, timestampFormat } from '../../utils/logic';
import { priceFormat, unicode2Str } from '../../utils/tools';
interface Props {
    list: any[];   // 当月数据
    select:{
        num:number;
        value:number[];
    };  // 选择的年月
}
const Status = [
    '申请中',
    '处理中',
    '提现成功',
    '提现失败',
    '处理中'
];

/**
 * 所有列表页面
 */
export class BalanceLog extends Widget {
    public props: Props = {
        list: [
            // { name:'提现',time:'04-12 12:30',money:'-200.00' },
            // { name:'升级海宝',time:'04-12 12:30',money:'+100.00' }
        ],
        select:{
            num: 0,
            value: [new Date().getFullYear(), new Date().getMonth() + 1]
        }
    };

    public create() {
        super.create();
        this.getData();
    }

    /**
     * 获取列表数据
     */
    public getData() {
        const data = this.props.select.value;
        getBalanceList(data[0], data[1], 1).then(r => {
            if (r.value && r.value.length > 0) {
                const list = r.value.map((item,index) => {
                    // 提现记录需要获取进度
                    if (item[1] === CashLogType.withdraw) {
                        const i = index;  
                        getWithdrawStatus(item[3]).then(res => {
                            if (res.value[3] === 3) {  // 拒绝提现显示理由
                                this.props.list[i].status = `提现失败：${unicode2Str(res.value[6])}`;
                            } else {
                                this.props.list[i].status = Status[res.value[3]];
                            }
                            this.paint();
                        });
                    }

                    // 充值 购物 升级海宝付钱 记录隐藏
                    if (item[1] === CashLogType.recharge || item[1] === CashLogType.shopping || (item[1] === CashLogType.upHbao && item[2] < 0)) {  
                        return null;

                    } else {
                       
                        return {
                            name: getCashLogName(item[1]), 
                            time: timestampFormat(item[4], 4),
                            money: `${item[2] > 0 ? '+' :''}${priceFormat(item[2])}` , // 正数带个+
                            status:CashLogType.manage === item[1] ? unicode2Str(item[3]) :''
                        };
                    }

                });

                this.props.list = list;
            } else {
                this.props.list = [];
            }
            this.paint();
        });
    }

    // 选择年月
    public selectMon() {
        popNew('app-components-selectList-monSelectList', { selected: this.props.select.num }, (r) => {
            this.props.select = r;
            this.paint();
            this.getData();
        });
    }
}