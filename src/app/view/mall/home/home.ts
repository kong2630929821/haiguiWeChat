import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { GroupsLocation } from '../../../config';
import { Level1Groups, Level2Groups, register } from '../../../store/memstore';
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
            ...props
        };
        super.setProps(this.props);
    }

    // 位置1轮播图点击事件
    public slideClick(id:number) {
        console.log('轮播图被点击 ====',id);
        this.gotoGoodsList(id);
    }

    // 位置2分组点击
    public groupsOneClick(id:number) {
        console.log('groupsOne ====',id);
        this.gotoGoodsList(id);
    }

    // 位置3分组点击
    public groupsTwoClick(id:number) {
        console.log('groupsTow ====',id);
        this.gotoGoodsList(id);
    }

    public gotoGoodsList(id:number) {
        const selectedLevel1Groups = this.state.groups.get(id);
        const selectedLevel2Groups = [...selectedLevel1Groups.childs][0][1];
        popNew('app-view-mall-goodsList',{ selectedLevel1Groups,selectedLevel2Groups,styleMod:StyleMod.ONE });
    }
}

const STATE = {
    groups:new Map<number, Level1Groups>(),     // 所有分组信息
    firstGroups:[],                             // 位置1的（轮播图）分组信息
    secondGroups:[],                           // 位置2的分组信息
    thirdGroups:[]                            // 位置3的分组信息
};

// 分组信息监听
register('mall/groups',(groups:Map<number, Level1Groups>) => {   
    console.log('mall groups =',groups);
    const firstGroups = [];
    const secondGroups = [];
    const thirdGroupsSimple = [];
    const thirdGroups = [];
    groups.forEach(value => {
        const location = value.location;
        if (location === GroupsLocation.FIRST) {
            firstGroups.push(value);
        } else if (location === GroupsLocation.SECOND) {
            secondGroups.push(value);
        } else if (location === GroupsLocation.THIRD) {
            thirdGroupsSimple.push(value);
        }
    });

    // 对位置3的分组信息做处理
    const max = 5;
    const len = thirdGroupsSimple.length;
    const remainder = len % max;
    const minLen = Math.floor(len / max);
    for (let i = 0;i < minLen;i++) {
        thirdGroups.push(thirdGroupsSimple.slice(i * max,(i + 1) * max));
    }
    if (remainder === 1) {
        thirdGroups.push(thirdGroupsSimple.slice(len - 1));
    } else if (remainder === 2) {
        thirdGroups.push(thirdGroupsSimple.slice(len - 2,len - 1));
        thirdGroups.push(thirdGroupsSimple.slice(len - 1));
    } else if (remainder === 4) {
        thirdGroups.push(thirdGroupsSimple.slice(len - 3));
    } else if (remainder === 5) {
        thirdGroups.push(thirdGroupsSimple.slice(len - 3,len - 1));
        thirdGroups.push(thirdGroupsSimple.slice(len - 1));
    }
    STATE.groups = groups;
    STATE.firstGroups = firstGroups;
    STATE.secondGroups = secondGroups;
    STATE.thirdGroups = thirdGroups;
    forelet.paint(STATE);
});