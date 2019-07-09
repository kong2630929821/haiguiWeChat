<div class="new-page" w-class="page" on-tap="close">
    <div w-class="contain">
        {{for i,v of it.list}}
        <div w-class="row" on-tap="select({{i}})">
            <img src="../../res/image/{{it.selected == i?'selectBox_active.png':'selectBox.png'}}"/>
            <span style="margin-left:20px;">{{v}}</span>
        </div>
        {{end}}
    </div>
</div>