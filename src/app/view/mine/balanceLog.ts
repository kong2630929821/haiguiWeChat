import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getBalanceList } from '../../net/pull';
import { getCashLogName, timestampFormat } from '../../utils/logic';
interface Props {
    list: any[];   // 当月数据
    select:{
        num:number;
        value:number[];
    };  // 选择的年月
}

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
                const list = r.value.map(item => {
                    return {
                        name: getCashLogName(item[1]), 
                        time: timestampFormat(item[4], 4),
                        money: item[2]
                    };
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