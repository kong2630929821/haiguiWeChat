import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getStore, register } from '../../store/memstore';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    list:any[]; // 地址列表
    isChoose:boolean;  // 是否选择地址
    selected:number; // 选中的下标
}
/**
 * 收货地址列表
 */
export class AddressList extends Widget {
    public props:Props = {
        list:[],
        isChoose:false,
        selected:-1
    };
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        this.initData();
        super.setProps(this.props);
    }

    public initData() {
        this.props.list = getStore('mall/addresses');
        if (this.props.isChoose) {
            this.props.list = this.props.list.map((item,ind) => {
                const left = this.props.selected === ind ? 'selectBox_active.png' :'selectBox.png';

                return {
                    ...item,
                    left
                };
            });
        }
    }

    // 点击左侧按钮
    public leftClick(num:number) {
        console.log(num);
        this.props.selected = num;
        this.initData();
        this.paint();
    }

    // 点击右侧按钮
    public rightClick(num:number) {
        console.log(num);
        popNew('app-view-mine-editAddress',{ ...this.props.list[num],onlyDel:true });
    }

    public addAddr() {
        popNew('app-view-mine-editAddress');
    }
}

register('mall/addresses',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
    w && w.paint();
});