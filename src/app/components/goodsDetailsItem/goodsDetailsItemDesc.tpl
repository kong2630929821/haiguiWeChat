<div class="new-page" w-class="new-page">
    <div w-class="mask"></div>
    <div w-class="body">
        <div w-class="title">
            <div>{{it.title}}</div>
            <img src="../../res/image/close.png" style="width:30px;height:30px;" on-tap="closeClick"/>
        </div>
        {{for i,v of it.descs}}
        <div w-class="item">
            <div w-class="item-title">{{v.title}}</div>
            <div w-class="item-content">{{v.content}}</div>
        </div>
        {{end}}
    </div>
</div>