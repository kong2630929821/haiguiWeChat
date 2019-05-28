<div class="new-page" w-class="page" style="background:{{it.fg==2?'#FFF5F9':''}}">
    <img src="../../res/image/{{it.img}}"/>
    {{% ========================基础礼包======================}}
    {{if it.fg == 1 && it.isCurVip}}
    <div w-class="btn" style="color:#2D681B" on-tap="freeReceive">{{it.btn}}</div>
    
    {{% ========================尊享礼包======================}}
    {{elseif it.fg == 2 && it.isCurVip}}
    <div w-class="btn" style="color:#EC3760" on-tap="freeReceive">{{it.btn}}</div>
    
    {{% ========================试用装领取======================}}
    {{elseif it.fg == 3 && it.isCurVip}}
    <div w-class="btn1" on-tap="freeReceive">{{it.btn}}</div>
    <div w-class="shareBtn1" on-tap="shareBtn">分享给好友</div>
    
    {{% ========================线下课程======================}}
    {{elseif it.fg == 4 && it.isCurVip}}
    <div style="display: flex;align-items: center;">
        <div w-class="shareBtn" on-tap="shareBtn">分享给好友</div>
        <div w-class="btn" style="width: 200px;margin-top:0;" on-tap="applyClass">{{it.btn}}</div>
    </div>
    
    {{% ========================开通获得积分======================}}
    {{elseif it.fg==5 && !it.isCurVip}}
    <div w-class="open" on-tap="openVIP">立即开通</div>
    
    {{% ========================精品课程，销售课程======================}}
    {{elseif (it.fg ==8 || it.fg ==9) && it.isCurVip }}
    <div w-class="btn" style="margin-top:40;" on-tap="applyClass">{{it.btn}}</div>
    {{end}}
</div>