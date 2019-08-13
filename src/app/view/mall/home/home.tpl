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

                {{: loc3 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 3])}}
                {{if loc3}}
                <div w-class="group1" class="bg-img" style="background-image:url({{loc3 ? it.mallImagPre + it.getImageThumbnailPath(loc3.images) : ''}})" on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 3]}})"></div>
                {{end}}
                <div w-class="groups">
                    {{: loc4 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 4])}}
                    {{if loc4}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 4]}})" >
                        <div style="background-image:url({{loc4 ? it.mallImagPre + it.getImageThumbnailPath(loc4.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}

                    {{: loc5 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 5])}}
                    {{if loc5}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 5]}})" style="margin-right:0;">
                        <div style="background-image:url({{loc5 ? it.mallImagPre + it.getImageThumbnailPath(loc5.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}
                </div>  

                <div w-class="groups">
                    {{: loc6 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 6])}}
                    {{if loc6}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 6]}})" >
                        <div style="background-image:url({{loc6 ? it.mallImagPre + it.getImageThumbnailPath(loc6.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}

                    {{: loc7 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 7])}}
                    {{if loc7}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 7]}})" >
                        <div style="background-image:url({{loc7 ? it.mallImagPre + it.getImageThumbnailPath(loc7.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}
                    
                    {{: loc8 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 8])}}
                    {{if loc8}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 8]}})" style="margin-right:0;">
                        <div style="background-image:url({{loc8 ? it.mallImagPre + it.getImageThumbnailPath(loc8.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}
                </div>

                <div w-class="groups">
                    {{: loc9 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 9])}}
                    {{if loc9}}
                    <div w-class="group2" on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 12]}})" style="height:410px;">
                        <div style="background-image:url({{loc9 ? it.mallImagPre + it.getImageThumbnailPath(loc9.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                    </div>
                    {{end}}

                    <div style="flex: 1 0 0;">
                        {{: loc10 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 10])}}
                        {{if loc10}}
                        <div on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 10]}})" style="height: 200px;margin-top: 10px;">
                            <div style="background-image:url({{loc10 ? it.mallImagPre + it.getImageThumbnailPath(loc10.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        
                        {{: loc11 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 11])}}
                        {{if loc11}}
                        <div on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 11]}})" style="height:200px;margin-top:10px;" >
                            <div style="background-image:url({{loc11 ? it.mallImagPre + it.getImageThumbnailPath(loc11.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                    </div>

                </div>

                <div w-class="groups">

                    <div style="flex: 1 0 0;margin-right: 10px;">
                        {{: loc12 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 12])}}
                        {{if loc12}}
                        <div on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 12]}})" style="height: 200px;margin-top: 10px;">
                            <div style="background-image:url({{loc12 ? it.mallImagPre + it.getImageThumbnailPath(loc12.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        
                        {{: loc13 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 13])}}
                        {{if loc13}}
                        <div on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 13]}})" style="height:200px;margin-top:10px;" >
                            <div style="background-image:url({{loc13 ? it.mallImagPre + it.getImageThumbnailPath(loc13.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                    </div>

                    {{: loc14 = it.getFixLocationGroup(it1.groups, it.GroupsLocation1[v * 12 + 14])}}
                    {{if loc14}}
                    <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation1[v * 12 + 14]}})" style="height:410px;margin-right:0;">
                        <div style="background-image:url({{loc14 ? it.mallImagPre + it.getImageThumbnailPath(loc14.images) : ''}});border-radius:6px;" class="bg-img" ></div>
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