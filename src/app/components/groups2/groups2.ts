import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { Groups } from '../../store/memstore';

interface Props {
    list:Groups[];   // 展示的分组列表2 长度只能是单数  由父元素控制传入的长度
}

/**
 * 首页显示分组样式1
 */
export class GroupsTwo extends Widget {
    // tslint:disable-next-line:no-unnecessary-override
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        // console.log('GroupsTwo ----------------',props);
    }

    public clickItem(e:any,index:number) {
        notify(e.node,'ev-click-groups-two',this.props.list[index].id); 
    }
}