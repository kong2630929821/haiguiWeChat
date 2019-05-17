import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { Address, getStore, register } from '../../store/memstore';

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
    public ok:(index:number) => void;
    public setProps(props:Props) {
        const list = getStore('mall/addresses');
        let selected = Number(localStorage.getItem('addressIndex')) || 0;
        if (selected > list.length) selected = 0;
        this.props = {
            ...props,
            list,
            selected
        };
        super.setProps(this.props);
    }

    // 点击左侧按钮
    public leftClick(num:number) {
        console.log(num);
        this.props.selected = num;
        localStorage.setItem('addressIndex',num.toString());
        this.paint();
        setTimeout(() => {
            this.ok && this.ok(num);
        },50);
    }

    // 点击按钮
    public itemClick(num:number) {
        console.log(num);
        popNew('app-view-mine-editAddress',{ ...this.props.list[num],onlyDel:true });
    }

    public addAddr() {
        popNew('app-view-mine-editAddress');
    }
    public updateAddress(addresses:Address[]) {
        this.props.list = addresses;
        this.paint();
    }
}

register('mall/addresses',(addresses:Address[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateAddress(addresses);
});