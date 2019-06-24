import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { PROVINCE_LIST } from '../../components/areaSelect/provinceList';
import { parseAddress2 } from '../../net/parse';
import { addAddress, delAddress, setDefaultAddr, updateAddress } from '../../net/pull';
import { getStore, setStore } from '../../store/memstore';
import { checkPhone, popNewLoading, popNewMessage } from '../../utils/tools';

/**
 * 编辑地址
 */
export class EditAddress extends Widget {
    public ok:() => void;
    public props:any = {
        name:'',
        tel:'',
        province:[],
        address:'',
        areaSelect:[],
        area_id:0,
        defaultAddr:false
    };

    public setProps(props:any,oldProps:any) {
        let province = [];
        let address = '';
        if (props.address) {
            const addr = JSON.parse(props.address);
            province = addr[0];
            address = addr[1];
        }
        
        this.props = {
            ...this.props,
            ...props,
            province,
            address
        };
        super.setProps(this.props);
        const id = JSON.parse(localStorage.getItem('addressIndex'));
        // 判断是否是默认收货地址
        if (id === this.props.num) {
            this.props.defaultAddr = true;
        } else {
            this.props.defaultAddr = false;
        }
    }
     // 选择省 市 区
    public selectArea() {
        popNew('app-components-areaSelect-areaSelect',{ selected:this.props.areaSelect },(r) => {
            console.log('areaSelect ',  r);
            if (r && r[0] && r[0].id) {
                this.props.area_id = Number(r[0].id.slice(0,2));
                this.props.areaSelect = r;
                const res = r.map(item => {
                    if (item.id) {
                        return item.name;
                    } else {
                        return '';
                    }
                    
                });
                this.props.province = res;
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
        // 添加地址
        if (!this.props.name) {
            popNewMessage('请输入收货人姓名');

            return;
        }

        if (!checkPhone(this.props.tel)) {
            popNewMessage('电话号码格式不正确');
            
            return;
        } 

        if (this.props.province.length === 0) {
            popNewMessage('请选择地区');
            
            return;
        }

        if (!this.props.address) {
            popNewMessage('请输入收货人地址详情');
            
            return;
        }
        // 判断是修改地址还是添加  true为修改 flase为添加
        if (this.props.changeAddr) {
           // 修改地址
            console.log(this.props.id);
            const close = popNewLoading('正在修改');
            const address = [this.props.province,this.props.address];
            const id = JSON.parse(localStorage.getItem('addressIndex'));
            updateAddress(this.props.name,this.props.tel,this.props.area_id,`${JSON.stringify(address)}`,this.props.id).then(async (r) => {
                let data = r.addressInfo;
                if (this.props.defaultAddr) {
                    localStorage.setItem('addressIndex','0');
                    await setDefaultAddr(this.props.id).then(res => {
                        console.log('1111111111111111111111111111',res);
                        data = res.addressInfo;
                    });
                } else if (id === this.props.num) {
                    localStorage.setItem('addressIndex','-1');
                }
                const addresses = parseAddress2(data);
                console.log('changeAddress ======',addresses);
                setStore('mall/addresses',addresses);
                this.ok && this.ok();
                popNewMessage('修改成功');
                close.callback(close.widget);
            }).catch(() => {
                popNewMessage('修改失败');
                close.callback(close.widget);
            });
        } else {
            const close = popNewLoading('正在添加');
            const address = [this.props.province,this.props.address];
            addAddress(this.props.name,this.props.tel,this.props.area_id,`${JSON.stringify(address)}`).then(async (r) => {
                let data = r.addressInfo;
                // 判断是否设置为默认地址
                if (this.props.defaultAddr) {
                    localStorage.setItem('addressIndex','0');
                    await setDefaultAddr(data[data.length - 1][0]).then(res => {
                        console.log('1111111111111111111111111111',res);
                        data = res.addressInfo;
                    });
                }
                const addresses = parseAddress2(data);
                console.log('addAddress ======',addresses);
                setStore('mall/addresses',addresses);
                this.ok && this.ok();
                popNewMessage('保存成功');
                close.callback(close.widget);
            }).catch(() => {
                popNewMessage('保存失败');
                close.callback(close.widget);
            });
        }
    }

    public delAddress() {
        delAddress(this.props.id).then(() => {
            this.ok && this.ok();
            popNewMessage('删除成功');
        });
    }

    // 设置为默认地址
    public leftImg() {
        if (this.props.defaultAddr) {
            this.props.defaultAddr = false;
        } else {
            this.props.defaultAddr = true;
        }
        this.paint();
    }
}