import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
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
        list:[
            {
                left:'',
                right:'edit.png',
                name:'陈某某',
                tel:'12345678901',
                province:'四川省成都市高新区',
                address:'天府三街1140号17栋5-33号'
            },
            {
                left:'',
                right:'edit.png',
                name:'陈某某',
                tel:'12345678901',
                province:'四川省成都市高新区',
                address:'天府三街1140号17栋5-33号'
            },
            {
                left:'',
                right:'edit.png',
                name:'陈某某',
                tel:'12345678901',
                province:'四川省成都市高新区',
                address:'天府三街1140号17栋5-33号'
            },
            {
                left:'',
                right:'edit.png',
                name:'陈某某',
                tel:'12345678901',
                province:'四川省成都市高新区',
                address:'天府三街1140号17栋5-33号'
            }
        ],
        isChoose:false,
        selected:-1
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.initData();
    }

    public initData() {
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
        popNew('app-view-mine-editAddress',this.props.list[num]);
    }

    public addAddr() {
        popNew('app-view-mine-editAddress');
    }
}