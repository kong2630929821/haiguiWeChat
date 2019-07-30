import { Widget } from '../../../pi/widget/widget';
import { popNewMessage } from '../../utils/tools';
interface Props {
    title:string;
    sureText:string;
    cancelText:string;
    placeHolder:string;
    message:string;   // 输入内容
}
/**
 * 模态框
 * {title:"提示",content:"温馨提示",sureText:"sure",cancelText:"cancel",itype:"text"}
 * title：标题
 * sureText:确认按钮名称
 * cancelText：取消按钮名称
 */
export class ModalBox extends Widget {
    public ok: (mess:string) => void;
    public cancel: () => void; 
    public props: Props = {
        title:'',
        sureText:'确认',
        cancelText:'取消',
        placeHolder:'',
        message:''
    };
    
    public setProps(props:any) {
        this.props = { 
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        
    }

    // 点击取消按钮
    public cancelBtnClick() {
        this.cancel && this.cancel();
    }

    // 点击确认按钮
    public okBtnClick() {
        if (!this.props.message) {
            popNewMessage('请输入运单号');

            return;
        }
        const reg = /^[0-9a-zA-Z]+$/;
        if (!reg.test(this.props.message)) {
            popNewMessage('请输入字母或数字');

            return;
        }
        this.ok && this.ok(this.props.message);
    }

    // 输入内容
    public messChange(e:any) {
        this.props.message = e.value;
    }
    
}