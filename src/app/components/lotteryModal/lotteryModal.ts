/**
 * 中奖提示
 */

import { Widget } from '../../../pi/widget/widget';

interface Props {
    prizeName:number;// 奖品名字
}
// tslint:disable-next-line:completed-docs
export class LotteryModal extends Widget {
    public ok: () => void;
    public props:Props;
    public exit() {
        setTimeout(() => {
            this.ok && this.ok();
        },300);
    }
}