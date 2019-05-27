<div class="new-page" w-class="page">
    <div w-class="top"></div>
    <div w-class="content">
        <div w-class="row row1">
            <div>配送至</div>
            <img src="../../res/image/close.png" w-class="close" on-tap="close"/>
        </div>
        <div w-class="row row1" style="justify-content:flex-start;">
            {{for i,v of it.selected}}
                <div w-class="text {{it.activeStr==v.name?'active':''}}" on-tap="back({{i}})">{{v.name}}</div>
            {{end}}
        </div>

        <div w-class="areaBox">
            {{for i,v of it.showList}}
                {{if it.activeStr == v.name}}
                <div style="display: flex;align-items: center;" on-tap="select({{i}})">
                    <div w-class="text activeText" style="margin-left:30px;">{{v.name}}</div>
                    <img src="../../res/image/hook.png"/>
                </div>
                {{else}}
                <div w-class="text" style="margin-left:30px;" on-tap="select({{i}})">{{v.name}}</div>
                {{end}}
            {{end}}
        </div>
    </div>
</div>