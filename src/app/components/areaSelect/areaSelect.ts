import { Widget } from '../../../pi/widget/widget';
import { CITY_LIST } from './cityList';
import { COUNTRY_LIST } from './countryList';
import { PROVINCE_LIST } from './provinceList';
interface Props {
    showList:any[];  // 显示的列表
    selected:any[];  // 选择的地区 省 市 区
    activeNum:number;  // 活跃的下标 
    activeStr:string;
}
/**
 * 地区选择器
 */
export class AreaSelect extends Widget {
    public ok:(fg:any) => void;
    public props:Props = {
        showList:PROVINCE_LIST,
        selected:[{ name:'请选择' }],
        activeNum:0,
        activeStr:'请选择'
    };

    public setProps(props:any) {
        if (props.selected && props.selected.length > 0) {
            this.props.selected = props.selected;
            this.props.activeNum = props.selected.length - 1;
            this.init();
        }
        super.setProps(this.props);
        
    }

    // 刷新数据
    public init() {
        let list = this.props.showList;
        if (this.props.activeNum === 0) {
            list = CITY_LIST[this.props.selected[0].id];
            list = list || [];
            this.props.selected.push({ name:'请选择城市' });
            this.props.activeStr = '请选择城市';
            
        } else if (this.props.activeNum === 1) {
            list = COUNTRY_LIST[this.props.selected[1].id];
            list = list || [];
            this.props.selected.push({ name:'请选择区/县' });
            this.props.activeStr = '请选择区/县';

        } else {
            list = COUNTRY_LIST[this.props.selected[1].id];
            list = list || [{
                city: this.props.selected[1].name, 
                name: this.props.selected[1].name.substring(0,this.props.selected[1].name.length - 1), 
                id: this.props.selected[1].id
            }];
            this.props.activeStr = this.props.selected[2].name;
        }
        this.props.showList = list;
    }

    // 选择
    public select(num:number) {
        this.props.selected.splice(this.props.activeNum);
        this.props.selected.push(this.props.showList[num]);
        this.init();
        if (this.props.activeNum === 2) {
            this.close();
        }
        this.props.activeNum++;
        this.paint();
    }

    // 返回前面的列表
    public back(num:number) {
        this.props.activeNum = num;
        if (num === 0) {  // 点击省
            this.props.showList = PROVINCE_LIST;
            this.props.activeStr = this.props.selected[0].name;
        } else if (num === 1) {  // 点击市
            this.props.showList = CITY_LIST[this.props.selected[0].id];
            this.props.activeStr = this.props.selected[1].name;
        } else {  // 点击县
            this.props.showList = COUNTRY_LIST[this.props.selected[1].id];
            this.props.activeStr = this.props.selected[2].name;
        }
        this.paint();
    }

    // 关闭页面
    public close() {
        this.ok && this.ok(this.props.selected);
    }
}