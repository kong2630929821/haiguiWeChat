/**
 * 大转盘 - 首页
 */

import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { getBigTurnrableConfig, getDraws, getDrawsLog, getNumberOfDraws } from '../../net/pull';
import { register } from '../../store/memstore';
import { popNewMessage, priceFormat } from '../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    prizeList: any;    // 奖品列表
    turnNum: number;   // 旋转角度
    isTurn: boolean;   // 正在转
    LEDTimer:any;    // LED计时器
    ledShow:boolean; // LED灯
    timer:any;// 刷新列表定时器
}
// tslint:disable-next-line:completed-docs
export class Turntable extends Widget {
    public ok: () => void;

    public props: Props = {
        turnNum: 0,
        isTurn: false,
        prizeList: [],
        LEDTimer:{},
        ledShow:false,
        timer:null
    };
    public create() {
        super.create();
        this.initTurntable();  
        this.state = State;
        // 10秒刷新一次中奖列表
        this.timedRefresh();
         // 获取中奖列表
        getDrawsLog().then(r => {
            this.state.showDataList = r.value;
            this.state.showDataList.forEach((element,index) => {
                this.state.showDataList[index][0] = element[0].replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
                this.state.showDataList[index][1] = (element[1] / 100).toFixed(2);
            });
            this.paint();
        });
        // 获取抽奖次数
        getNumberOfDraws().then(r => {
            console.log('抽奖次数',r);
            this.state.freeCount = r.value[0];
            this.paint();
        });
    }
    /**
     * 初始转盘
     */
    public initTurntable() {
        // 奖品配置  
        getBigTurnrableConfig().then(r => {
            r.config_out.forEach(v => {
                this.props.prizeList.push({ draw:priceFormat(v[0]) });
            });
            for (let i = 0,length = this.props.prizeList.length;i < length; i++) {
                this.props.prizeList[i].deg = (-360 / length) * i;
            }
            this.paint();
        });
    }
    // 定时定时刷新中奖列表
    public timedRefresh() {
        this.props.timer = setInterval(this.getDrawsLogData.bind(this),10000);
    }
    // 中奖列表
    public getDrawsLogData() {
        getDrawsLog().then(r => {
            State.showDataList = r.value;
            State.showDataList.forEach((element,index) => {
                State.showDataList[index][0] = element[0].replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
                State.showDataList[index][1] = (element[1] / 100).toFixed(2);
            });
            this.paint();
        });
    }
    /**
     * 开奖
     */
    public goLottery() {
        if (this.props.isTurn) return;
        this.props.isTurn = true;
        getDraws().then((order:any) => {
            State.freeCount--;
            this.changeDeg(order);
            
        }).catch((err) => {
            // this.changeDeg(err);
            console.log('转盘下单失败',err);
            this.props.isTurn = false;
        });

    }

    /**
     * 修改转动角度
     */
    public changeDeg(resData:any) {
        console.log('changeDeg------------------',resData);
        this.props.isTurn = true;
        const $turnStyle = document.getElementById('turntable').style;
        const $turnStyle1 = document.getElementById('turntable1').style;

        this.props.prizeList.forEach(element => {
            const m = (resData.money / 100).toFixed(2);
            if (element.draw === m) {
                this.props.turnNum = element.deg;
            }
        });

        $turnStyle.transition = 'transform 3.5s ease-in-out';
        $turnStyle1.transition = 'transform 3.5s ease-in-out';

        $turnStyle.transform = `rotate(${this.props.turnNum + 1440}deg)`;
        $turnStyle1.transform = `rotate(${this.props.turnNum + 1440}deg)`;

        setTimeout(() => {
            this.endLottery();
            const data = resData.money / 100;
            popNew('app-components-lotteryModal-lotteryModal', { prizeName:data.toFixed(2) });
        }, 3500);
    }
    /**
     * 结束开奖
     */
    public endLottery() {
        const $turnStyle = document.getElementById('turntable').style;
        const $turnStyle1 = document.getElementById('turntable1').style;
        this.props.isTurn = false;
        $turnStyle.transition = 'none';
        $turnStyle1.transition = 'none';
        $turnStyle.transform = `rotate(${this.props.turnNum}deg)`;
        $turnStyle1.transform = `rotate(${this.props.turnNum}deg)`;
    }
    /**
     * 点击效果
     */
    public btnClick(e: any) {
        if (this.props.isTurn) {

            return;
        }
        const $dom = getRealNode(e.node);
        $dom.className = 'btnClick';
        setTimeout(() => {
            $dom.className = '';
        }, 100);
        if (State.freeCount === 0) {
            popNewMessage('次数不足');
        } else {
            this.goLottery();
        }
        
    }
    /**
     * led定时器
     */
    public ledTimer() {
        this.props.LEDTimer = setInterval(() => {
            this.props.ledShow = !this.props.ledShow;
            this.paint();
        }, 1000);
    }

    public destroy() {
        clearInterval(this.props.LEDTimer);
        clearInterval(this.props.timer);

        return true;
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}
const State = {
    showDataList:[],
    freeCount:0
};
// user/userType
register('user/userType',(r) => {
    // 获取中奖列表
    getDrawsLog().then(r => {
        State.showDataList = r.value;
        State.showDataList.forEach((element,index) => {
            State.showDataList[index][0] = element[0].replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
            State.showDataList[index][1] = (element[1] / 100).toFixed(2);
        });
        forelet.paint(State);
    });
     // 获取抽奖次数
    getNumberOfDraws().then(r => {
        console.log('抽奖次数',r);
        State.freeCount = r.value[0];
        forelet.paint(State);
    });
    
});

// ===================================================== 立即执行
