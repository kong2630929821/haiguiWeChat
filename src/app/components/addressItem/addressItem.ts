import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
interface Props {
    left:string; // 左侧图片
    right:string;  // 右侧图片
    name:string;  // 姓名
    tel:string;  // 电话
    province:string; // 省、市、区
    address:string; // 地址
}
/**
 * 地址
 */
export class AddressItem extends Widget {
    public props:Props = {
        left:'address.png',
        right:'arrowRight.png',
        name:'陈某某',
        tel:'12345678901',
        province:'四川省成都市高新区',
        address:'天府三街1140号17栋5-33号'
    };

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
        console.log('hhhhhhhhhhhhhhh');
        notify(e.node,'ev-leftClick',null);
    }
}