<div class="new-page" w-class="collectBox">
    {{if it1.length==0}}
    <div w-class="empty">
        <img src="../../res/image/emptyMessage.png" w-class="emptyImg"/>
        <div w-class="emptyText">暂无任何消息</div>
    </div>
    {{else}}
    <div w-class="box" on-scroll="getMoreList" id="message-list">
        <div id="messageList-items">
            {{for i,v of it1}}
                <div w-class="item">
                    <div w-class="start">{{v.start}}</div>
                    <div w-class="time">{{v.time}}</div>
                    <div w-class="contentBody">
                        <div w-class="title">{{v.title}}</div>
                        {{for j,t of v.content}}
                            <div w-class="row">
                                <div w-class="key">{{t.key}}</div>
                                <div w-class="value {{t.flag?'bold':''}}">{{t.value}}</div>
                            </div>
                        {{end}}
                        <div w-class="end">{{v.coda}}</div>
                    </div>
                </div>
            {{end}}
        </div>
    </div>
    {{end}}
</div>