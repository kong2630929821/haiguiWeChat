import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getStore } from '../../store/memstore';
import { getLastAddress } from '../../utils/logic';
import { popNewMessage } from '../../utils/tools';
/**
 * 领取礼包填写地址
 */
export class FillAddrModalBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:any = {
        address:getLastAddress()[2]
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    // 选择地址
    public selAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true },(index:number) => {
            this.props.address = getStore('mall/addresses')[index];
            this.paint();
        });
    }

    // 确认
    public confirm() {
        if (this.props.address) {
            this.ok && this.ok();
        } else {
            popNewMessage('请选择地址');
        }
    }

    // 取消
    public close() {
        this.cancel && this.cancel();
    }
}