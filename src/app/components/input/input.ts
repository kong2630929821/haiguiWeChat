import { userAgent } from '../../../pi/util/html';
import { notify } from '../../../pi/widget/event';
import { getRealNode, paintCmd3, paintWidget } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    input?:string;
    placeHolder?:string;
    disabled?:boolean;
    clearable?:boolean;
    itype?:string;
    style?:string;
    autofocus?:boolean;
    maxLength?:number;
}
interface State {
    currentValue:string;
    focused:boolean;
    showClear:boolean;
    inputLock:boolean; // 中文输入结束标记，未结束时不执行change方法
}
/**
 * 输入框的逻辑处理
 * {input:"",placehold:"",disabled:false,clearable:false,itype:"text",style:"",autofacus:false,maxLength:1}
 * input?: 初始内容
 * placeHolder?: 提示文字
 * disabled?: 是否禁用
 * clearable?: 是否可清空
 * itype?: 输入框类型 text number password integer
 * style?: 样式
 * autofocus?: 是否自动获取焦点
 * maxLength?: 输入最大长度，仅对text和password类型输入有效
 * 外部可监听 ev-input-change，ev-input-blur，ev-input-focus，ev-input-clear事件
 */
export class Input extends Widget {
    public props: Props;
    public state: State;
    
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        this.props.itype = props.itype || 'text';
        let currentValue = '';
        if (props.input) {
            currentValue = props.input;
        }
        this.state = {
            currentValue,
            focused: false,
            showClear:false,
            inputLock:false
        };
    }
    /**
     * 绘制方法
     * @param reset 表示新旧数据差异很大，不做差异计算，直接生成dom
     */
    public paint(reset?: boolean): void {
        if (!this.tree) {
            super.paint(reset);
        }
        if (!this.props) {
            this.props = {};
        }
        paintCmd3(this.getInput(), 'readOnly', this.props.disabled || false);
        (<any>this.getInput()).value = this.state.currentValue;
        paintWidget(this, reset);
    }
    /**
     * 添加到dom树后调用，在渲染循环内调用
     */
    public attach(): void {
        this.props.autofocus && this.getInput().focus();
    }
    /**
     * 获取真实输入框dom
     */
    public getInput() {
        return getRealNode((<any>this.tree)).querySelector('input');
    }

    /**
     * 用户开始进行非直接输入(中文输入)的时候触发，而在非直接输入结束。
     */
    public compositionstart() {
        if (this.props.itype === 'text') {
            this.state.inputLock = true;
        }
    }
    
    /**
     * 用户输入完成,点击候选词或确认按钮时触发
     */
    public compositionend(e:any) {
        this.state.inputLock = false;
        this.change(e);  // 部分浏览器compositionend事件在input事件之前触发，导致输入值为空
    }

    /**
     * 输入事件
     */
    public change(event:any) {
        if (this.state.inputLock) {
            return;
        }
        let currentValue = event.currentTarget.value;
        // 最大长度限制
        if (this.props.maxLength) {
            currentValue = String(currentValue).slice(0,this.props.maxLength);
        }
        // 密码输入时检验非法字符
        if (this.props.itype === 'password' && !this.availableJudge(currentValue) && currentValue.length > 0) {
            currentValue = currentValue.slice(0,currentValue.length - 1); 
        }
        // 数字输入时检验输入格式
        if (this.props.itype === 'number' && currentValue.length > 0) {
            currentValue = currentValue.replace(/[^\d\.]/g,''); 
            if (!this.numberJudge(currentValue)) {
                currentValue = currentValue.slice(0,currentValue.length - 1); 
            }
        }
        // 整数输入时检验输入格式
        if (this.props.itype === 'integer' && currentValue.length > 0) {
            currentValue = currentValue.replace(/[\D]/g,''); 
        }
        this.state.currentValue = currentValue;
        (<any>this.getInput()).value = currentValue;
        notify(event.node,'ev-input-change',{ value:this.state.currentValue }); 
        
        this.state.showClear = this.props.clearable && !this.props.disabled && this.state.currentValue !== '';
        this.state.focused = true;
        this.paint();  
    }

    /**
     * 失焦事件
     */
    public onBlur(event:any) {
        this.state.focused = false;
        setTimeout(() => {
            const agent = userAgent('');
            if (agent.os.name === 'ios') {
                window.scrollTo(0, 0);  // ios部分手机页面不能自动下滑
            }
        },100);
        notify(event.node,'ev-input-blur',{ value:this.state.currentValue });
        this.paint();
    }

    /**
     * 聚焦事件
     */
    public onFocus(event:any) {
        this.state.focused = true;
        this.state.showClear = this.props.clearable && !this.props.disabled && this.state.currentValue !== '';
        notify(event.node,'ev-input-focus',{});
        this.paint();
    }

    /**
     * 按键按下
     */
    public keydown(event:any) {
        const value = event.key;
        notify(event.node,'ev-input-keydown',{ value });
    }
   
    // 清空文本框
    public clearClickListener(event:any) {
        this.state.currentValue = '';
        this.state.showClear = false;
        (<any>this.getInput()).value = '';
        notify(event.node,'ev-input-clear',{ value:'' });  
        this.paint();      
    }

    /**
     * 判断输入的密码是否符合规则
     */
    public availableJudge(psw:string) {
        const reg = /^[0-9a-zA-Z!"#$%&'()*+,\-./:;<=>?@\[\]^_`{\|}~]+$/;
        
        return reg.test(psw);
    }

    /**
     * 判断输入是否是正确的数字格式
     */
    public numberJudge(num:string) {
        const reg = /(^[1-9][0-9]*\.|^0\.)[0-9]*$/;
        const reg1 = /^([1-9][0-9]*|0)$/;

        return reg.test(num) || reg1.test(num);
    }

}
