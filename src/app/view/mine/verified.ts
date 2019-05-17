import { Widget } from '../../../pi/widget/widget';
import { serverFilePath } from '../../config';
import { identifyIDCard, verifyIDCard } from '../../net/pull';
import { popNewLoading, popNewMessage } from '../../utils/tools';
interface Props {
    name:string;  // 姓名
    card:string;  // 身份证号码
    validDate:string;  // 身份证有效期
    front:string; // 身份证正面照ID
    back:string;  // 身份证正面照ID
}
/**
 * 实名认证
 */
export class Verified extends Widget {
    public ok:(fg:boolean) => void;
    public props:Props = {
        name:'真实姓名',
        card:'身份证号',
        validDate:'身份证有效期',
        front:'',
        back:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const loadding = popNewLoading('图片识别中');
        identifyIDCard(serverFilePath + this.props.front).then(res => {
            const data = JSON.parse(res.body);
            this.props.name = data.name;
            this.props.card = data.id;

            identifyIDCard(serverFilePath + this.props.back).then(res => {
                loadding && loadding.callback(loadding.widget);
                const data = JSON.parse(res.body);
                this.props.validDate = data.valid_date;
                this.paint();
            });
        });

    }
    
    public verify() {
        if (this.props.name && this.props.card && this.props.validDate) {
            const loadding = popNewLoading('身份认证中');
            verifyIDCard(this.props.name,this.props.card,this.props.front,this.props.back,this.props.validDate).then(() => {
                loadding && loadding.callback(loadding.widget);
                popNewMessage('实名认证成功');
                this.ok && this.ok(true);

            }).catch(() => {
                popNewMessage('实名认证失败');
                loadding && loadding.callback(loadding.widget);
                this.ok && this.ok(false);
            });
            
        } else {
            popNewMessage('信息有误，重新上传');
            this.ok && this.ok(false);
        }
    }
}