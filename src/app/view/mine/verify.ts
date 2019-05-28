import { Widget } from '../../../pi/widget/widget';
import { getStore } from '../../store/memstore';

/**
 * 实名认证成功
 */
export class Verify extends Widget {
    public props:any; 
    
    public create() {
        super.create();
        const user = getStore('user');
        this.props = {
            realName:user.realName,
            IDcard:`${user.IDCard[0]}****************${user.IDCard[17]}`,
            avatar:user.avatar
        };
    }
}