<div class="new-page" w-class="page">
    <div w-class="{{it.btn?'content1':'content'}}">
        <img src="../../res/image/{{it.img}}"/>
        {{if it.btn}}
            <div w-class="btn1" on-tap="close"></div>
        {{else}}
            <div w-class="btn" on-tap="close">知道了</div>
        {{end}}
    </div>
</div>