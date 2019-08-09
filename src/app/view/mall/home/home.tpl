<div w-class="new-page" class="new-page">
    <div w-class="input">
        <div w-class="searchBox" on-tap="goSearch">搜索想买的商品</div>
        <img w-class="searchIcon" src="../../../res/image/search-gray.png" />
    </div>
    <div id="scroll-container" on-scroll="getMoreList" w-class="scroll-container">
        <div id="scroll-content">
            <div style="height:350px;width:100%;" ev-click-slide="groupsClick">
                <app-components-imgSwiper-imgSwiper>{ list:{{ it1.groups.get(it.GroupsLocation1[1]) || [] }},mod:1 }</app-components-imgSwiper-imgSwiper>
            </div>
            <div style="margin-top:20px;" ev-click-groups-one="groupsClick">
                <app-components-groups1-groups1>{ list:{{ it1.groups.get(it.GroupsLocation1[2]) || [] }} }</app-components-groups1-groups1>
            </div>
            <div w-class="container">
            {{for i,v of [0,1]}}

                {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 3])}}
                <div w-class="group1" class="bg-img" style="background-image:url(../../../res/image/hBaoCard.png);" on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 3]}})"></div>
                {{end}}
                <div w-class="groups">
                    {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 4])}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 4]}})" >
                        <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}

                    {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 5])}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 5]}})" style="margin-right:0;">
                        <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}
                </div>  

                <div w-class="groups">
                    {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 6])}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 6]}})" >
                        <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}

                    {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 7])}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 7]}})" >
                        <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}
                    
                    {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 8])}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 8]}})" style="margin-right:0;">
                        <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}
                </div>

                <div w-class="groups">
                    {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 9])}}
                    <div w-class="group2" on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 12]}})" style="height:410px;">
                        <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}

                    <div style="flex: 1 0 0;">
                        {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 10])}}
                        <div on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 10]}})" style="height: 200px;margin-top: 10px;">
                            <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        
                        {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 11])}}
                        <div on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 11]}})" style="height:200px;margin-top:10px;" >
                            <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                    </div>

                </div>

                <div w-class="groups">

                    <div style="flex: 1 0 0;margin-right: 10px;">
                        {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 12])}}
                        <div on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 12]}})" style="height: 200px;margin-top: 10px;">
                            <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        
                        {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 13])}}
                        <div on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 13]}})" style="height:200px;margin-top:10px;" >
                            <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                    </div>

                    {{if it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 14])}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 14]}})" style="height:410px;margin-right:0;">
                        <div style="background-image:url(../../../res/image/hBaoCard.png);border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}

                </div>

            {{end}}
            </div>

            <div w-class="like-goods-box">
                <div w-class="like-title">猜你喜欢</div>
                <div w-class="goods-list"  >
                    <div w-class="goods-list-items">
                        {{for i,v of it1.likedGoods}}
                        <div w-class="goods-item" style="{{i % 2 === 0 ? 'padding-right:5px;' : 'padding-left:5px;'}}" ev-item-click="goodsItemClick(e,{{i}})">
                            <app-components-goodsItem-goodsItem>{goods:{{v}} }</app-components-goodsItem-goodsItem>
                        </div>
                        {{end}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>