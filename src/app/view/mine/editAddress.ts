import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { PROVINCE_LIST } from '../../components/areaSelect/provinceList';
import { addAddress, delAddress } from '../../net/pull';
import { popNewMessage } from '../../utils/tools';

/**
 * 编辑地址
 */
export class EditAddress extends Widget {
    public ok:() => void;
    public props:any = {
        name:'',
        tel:'',
        province:'',
        address:'',
        areaSelect:[],
        area_id:0
    };

    public setProps(props:any,oldProps:any) {
        this.props = {
            ...this.props,
            ...props,
            province:this.getProvinceStr(props.area_id)
        };
        super.setProps(this.props);
    }
     // 选择省 市 区
    public selectArea() {
        popNew('app-components-areaSelect-areaSelect',{ selected:this.props.areaSelect },(r) => {
            console.log('areaSelect ',  r);
            if (r && r.length > 0) {
                this.props.area_id = Number(r[0].id.slice(0,2));
                this.props.areaSelect = r;
                const res = r.map(item => {
                    return item.name;
                });
                this.props.province = res.join('');
                this.paint();
            }
        });
    }
    public getProvinceStr(area_id:number) {
        for (let i = 0;i < PROVINCE_LIST.length;i++) {
            if (Number(PROVINCE_LIST[i].id.slice(0,2)) === area_id) return PROVINCE_LIST[i].name;
        }
    }
    public nameChange(res:any) {
        this.props.name = res.value;
    }

    public telChange(res:any) {
        this.props.tel = res.value;
    }

    public addressChange(res:any) {
        this.props.address = res.value;
    }
    // 添加地址
    public saveAddress() {
        if (!this.props.name) {
            popNewMessage('请输入收货人姓名');

            return;
        }

        if (!this.props.tel) {
            popNewMessage('请输入收货人电话');
            
            return;
        }

        if (!this.props.province) {
            popNewMessage('请选择地区');
            
            return;
        }

        if (!this.props.address) {
            popNewMessage('请输入收货人地址详情');
            
            return;
        }
        addAddress(this.props.name,this.props.tel,this.props.area_id,`${this.props.province}${this.props.address}`).then(() => {
            popNewMessage('保存成功');
            this.ok && this.ok();
        });
    }

    public delAddress() {
        delAddress(this.props.id).then(() => {
            popNewMessage('删除成功');
            this.ok && this.ok();
        });
    }
}