import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { mallImagPre } from '../../../config';
import { Groups, GroupsLocation, register } from '../../../store/memstore';
import { getImageThumbnailPath } from '../../../utils/tools';
import { StyleMod } from '../goodsList';

export const forelet = new Forelet();

interface Props {
    isActive:boolean;
}
/**
 * 分类首页
 */
export class GroupsHome extends Widget {
    public state:any;
    public props:any;
    public create() {
        super.create();
        this.state = STATE;
    }
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props,
            getImageThumbnailPath,
            mallImagPre
        };
        super.setProps(this.props);
    }

    // 一级分组点击
    public clickLevel1Item(e:any,index:number) {
        this.state.activeIndex = index;
        this.paint();
    }

    // 二级分组点击
    public clickLevel2Item(e:any,index:number) {
        const level1Group = this.state.groups[this.state.activeIndex];
        const selectedLevel1Groups = level1Group;
        const selectedLevel2Groups = level1Group.childs[index];
        popNew('app-view-mall-goodsList',{ selectedLevel1Groups,selectedLevel2Groups,styleMod:StyleMod.TWO });
    }
}

const STATE = {
    groups:[],     // 所有分组信息 
    activeIndex:0                                 // 选择的一级分组id
};
// 分组信息监听
register('mall/groups',(groups:Map<GroupsLocation, Groups[]>) => {   
    const thisGroups = groups.get(GroupsLocation.CLASSIFICATION);
    STATE.groups = thisGroups;
    forelet.paint(STATE);
});