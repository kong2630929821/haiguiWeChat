<div class="new-page" w-class="page" style="background:{{it.fg==2?'#FFF5F9':''}}">
    <img src="../../res/image/{{it.img}}"/>
    {{% ========================基础礼包======================}}
    {{if it.fg == 1 && it.isCurVip}}
    <div w-class="btn" style="color:#2D681B" on-tap="freeReceive">免费领取</div>
    
    {{% ========================尊享礼包======================}}
    {{elseif it.fg == 2 && it.isCurVip}}
    <div w-class="btn" style="color:#EC3760" on-tap="freeReceive">领取本期面膜</div>
    
    {{% ========================试用装领取======================}}
    {{elseif it.fg == 3}}
    <div w-class="btn1" on-tap="freeReceive">免费领取</div>
    <div w-class="shareBtn1" on-tap="share">推荐给好友</div>
    
    {{% ========================线下课程======================}}
    {{elseif it.fg == 4}}
    <div w-class="btns">
        <div w-class="shareBtn" on-tap="share">推荐给好友</div>
        <div w-class="btn" style="margin-top:0;" on-tap="applyClass">报名听课</div>
    </div>
    
    {{% ========================开通获得积分======================}}
    {{elseif it.fg==5 && !it.isCurVip}}
    <div w-class="open" on-tap="open">立即开通</div>
    
    {{% ========================1万特有的课程======================}}
    {{elseif (it.fg ==8 || it.fg ==9) && it.isCurVip }}
    <div w-class="btn" style="margin-top:40;" on-tap="applyClass">报名听课</div>
    {{end}}
</div>