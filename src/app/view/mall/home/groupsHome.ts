import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { Level1Groups, register } from '../../../store/memstore';
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
            ...props
        };
        super.setProps(this.props);
    }

    // 一级分组点击
    public clickLevel1Item(e:any,id:number) {
        this.state.activeId = id;
        this.paint();
    }

    // 二级分组点击
    public clickLevel2Item(e:any,id:number) {
        const level1Group = this.state.groups.get(this.state.activeId);
        const selectedLevel1Groups = level1Group;
        const selectedLevel2Groups = level1Group.childs.get(id);
        popNew('app-view-mall-goodsList',{ selectedLevel1Groups,selectedLevel2Groups,styleMod:StyleMod.TWO });
    }
}

const STATE = {
    groups:new Map<number, Level1Groups>(),     // 所有分组信息 
    activeId:0                                 // 选择的一级分组id
};
// 分组信息监听
register('mall/groups',(groups:Map<number, Level1Groups>) => {   
    const groupsArray = [...groups];
    STATE.groups = groups;
    STATE.activeId = groupsArray[0][1].id;
    forelet.paint(STATE);
});