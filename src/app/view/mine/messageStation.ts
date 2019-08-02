import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getAllMessage } from '../../net/pull';
import { getStore,register } from '../../store/memstore';
export const forelet = new Forelet();
interface Props {
    refresh:boolean;
}
/**
 * 消息站
 */
export class MessageStation extends Widget {
    public props:Props = {
        refresh:false
    };
    public create() {
        super.create();
        this.state  = getStore('message',[]);
    }

    /**
     * 页面滑动，加载更多数据
     */
    public getMoreList() {
        if (this.props.refresh) return;
        const oh1 = document.getElementById('message-list').offsetHeight;
        const oh2 = document.getElementById('messageList-items').offsetHeight;
        const scrollTop = document.getElementById('message-list').scrollTop; 
        if (oh2 - oh1 - scrollTop < -38) {
            this.props.refresh = true;
            const id = this.state[this.state.length - 1].id;
            getAllMessage(id,10).then(r => {
                this.state.push(...r);
                this.props.refresh = false;
                this.paint();
            });
        } 
        this.paint();
    }

}
register('message',r => {
    forelet.paint(r);
});