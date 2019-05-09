import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getHBaoList, getPartnerList } from '../../net/pull';
import { PageFg } from './home/home';
interface Props {
    list: any[];
    title: string;  // 标题
    amount: number;  // 总数
    orgList: any[];  // 原始列表
    fg: string;  // 进入此页面的标记
}
export const foelet = new Forelet();
/**
 * 所有列表页面
 */
export class LogList extends Widget {
    public props: Props = {
        list: [
            // { name:'微信名微信名',desc:'我的本月收益：315.00',tel:'13200013252' },
            // { name:'微信名微信名',desc:'我的本月收益：315.00',tel:'13200013252' },
            // { name:'微信名微信名',desc:'我的本月收益：315.00',tel:'13200013252' }
        ],
        title: '======',
        amount: 0,
        orgList: [],
        fg: PageFg.baby
    };

    public setProps(props: any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        if (props.fg === PageFg.baby) {
            getHBaoList().then(r => {
                console.log('=================getHBaoList', r.value);
                this.props.orgList = r.value;
                if (r.value && r.value.length > 0) {
                    this.props.list = r.value.map(item => {
                        return {
                            name: '微信名',  // item[0]
                            desc: `我的本月收益：${item[5].toFixed(2)}`,
                            tel: '12345678901' // item[1]
                        };
                    });
                } else {
                    this.props.list = [];
                }
                this.paint();
            });
        } else {
            getPartnerList().then(r => {
                console.log('=================getPartnerList', r.value);
                this.props.orgList = r.value;
                if (r.value && r.value.length > 0) {
                    this.props.list = r.value.map(item => {
                        return {
                            name: '微信名',  // item[0]
                            desc: `我的本月收益：${item[3].toFixed(2)}`,
                            tel: '12345678901' // item[1]
                        };
                    });
                } else {
                    this.props.list = [];
                }
                this.paint();
            });
        }
    }

    public goDetail(num: number) {
        const item = this.props.orgList[num];
        let list = [];
        if (this.props.fg === PageFg.baby) {
            list = [
                { key: '海宝', value: item[0] || '微信名' },
                { key: '电话', value: item[1] || '12345678901' },
                { key: 'ta的海宝数量', value: `${item[2]}个` },
                { key: 'ta的本月收益', value: item[3] },
                { key: 'ta的总收益', value: item[4] },
                { key: '我的本月收益', value: item[5] },
                { key: '我的总收益', value: item[6] }
            ];
        } else {
            list = [
                { key: '海王', value: item[0] || '微信名' },
                { key: '电话', value: item[1] || '12345678901' },
                { key: '海宝数量', value: `${item[2]}个` },
                { key: '我的本月收益', value: item[3] },
                { key: '我的总收益', value: item[4] }
            ];
        }

        popNew('app-view-member-logDetail', { list });
    }
}