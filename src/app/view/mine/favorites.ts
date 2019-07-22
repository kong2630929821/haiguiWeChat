// tslint:disable-next-line:missing-jsdoc
import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { mallImagPre } from '../../config';
import { removeLiked } from '../../net/pull';
import { getStore, register } from '../../store/memstore';
import { getCollect } from '../../utils/logic';
import { getImageThumbnailPath, priceFormat } from '../../utils/tools';
export const forelet = new Forelet();

// tslint:disable-next-line:completed-docs
export class Favorites extends Widget {
    public setProps(props:any) {
        this.props = {
            ...props,
            getImageThumbnailPath,
            mallImagPre,
            priceFormat
        };
        this.state  = getStore('flags/collects',[]);
    }

    // 去商品详情
    public goShopInfo(e:any,index:number) {
        const goods = this.state[index];
        // skuId:goods.labels[0][0]
        if (goods.flag) {
            // 未下架的商品跳转详情
            popNew('app-view-mall-goodsDetail',{ goods });
        } else {
            // 下架的商品提醒商品失效删除该收藏
            popNew('app-view-mine-invalidShopBox',{},() => {
                console.log(goods);
                removeLiked(goods.id).then(r => {
                    console.log(r);
                    // 删除当前的列表
                    this.state.splice(index,1);
                    // 获取所有收藏
                    getCollect();
                    this.paint();
                });
            });
        }
        
    }

    // 取消某个收藏
    public cancelCollect(index:number) {
        const id = this.state[index].id;
        removeLiked(id).then(r => {
            console.log(r);
            // 获取所有收藏
            getCollect();
            this.paint();
        });
    }
}
// 监听商品收藏情况
register('flags/collects',r => {
    forelet.paint(r);
});