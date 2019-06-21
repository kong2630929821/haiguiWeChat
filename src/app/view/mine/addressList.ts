import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { Address, getStore, register } from '../../store/memstore';
import { getLastAddress } from '../../utils/logic';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    list:any[]; // 地址列表
    isChoose:boolean;  // 是否选择地址
    selected:number; // 选中的下标
    defaultAddrId:number;// 默认地址的ID
}
/**
 * 收货地址列表
 */
export class AddressList extends Widget {
    public ok:(num:number) => void;
    public setProps(props:Props) {
        const addr = getLastAddress();
        this.props = {
            ...props,
            list:addr[0],
            selected:addr[1]
        };
        super.setProps(this.props);
        this.props.defaultAddrId = JSON.parse(localStorage.getItem('addressIndex'));
    }

    // 点击左侧按钮
    public leftClick(num:number) {
        console.log(num);
        this.props.selected = num;
        if (this.props.defaultAddrId === '') {
            localStorage.setItem('addressIndex',num.toString());
        } 
        this.paint();
        setTimeout(() => {
            this.ok && this.ok(num);
        },50);
    }

    // 点击按钮
    public itemClick(num:number) {
        console.log(num);
        popNew('app-view-mine-editAddress',{ ...this.props.list[num],onlyDel:false,changeAddr:true,num },() => {
            // const address = getStore('mall/addresses');
            // localStorage.setItem('addressIndex',(address.length - 1).toString());
            if (this.props.isChoose) {
                this.ok && this.ok(num);
            }
        });
    }

    public addAddr() {
        popNew('app-view-mine-editAddress',undefined,() => {
            const address = getStore('mall/addresses');
            // localStorage.setItem('addressIndex',(address.length - 1).toString());
            if (this.props.isChoose) {
                this.ok && this.ok(address.length - 1);
            }
        });
    }
    public updateAddress(addresses:Address[]) {
        this.props.list = addresses;
        this.props.defaultAddrId = JSON.parse(localStorage.getItem('addressIndex'));
        this.paint();
    }
}

register('mall/addresses',(addresses:Address[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateAddress(addresses);
});