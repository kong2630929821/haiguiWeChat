import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getEarningList } from '../../net/pull';
import { getCashLogName, timestampFormat } from '../../utils/logic';
import { priceFormat } from '../../utils/tools';
import { PageFg } from './home/home';
interface Props {
    list: any[];
    title: string;  // 头部标题
    amount: number;  // 总数
    select: {
        num:number;
        value:number[];
    };  // 选中的年月
    orgList: any[];
    fg: string; // 进入此页面标记
}
/**
 * 所有列表页面
 */
export class LogList extends Widget {
    public props: Props = {
        list: [
            // { name:'提现',time:'04-12 12:30',money:'-200.00' },
            // { name:'升级海宝',time:'04-12 12:30',money:'+100.00' }
        ],
        title: '======',
        amount: 0,
        select: {
            num: 0,
            value: [new Date().getFullYear(), new Date().getMonth() + 1]
        },
        orgList: [],
        fg: PageFg.cash
    };

    public setProps(props: any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        if (props.fg === PageFg.cash) {
            this.getData(1);
        } else {
            this.getData(2);
        }
    }

    /**
     * 获取列表数据
     * itype  1:现金,2:海贝,3:积分
     */
    public getData(itype: number) {
        const date = this.props.select.value;
        getEarningList(date[0], date[1], itype).then(r => {
            this.props.orgList = r.value;
            if (r.value && r.value.length > 0) {
                this.props.list = r.value.map(item => {
                    return {
                        name: getCashLogName(item[2]),
                        time: timestampFormat(item[5], 4),
                        // tslint:disable-next-line:prefer-template
                        money: `${itype === 1 ? '￥' + priceFormat(item[3]) :item[3]}`
                    };
                });
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
            if (this.props.fg === PageFg.cash) {
                this.getData(1);
            } else {
                this.getData(2);
            }
        });
    }
}