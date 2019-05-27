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
                        <div w-class="award">￥8888.00</div>
                    </div>
                    {{end}}
                </div>

                <div w-class="turntable-inner">
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