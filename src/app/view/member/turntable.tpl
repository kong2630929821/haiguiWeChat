<div class="new-page" w-class="new-page" >
    <div w-class="content">
        {{% 大转盘标题}}
        <div w-class="turntable-name">
            <img src="../../res/image/grabRedEnv.png" height="100%" />
        </div>
        {{% 大转盘}}
        <div w-class="turntable-main-bg">
            <img src="../../res/image/{{it.ledShow?'turntable_LED2':'turntable_LED1'}}.png" width="680" height="690"/>
            <div w-class="turntable-container">
                <div w-class="turntable-content">
                    <div w-class="turntable-list" id="turntable">
                        {{for i,item in it.prizeList}}
                        <div w-class="turntable-item" style="transform: rotate({{i*(360/it.prizeList.length)}}deg)">
                            <div w-class="turntable-item-bg" style="border-width:240px {{240*Math.tan(3.14/it.prizeList.length-0.02)}}px 0px;border-top-color:{{i%2==0?'#FFC637':'#FF5251'}}"></div>
                            <div w-class="turntable-icontent">

                                    <span style="width:70px;height:42px;font-size:26px;line-height: 42px;color: white">￥8888.00</span>
                      
                            </div>
                            <div w-class="tunrntable-item-bot" style="border-width:175px {{175*Math.tan(3.14/it.prizeList.length)}}px 0px;border-top-color:#FFF1D6;border-radius:50%"></div>
                            
                            <div w-class="turntable-img">
                                <img src="../../res/image/redEnv.png" alt=""/>
                            </div>
                        </div>
                        {{end}}

                    </div>
                </div>
                <img on-tap="btnClick(e)" src="../../res/image/lotteryBtn.png"  w-class="turntable-btn"/>
            </div>
        </div>
        <div w-class="drawsNum">你还有0次机会</div>
        <div w-class="drawsList">
            <div w-class="drawsListTitle">中奖公告</div>
            <div style="margin-top: 50px;">
                {{for i,item in it.showDataList}}
                    <div w-class="list">
                        <div w-class="user">用户&nbsp;{{item.user}}</div>
                        <div w-class="drawsGood">抽中 ￥{{item.draws}}元</div>
                    </div>
                {{end}}
            </div>
        </div>
        <div w-class="rule">
            <div w-class="drawsListTitle">规则说明</div>
            <div w-class="ruleContent">首次领取线下课程可获得一次抽奖机会 首次领取试用装可获得一次抽奖机会</div>
        </div>
    </div>

    
</div>