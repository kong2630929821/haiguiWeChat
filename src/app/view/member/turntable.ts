/**
 * 大转盘 - 首页
 */

import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { getDraws, getDrawsLog, getNumberOfDraws } from '../../net/pull';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    prizeList: any;    // 奖品列表
    turnNum: number;   // 旋转角度
    isTurn: boolean;   // 正在转
    freeCount: number; // 免费次数
    LEDTimer:any;    // LED计时器
    ledShow:boolean; // LED灯
    showDataList:any;// 中奖人列表
    timer:any;// 刷新列表定时器
}
// tslint:disable-next-line:completed-docs
export class Turntable extends Widget {
    public ok: () => void;

    public props: Props = {
        turnNum: 0,
        isTurn: false,
        prizeList: [],
        freeCount:0,
        LEDTimer:{},
        ledShow:false,
        showDataList:[],
        timer:null
    };
    public create() {
        super.create();
        this.initTurntable();
        this.ledTimer();
        clearInterval(this.props.timer);
        // 获取第一次数据
        this.getDrawsLogData();
        // 10秒刷新一次中奖列表
        this.timedRefresh();
    }
    /**
     * 初始转盘
     */
    public initTurntable() {
        // 奖品配置  
        const prizeList = [1,2,3,4,5,6];
        this.props.prizeList = [{ draw:'0.01' },{ draw:'1.00' },{ draw:'5.00' },{ draw:'10.00' },{ draw:'20.00' },{ draw:'8888.00' }];

        for (let i = 0, length = prizeList.length; i < length; i++) {
            this.props.prizeList[i].deg = (-360 / length) * i;
        }
        console.log(this.props.prizeList);
        // 获取抽奖次数
        getNumberOfDraws().then(r => {
            console.log('抽奖次数',r);
            this.props.freeCount = r.value[0];
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
            this.props.showDataList = r.value;
            this.props.showDataList.forEach((element,index) => {
                this.props.showDataList[index][0] = element[0].replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
                this.props.showDataList[index][1] = (element[1] / 100).toFixed(2);
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
            this.props.freeCount--;
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
            if (parseFloat(element.draw) === resData.money) {
                this.props.turnNum = element.deg;
            }
        });

        $turnStyle.transition = 'transform 3.5s ease-in-out';
        $turnStyle1.transition = 'transform 3.5s ease-in-out';

        $turnStyle.transform = `rotate(${this.props.turnNum + 1440}deg)`;
        $turnStyle1.transform = `rotate(${this.props.turnNum + 1440}deg)`;

        setTimeout(() => {
            this.endLottery();
            const data = resData.money;
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
        this.goLottery();
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

        return true;
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行
