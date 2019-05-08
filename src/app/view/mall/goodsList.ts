import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getStore, Level1Groups, Level2Groups } from '../../store/memstore';

export const forelet = new Forelet();

interface Props {
    styleMod:StyleMod;                    // 样式
    selectedLevel1Groups:Level1Groups;   // 选中的一级分组
    selectedLevel2Groups:Level2Groups;   // 选中的二级分组
}

export enum StyleMod {     // 样式
    ONE = 1,
    TWO = 2
}
/**
 * 商品列表页
 */
export class GoodsList extends Widget {
    public props:any;
   
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props,
            allStyleMod:StyleMod,
            groups:getStore('mall/groups'),
            level1GroupsExpanded:false   // 是否展开一级分组下拉页
        };
        super.setProps(this.props);
    }

    // 一级分组页切换
    public level1GroupsExpandedClick() {
        this.props.level1GroupsExpanded = !this.props.level1GroupsExpanded;
        this.paint();
    }

    // 选择一级分组
    public selectLevel1Groups(e:any,id:number) {
        const selectedLevel1Groups = this.props.groups.get(id);
        this.props.selectedLevel1Groups = selectedLevel1Groups;
        this.props.selectedLevel2Groups = [...selectedLevel1Groups.childs][0][1];
        this.props.level1GroupsExpanded = false;
        this.paint();
    }

    // 选择二级分组
    public selectLevel2Groups(e:any,id:number) {
        this.props.selectedLevel2Groups = this.props.selectedLevel1Groups.childs.get(id);
        this.paint();
    }
}
