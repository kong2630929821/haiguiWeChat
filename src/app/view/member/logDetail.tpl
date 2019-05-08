<div class="new-page" style="background:#F9F9F9">
    <div w-class="contain">
        <div w-class="row title">
            <div w-class="left" style="margin:0;">{{it.list[0].key}}</div>
            <div w-class="wxName">{{it.list[0].value}}</div>
        </div>
        {{for i,v of it.list}}
            {{if i > 0}}
            <div w-class="row">
                <div w-class="left">{{v.key}}</div>
                <div w-class="right">{{v.value}}</div>
            </div>
            {{end}}
        {{end}}
    </div>
</div>