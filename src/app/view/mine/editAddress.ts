import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

/**
 * 编辑地址
 */
export class EditAddress extends Widget {
    public props:any = {
        name:'',
        tel:'',
        province:'',
        address:'',
        areaSelect:[]
    };

     // 选择省 市 区
    public selectArea() {
        popNew('app-components-areaSelect-areaSelect',{ selected:this.props.areaSelect },(r) => {
            if (r && r.length > 0) {
                this.props.areaSelect = r;
                const res = r.map(item => {
                    return item.name;
                });
                this.props.province = res.join('');
                this.paint();
            }
        });
    }
}