import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { mallImagPre } from '../../config';
import { getStore, Groups, GroupsLocation } from '../../store/memstore';
import { getImageMainPath } from '../../utils/tools';

export const forelet = new Forelet();

interface Props {
    styleMod:StyleMod;                    // 样式
    selectedLevel1Groups:Groups;   // 选中的一级分组
    selectedLevel2Groups:Groups;   // 选中的二级分组
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
            classificationGroups:getStore('mall/groups').get(GroupsLocation.CLASSIFICATION),    // 分类页一级分组
            level1GroupsExpanded:false,   // 是否展开一级分组下拉页
            getImageMainPath,
            mallImagPre
        };
        super.setProps(this.props);
        console.log('GoodsList ====',this.props);
    }

    public attach() {
        super.attach();
        const viewPortWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const activeDom:HTMLElement = document.querySelector('.groups2-item-active');
        const rect = activeDom.getBoundingClientRect();
        const offsetLeft = activeDom.offsetLeft;
        console.log('offsetLeft ======',activeDom.offsetLeft);
        console.log('viewPortWidth ===',viewPortWidth);
        // console.log('rect ===',rect);
        // const overFlowWidth = rect.right + rect.width - viewPortWidth;
        const overFlowWidth = offsetLeft + rect.width - viewPortWidth;
        console.log('overFlowWidth ====',overFlowWidth);
        if (overFlowWidth > 0) {   // 元素不在可视范围内
            const groups2Dom = document.querySelector('.groups2');
            groups2Dom.scrollLeft = overFlowWidth;
        }
    }
    
    // 一级分组页切换
    public level1GroupsExpandedClick() {
        this.props.level1GroupsExpanded = !this.props.level1GroupsExpanded;
        this.paint();
    }

    // 选择一级分组
    public selectLevel1Groups(e:any,index:number) {
        const selectedLevel1Groups = this.props.classificationGroups[index];
        this.props.selectedLevel1Groups = selectedLevel1Groups;
        this.props.selectedLevel2Groups = selectedLevel1Groups.childs[0];
        this.props.level1GroupsExpanded = false;
        this.paint();
    }

    // 选择二级分组
    public selectLevel2Groups(e:any,index:number) {
        this.props.selectedLevel2Groups = this.props.selectedLevel1Groups.childs[index];
        this.paint();
    }

    public goodsItemClick(e:any,index:number) {
        popNew('app-view-mall-goodsDetail',{ goods:this.props.selectedLevel2Groups.childs[index] });
    }
}
