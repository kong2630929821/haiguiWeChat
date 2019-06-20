// tslint:disable-next-line:missing-jsdoc
import { Widget } from '../../../pi/widget/widget';
import { getCollectList } from '../../net/pull';
interface Props {
    collectList:any; 
}
// tslint:disable-next-line:completed-docs
export class Favorites extends Widget {
    public setProps(props:Props) {
        this.props = {
            ...props,
            collectList:[]
        };
        getCollectList().then(r => {
            console.log(r);
        });
    }
}