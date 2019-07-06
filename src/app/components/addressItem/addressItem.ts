import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { Address } from '../../store/memstore';
import { addressFormat } from '../../utils/tools';
interface Props {
    left:string; // 左侧图片
    right:string;  // 右侧图片
    address:Address;
    defaultFlag:boolean;// 默认标识
}
/**
 * 地址
 */
export class AddressItem extends Widget {
    public setProps(props:Props,oldProps:Props) {
        const addressShow = addressFormat(props.address.address);
        this.props = {
            right:'edit.png',
            ...props,
            addressShow
        };
        super.setProps(this.props);
        console.log('AddressItem =======',this.props);
        
    }

    // 点击整个区域
    public itemClick(e:any) {
        notify(e.node,'ev-itemClick',null);
    }

    // 点击右侧图片
    public rightImg(e:any) {
        notify(e.node,'ev-rightClick',null);
    }

    // 点击左侧图片
    public leftImg(e:any) {
        console.log('hhhhhhhhhhhhhhh',e);
        notify(e.node,'ev-leftClick',null);
        
    }
}
