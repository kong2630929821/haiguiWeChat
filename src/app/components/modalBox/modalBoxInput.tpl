<div class="new-page" w-class="page">
    <div w-class="body">
        {{if it.title}}
        <div w-class="title">
            <pi-ui-html>{{it.title}}</pi-ui-html>
        </div>
        {{end}}
        <div ev-input-change="messChange" w-class="row">
            <widget w-tag="app-components-input-input">{placeHolder:{{it.placeHolder}},style:"padding:10px;font-size:28px;" }</widget>        
        </div>

        <div w-class="btns">
            <div w-class="cancel" on-tap="cancelBtnClick">{{it.cancelText}}</div>
            <div w-class="sure" on-tap="okBtnClick">{{it.sureText}}</div>
        </div>
    </div>
</div>