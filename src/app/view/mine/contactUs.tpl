<div class="new-page" ev-back-click="backPrePage" style="overflow-x:hidden;overflow-y:auto;height:100%;">
    <img src="../../res/image/contactUs.jpg" style="width:100%;"/>
    <div style="margin-top:60px;display:flex;justify-content: center;">
        <div w-class="itemDesc">
            <p style="font-weight:600">尊敬的客户您好，如有任何咨询或帮助</p>
            <p on-tap="copyBtn">1.请拨打客服热线028-66266866<img src="../../res/image/copy.png" style="width:25px;height:25px;margin-left:10px;"/></p>
            <p>2.进入海龟壹号公众号联系在线客服</p>
            <p>电话客服时间：周一到周五9:30-12:00 13:30-18:00</p>
            <p>在线客服时间：周一到周日9:30-12:00 13:30-18:00</p>
        </div>
    </div>
    <img src="../../res/image/qrCode.jpg" style="width:100%;margin-top:100px;"/>
    {{if 1==2}}
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="../../res/image/logo.png" w-class="logoimg"/>
        </div>
        
        {{for i,v of it.data}}
            <div on-tap="itemClick({{i}})" w-class="item">
                <div w-class="itemName">{{v[0]}}</div>
                <div w-class="itemDesc">{{v[1]}}</div>
                <img src="../../res/image/arrowRight.png" w-class="itemImg"/>
            </div>
        {{end}}
    </div>
    {{end}}
</div>