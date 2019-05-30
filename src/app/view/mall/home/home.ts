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
 * 商城首页
 */
export class MallHome extends Widget {
    public state:any;
    public create() {
        super.create();
        this.state = STATE;
    }

    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props,
            GroupsLocation,
            getFixLocationGroup,
            getImageThumbnailPath,
            mallImagPre
        };
        super.setProps(this.props);
    }

    // 分组点击
    public groupsClick(res:any) {
        console.log('分组被点击 ====',res.group);
        this.gotoGoodsList(res.group);
    }

    // 固定位置分组点击
    public groupsLocationClick(e:any,location:GroupsLocation) {
        const group = this.state.groups.get(location)[0];
        this.groupsClick({ group });
    }

    public gotoGoodsList(group:Groups) {
        const selectedLevel1Groups = group;
        const selectedLevel2Groups = selectedLevel1Groups.childs[0];
        popNew('app-view-mall-goodsList',{ selectedLevel1Groups,selectedLevel2Groups,styleMod:StyleMod.ONE });
    }
}

const STATE = {
    groups:new Map<GroupsLocation, Groups[]>()     // 所有分组信息
};

// 分组信息监听
register('mall/groups',(groups:Map<GroupsLocation, Groups[]>) => {   
    STATE.groups = groups;
    forelet.paint(STATE);
});

/**
 * 获取固定位置的分组
 */
const getFixLocationGroup = (groups:Map<GroupsLocation, Groups[]>,location:GroupsLocation) => {
    const group = groups.get(location);

    return  group ? group[0] : undefined;
};