<div class="new-page" w-class="page">
    <div w-class="title">身份信息（必填）</div>
    <div w-class="input" ev-input-change="nameChange">
    <widget w-tag="app-components-input-input">{placeHolder:"您的真实姓名",style:"font-size: 26px;"}</widget>
    </div>
    <div w-class="input" ev-input-change="cardChange">
        <widget w-tag="app-components-input-input">{placeHolder:"您的身份证号（将加密处理）",style:"font-size: 26px;",maxLength:18}</widget>
    </div>

    <div w-class="title">身份证正反照片（必填）</div>
    <div w-class="upload">
        <div w-class="uploadImg" on-tap="uploadBtn(1)">
            {{if it.img1}}
            <widget w-tag="app-components-img-img">{width:"323px",height:"192px",isRound:false,imgURL:{{it.img1}} }</widget>
            <img src="../../res/image/close.png" w-class="closeBtn" on-tap="delImg(1)"/>
            {{else}}
            <img src="../../res/image/camera.png" style="margin-top:30px"/>
            <div style="margin-top:20px">身份证人像面</div>
            {{end}}
        </div>

        <div w-class="uploadImg" on-tap="uploadBtn(2)">
            {{if it.img2}}
            <widget w-tag="app-components-img-img">{width:"323px",height:"192px",isRound:false,imgURL:{{it.img2}} }</widget>
            <img src="../../res/image/close.png" w-class="closeBtn" on-tap="delImg(2)"/>
            {{else}}
            <img src="../../res/image/camera.png" style="margin-top:30px"/>
            <div style="margin-top:20px">身份证国徽面</div>
            {{end}}
        </div>
    </div>
    <div w-class="upload" style="margin-top:30px;">
        <div>
            <div w-class="text" style="color:#888888">示例</div>
            <img src="../../res/image/IDcard1.png"/>
        </div>
        <div>
            <div w-class="text" style="color:#888888">示例</div>
            <img src="../../res/image/IDcard2.png"/>
        </div>
        
    </div>
   
    <div w-class="bottom">
        <div w-class="text">为什么需要实名认证？</div>
        <div w-class="desc">根据海关规定，购买跨境商品需办理清关手续，请您配合进行实名认证，以确保您购买的商品顺利通过海关检查。（海龟壹号海外购承诺身份证只用于办理跨境商品的清关手续，不作其它使用，其它任何人无法查看）</div>
        <div w-class="btn" on-tap="verify">认证</div>
    </div>
</div>