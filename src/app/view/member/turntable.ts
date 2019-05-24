/**
 * 大转盘 - 首页
 */

import { Forelet } from '../../../pi/widget/forelet';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { getNumberOfDraws } from '../../net/pull';

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
        showDataList:[{ user:1351229890,draws:0.01 },
                      { user:1351229890,draws:0.01 },
                      { user:1351229890,draws:0.01 },
                      { user:1351229890,draws:0.01 },
                      { user:1351229890,draws:0.01 },
                      { user:1351229890,draws:0.01 }]
    };
    public create() {
        super.create();
        this.initTurntable();
        this.ledTimer();
    }

    /**
     * 初始转盘
     */
    public initTurntable() {
        // 奖品配置  
        const prizeList = [1,2,3,4,5,6];
        this.props.prizeList = [];
        
        for (let i = 0, length = prizeList.length; i < length; i++) {
            const prizeItem = {
                deg: (-360 / length) * i
            };
            this.props.prizeList.push(prizeItem);
        }

        // 获取抽奖次数
        getNumberOfDraws().then(r => {
            console.log('抽奖次数',r);
        });
    }

    /**
     * 开奖
     */
    public goLottery() {
        if (this.props.isTurn) return;
        this.props.isTurn = true;
        // openTurntable().then((order:any) => {
        //     this.props.freeCount--;
        //     this.changeDeg(order);
            
        // }).catch((err) => {
        //     // this.changeDeg(err);
        //     console.log('转盘下单失败',err);
        //     this.props.isTurn = false;
        // });

    }

    /**
     * 修改转动角度
     */
    public changeDeg(resData:any) {
        console.log('changeDeg------------------',resData);
        this.props.isTurn = true;
        const $turnStyle = document.getElementById('turntable').style;
        this.props.prizeList.forEach(element => {
            if (element.awardType === resData.awardType && element.num === resData.count) {
                this.props.turnNum = element.deg;
            }
        });

        $turnStyle.transition = 'transform 3.5s ease-in-out';
        $turnStyle.transform = `rotate(${this.props.turnNum + 1440}deg)`;

        setTimeout(() => {
            this.endLottery();
            
        }, 3500);
    }

    /**
     * 结束开奖
     */
    public endLottery() {
        const $turnStyle = document.getElementById('turntable').style;
        this.props.isTurn = false;
        $turnStyle.transition = 'none';
        $turnStyle.transform = `rotate(${this.props.turnNum}deg)`;
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
