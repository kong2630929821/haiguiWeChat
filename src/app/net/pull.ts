import { GoodsDetails, GoodsInventory, GoodsSegmentationDetails, Level1Groups, Level2Groups, MallImages, MallLabels,setStore } from '../store/memstore';

/**
 * 通信接口
 */

 // 获取分组信息
export const getGroups = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            const groups = new Map<number, Level1Groups>();
            console.time('getGroups');
            for (let i = 0;i < 40;i++) {
                const childs = new Map<number, Level2Groups>();
                for (let j = 0;j < 10;j++) {
                    const goods = [];
                    for (let k = 0;k < 10;k++) {
                        const goodsId = Math.floor(Math.random() * 100000);
                        const image1:MallImages = {
                            path:`a${goodsId % 4 + 1}.png`,
                            type:1,
                            style:1
                        };
                        const image2:MallImages = {
                            path:`a${Math.floor(Math.random() * 100000) % 4 + 1}.png`,
                            type:1,
                            style:1
                        };
                        const image3:MallImages = {
                            path:`a${Math.floor(Math.random() * 100000) % 4 + 1}.png`,
                            type:1,
                            style:1
                        };
                        const has_tax = Math.random() > 0.5 ? true : false;
                        const good:GoodsDetails = {
                            id:goodsId,
                            name:Math.random() > 0.5 ? `商品名字很短${goodsId}` : `商品名字很长商品名字很长商品名字很长商品名字很长${goodsId}`,
                            pay_type:1,
                            rebate:200,
                            origin:1200,
                            discount:Math.random() > 0.5 ? 800 : 0,
                            vip_origin:Math.random() > 0.5 ? 1000 : 0,
                            has_tax,
                            tax:has_tax ? Number((Math.random() * 100).toFixed(2)) : 0,
                            images:[image1,image2,image3],
                            intro:`商品${goodsId}的详细介绍`,
                            labels:undefined,
                            brand:undefined,
                            area:undefined,
                            supplier:undefined,
                            weight:undefined,
                            spec:undefined,
                            detail:undefined,
                            out:undefined,
                            total_out:undefined,
                            inventorys:Math.floor(Math.random() * 100)
                        };
                        goods.push(good);
                    }

                    const l2id = Math.floor(Math.random() * 100000);
                    const image:MallImages = {
                        path:`a${l2id % 4 + 1}.png`,
                        type:1,
                        style:1
                    };
                    const level2Groups:Level2Groups = {
                        id:l2id,
                        name:`分组${l2id}`,
                        type:false,
                        images:[image],
                        detail:`这是分组${l2id}的描述`,
                        goods
                    };
                    childs.set(l2id,level2Groups);
                }
                
                const l1id = Math.floor(Math.random() * 100000);
                const image:MallImages = {
                    path:`a${l1id % 4 + 1}.png`,
                    type:1,
                    style:1
                };
                const level1Groups:Level1Groups = {
                    id:l1id,
                    name:`分组${l1id}`,
                    type:true,
                    images:[image],
                    detail:`这是分组${l1id}的描述`,
                    location:Math.floor(Math.random() * 10) % 3 + 1,
                    childs
                };
                groups.set(l1id,level1Groups);
            }
            console.timeEnd('getGroups');
            setStore('mall/groups',groups);
            resolve(groups);
        },100);
    });
};

const getImage = ():MallImages => {
    return  {
        path:`a${Math.floor(Math.random() * 100000) % 4 + 1}.png`,  
        type:1,
        style:1
    };
};
// 获取商品详细信息
// tslint:disable-next-line:max-func-body-length
export const getGoodsDetails = (goods:GoodsDetails) => {
    // tslint:disable-next-line:max-func-body-length
    return new Promise(resolve => {
        // tslint:disable-next-line:max-func-body-length
        setTimeout(() => {
            
            const mallLabels1Childs1:MallLabels = {
                id:Math.random(),  
                name:'红色',      
                pay_type:1,        
                price:0,    	
                childs:[],	 
                image:getImage()
            };
           
            const mallLabels1Childs2:MallLabels = {
                id:Math.random(),  
                name:'蓝色',      
                pay_type:1,        
                price:0,    	
                childs:[],	 
                image:getImage()
            };

            const mallLabels1Childs3:MallLabels = {
                id:Math.random(),  
                name:'黑色',      
                pay_type:1,        
                price:0,    	
                childs:[],	 
                image:getImage()	
            };
            const mallLabels1:MallLabels = {
                id:Math.random(),  
                name:'颜色',      
                pay_type:1,        
                price:0,    	
                childs:[mallLabels1Childs1,mallLabels1Childs2,mallLabels1Childs3],	 
                image:getImage()	
            };

            const mallLabels2Childs1:MallLabels = {
                id:Math.random(),  
                name:'大',      
                pay_type:1,        
                price:0,    	
                childs:[],	 
                image:getImage()		
            };
            const mallLabels2Childs2:MallLabels = {
                id:Math.random(),  
                name:'中',      
                pay_type:1,        
                price:0,    	
                childs:[],	 
                image:getImage()		
            };
            const mallLabels2Childs3:MallLabels = {
                id:Math.random(),  
                name:'小',      
                pay_type:1,        
                price:0,    	
                childs:[],	 
                image:getImage()		
            };
            const mallLabels2:MallLabels = {
                id:Math.random(),  
                name:'尺寸',      
                pay_type:1,        
                price:0,    	
                childs:[mallLabels2Childs1,mallLabels2Childs2,mallLabels2Childs3],	 
                image:getImage()		
            };
            const mallLabels3:MallLabels = {
                id:Math.random(),  
                name:'特价商品',      
                pay_type:1,        
                price:0,    	
                childs:[],	 
                image:getImage()		
            };

            const detail:GoodsSegmentationDetails = {
                name:'使用方法', 
                value:'此商品自行使用', 
                image:getImage() 
            };
           
            const good:GoodsDetails = {
                ...goods,
                labels:[mallLabels1,mallLabels2,mallLabels3],
                brand:undefined,
                area:undefined,
                supplier:undefined,
                weight:100,
                spec:undefined,
                detail:[detail],
                out:0,
                total_out:0
            };

            resolve(good);
        },200);
    });
};