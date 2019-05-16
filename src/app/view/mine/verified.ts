import { Widget } from '../../../pi/widget/widget';
import { verifyIDCard } from '../../net/pull';
import { popNewMessage } from '../../utils/tools';
interface Props {
    name:string;  // 姓名
    card:string;  // 身份证号码
    sid:string;  // 身份证图片sid
}
/**
 * 实名认证
 */
export class Verified extends Widget {
    public ok:(fg:boolean) => void;
    public props:Props = {
        name:'',
        card:'',
        sid:''
    };
    
    public verify() {
        if (this.props.name && this.props.card && this.props.sid) {
            verifyIDCard(this.props.name,this.props.card,this.props.sid).then(res => {
                popNewMessage('实名认证成功');
                this.ok && this.ok(true);
            });
        } else {
            popNewMessage('信息有误，重新上传');
            this.ok && this.ok(false);
        }
    }
}