// tslint:disable-next-line:missing-jsdoc
import { Widget } from '../../../pi/widget/widget';
interface Props {
    title:string;
    btn:string;
    content:string;
}
// tslint:disable-next-line:completed-docs
export class InvalidBox extends Widget {
    public props:Props = {
        title:'失效商品',
        btn:'确认',
        content:'该商品已失效，确认后将自动从收藏夹移除'
    };
    public ok:() => void;
    public setProps(props:any) {
        this.props = { 
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        
    }

    // 点击确认
    public okBtnClick() {
        this.ok && this.ok();
    }
}