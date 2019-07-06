// tslint:disable-next-line:missing-jsdoc
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { mallImagPre } from '../../config';
import { getCollectList, removeLiked } from '../../net/pull';
import { getImageThumbnailPath, priceFormat } from '../../utils/tools';
interface Props {
    collectList:any; // 收藏商品列表
}
// tslint:disable-next-line:completed-docs
export class Favorites extends Widget {
    public setProps(props:Props) {
        this.props = {
            ...props,
            getImageThumbnailPath,
            mallImagPre,
            priceFormat,
            collectList:[]
        };
        getCollectList().then(r => {
            this.props.collectList = r;
            console.log(this.props.collectList);
            this.paint();
        });
    }

    // 去商品详情
    public goShopInfo(e:any,index:number) {
        const goods = this.props.collectList[index];
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
                    this.props.collectList.splice(index,1);
                    this.paint();
                });
            });
        }
        
    }
}