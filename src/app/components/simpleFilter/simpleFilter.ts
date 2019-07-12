/**
 * 简单选择框
 */

// ================================================ 导入
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

// ================================================ 导出
interface Props {
    active:number; // 当前选择的选项
    options:any[];// 选项
    expand:boolean;// 是否展开所有选项 
}

// tslint:disable-next-line:completed-docs
export class SimpleFilter extends Widget {
    public props:Props = {
        active:0,
        options:[],
        expand:false
    };
    
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        this.props.expand = false;
        super.setProps(this.props);
    }

    // 切换展示隐藏
    public change(e:any) {
        this.props.expand = !this.props.expand;
        notify(e.node,'ev-expand',{ value:this.props.expand });
        this.paint();
    }

    // 选择选项
    public select(e:any,num:number) {
        this.props.active = num;
        this.props.expand = false;
        notify(e.node,'ev-selected',{ value:this.props.active });
        this.paint();
    }

}

// ================================================ 本地
