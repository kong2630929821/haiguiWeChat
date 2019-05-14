import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { Groups } from '../../store/memstore';
import { getImageThumbnailPath } from '../../utils/tools';

interface Props {
    list:Groups[];   // 展示的分组列表1
}

/**
 * 首页显示分组样式1
 */
export class GroupsOne extends Widget {
    // tslint:disable-next-line:no-unnecessary-override
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props,
            getImageThumbnailPath
        };
        super.setProps(this.props,oldProps);
        // console.log('GroupsOne ----------------',props);
    }

    public clickItem(e:any,index:number) {
        notify(e.node,'ev-click-groups-one',{ group:this.props.list[index] }); 
    }
}