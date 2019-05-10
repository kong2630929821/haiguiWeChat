import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

/**
 * 填信息输入框弹窗
 */
export class ModalBoxInput extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:any = {
        selectAddr:true,
        inputMess:'',
        area:'',
        areaSelect:[]
    };

    // 取消
    public close() {
        this.cancel && this.cancel();
    }

    // 确认
    public confirm() {
        this.ok && this.ok();
    }

    // 选择省 市 区
    public selectArea() {
        popNew('app-components-areaSelect-areaSelect',{ selected:this.props.areaSelect },(r) => {
            if (r && r.length > 0) {
                this.props.areaSelect = r;
                const res = r.map(item => {
                    return item.name;
                });
                this.props.area = res.join('');
                this.paint();
            }
        });
    }
}