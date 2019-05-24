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
                            <div w-class="turntable-item-bg" style="border-width:240px {{240*Math.tan(3.14/it.prizeList.length)}}px 0px;border-top-color:{{i%2==0?'#fff':'#eee'}}"></div>
                            <div w-class="turntable-icontent">
                                <p w-class="turntable-itext">
                                    <span style="width:70px;height:70px;font-size:26px;">谢谢惠顾</span>
                                </p>
                            </div>
                        </div>
                        {{end}}

                    </div>
                </div>

                <img on-tap="btnClick(e)" src="../../res/image/lotteryBtn.png"  w-class="turntable-btn"/>
            </div>
        </div>
    </div>

    <div></div>
</div>