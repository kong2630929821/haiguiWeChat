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
                <div w-class="turntable-content" id="turntable">
                    {{for i,item in it.prizeList}}
                    <div w-class="turntable-item" style="transform: rotate({{i*(360/it.prizeList.length)}}deg)">
                        <div w-class="turntable-itembg" style="border-width:240px {{240*Math.tan(3.14/it.prizeList.length-0.02)}}px 0px;border-top-color:{{i%2==0?'#FFC637':'#FF5251'}}"></div>
                        <div w-class="award">￥{{item.draw}}</div>
                    </div>
                    {{end}}
                </div>

                <div w-class="turntable-inner" id="turntable1">
                    {{for i,v of it.prizeList}}
                    <div w-class="turntable-item" style="transform: rotate({{i*(360/it.prizeList.length)}}deg)">
                        <div w-class="turntable-itembg" style="border-width:175px {{175*Math.tan(3.14/it.prizeList.length)}}px 0px;"></div>
                        <img src="../../res/image/redEnv.png" w-class="turntable-img"/>
                    </div>
                    {{end}}
                </div>
                <img on-tap="btnClick(e)" src="../../res/image/lotteryBtn.png"  w-class="turntable-btn"/>
            </div>
        </div>
        
        <div w-class="drawsNum">你还有{{it1.freeCount}}次机会</div>
        <div w-class="drawsList">
            <div w-class="drawsListTitle">中奖公告</div>
            <div w-class="draw-box-content">
                {{for i,item of it1.showDataList}}
                    <div w-class="list">
                        <div w-class="user">
                            <span w-class="user-title">用户</span>
                            {{item[0]}}
                        </div>
                        <div w-class="drawsGood">
                            <span w-class="draw-title">抽中</span>
                             ￥{{item[1]}}元
                        </div>
                    </div>
                {{end}}
            </div>
        </div>
        <div w-class="rule">
            <div w-class="drawsListTitle">规则说明</div>
            <div w-class="ruleContent">
                <p>首次领取【免费面膜】可获得一次抽奖机会</p>
                <p>首次领取【线下课程】可获得一次抽奖机会</p>
                <p>每次成功领取周礼包，可获得一次抽奖机会</p>
            </div>
        </div>
    </div>

    
</div>