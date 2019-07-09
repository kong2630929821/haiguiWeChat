import { Widget } from '../../../pi/widget/widget';
interface Props {
    selected:number; // 选中的下标
    list:any[];
}
/**
 * 退货理由选择
 */
export class ReasonSelectList extends Widget {
    public cancel:() => void;
    public ok:(param:any) => void;
    public props:Props;

    public select(num:number) {
        this.props.selected = num;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok({ value:this.props.list[num],num:num });
        }, 200);
    }

    public close() {
        this.cancel && this.cancel();
    }
}