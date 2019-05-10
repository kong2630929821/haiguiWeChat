import { Address, getStore, GoodsDetails, GoodsSegmentationDetails, Level1Groups, Level2Groups,MallImages, MallLabels, Order, OrderGoods, OrderStatus, setStore } from '../store/memstore';
import { requestAsync } from './login';

/**
 * 获取分组信息
 */
// tslint:disable-next-line:max-func-body-length
export const getGroups = () => {
    // tslint:disable-next-line:max-func-body-length
    return new Promise(resolve => {
        // tslint:disable-next-line:max-func-body-length
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
                        const mallLabels1Childs1:MallLabels = {
                            id:Math.random(),  
                            name:'红色',      
                            pay_type:1,        
                            price:Math.floor(Math.random() * 10 * 100),    	
                            childs:[],	 
                            image:getImage()
                        };
                       
                        const mallLabels1Childs2:MallLabels = {
                            id:Math.random(),  
                            name:'蓝色',      
                            pay_type:1,        
                            price:Math.floor(Math.random() * 10 * 100),    	
                            childs:[],	 
                            image:getImage()
                        };
            
                        const mallLabels1Childs3:MallLabels = {
                            id:Math.random(),  
                            name:'黑色',      
                            pay_type:1,        
                            price:Math.floor(Math.random() * 10 * 100),    	
                            childs:[],	 
                            image:getImage()	
                        };
                        const mallLabels1:MallLabels = {
                            id:Math.random(),  
                            name:'颜色',      
                            pay_type:1,        
                            price:Math.floor(Math.random() * 10 * 100),    	
                            childs:[mallLabels1Childs1,mallLabels1Childs2,mallLabels1Childs3],	 
                            image:getImage()	
                        };
            
                        const mallLabels2Childs1:MallLabels = {
                            id:Math.random(),  
                            name:'大',      
                            pay_type:1,        
                            price:Math.floor(Math.random() * 10 * 100),    	
                            childs:[],	 
                            image:getImage()		
                        };
                        const mallLabels2Childs2:MallLabels = {
                            id:Math.random(),  
                            name:'中',      
                            pay_type:1,        
                            price:Math.floor(Math.random() * 10 * 100),    	
                            childs:[],	 
                            image:getImage()		
                        };
                        const mallLabels2Childs3:MallLabels = {
                            id:Math.random(),  
                            name:'小',      
                            pay_type:1,        
                            price:Math.floor(Math.random() * 10 * 100),    	
                            childs:[],	 
                            image:getImage()		
                        };
                        const mallLabels2:MallLabels = {
                            id:Math.random(),  
                            name:'尺寸',      
                            pay_type:1,        
                            price:Math.floor(Math.random() * 10 * 100),    	
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
                        const good:GoodsDetails = {
                            id:goodsId,
                            name:Math.random() > 0.5 ? `商品名字很短${goodsId}` : `商品名字很长商品名字很长商品名字很长商品名字很长商品名字很长商品名字很长商品名字很长商品名字很长商品名字很长商品名字很长商品名字很长商品名字很长${goodsId}`,
                            pay_type:1,
                            rebate:200,
                            origin:1200,
                            discount:Math.random() > 0.5 ? 800 : 0,
                            vip_origin:Math.random() > 0.5 ? 1000 : 0,
                            has_tax,
                            tax:has_tax ? Math.floor(Math.random() * 100 * 10) : 0,
                            images:[image1,image2,image3],
                            intro:`商品${goodsId}的详细介绍`,
                            labels:[mallLabels1,mallLabels2,mallLabels3],
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

// 随机生成图片
const getImage = ():MallImages => {
    return  {
        path:`a${Math.floor(Math.random() * 100000) % 4 + 1}.png`,  
        type:1,
        style:1
    };
};

// 获取商品详细信息
// tslint:disable-next-line:max-func-body-length
export const getGoodsDetails = (goods:GoodsDetails):Promise<GoodsDetails> => {
    // tslint:disable-next-line:max-func-body-length
    return new Promise(resolve => {
        // tslint:disable-next-line:max-func-body-length
        setTimeout(() => {
            const detail:GoodsSegmentationDetails = {
                name:'使用方法', 
                value:'此商品自行使用', 
                image:getImage() 
            };
           
            const good:GoodsDetails = {
                ...goods,
                brand:undefined,
                area:undefined,
                supplier:Math.random() > 0.5 ? 123456 : 654321,
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

// 获取收货人地址列表
export const getAddresses = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            const address:Address = {
                id:1,		
                name:'陈二狗',       
                tel:'18324648321',       
                area:'四川省',        
                address:'四川省成都市高新区天府三街1140号17栋5-33号'  	
            };
            setStore('mall/addresses',[address]);
            resolve();
        },200);
    });
};

// 获取各种状态的订单
export const getOrders = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            const orders = [];
            for (let i = 0;i < 12;i++) {
                const orderId = Math.floor(Math.random() * 100000);
                const groups = [...getStore('mall/groups')];
                const goods:GoodsDetails[] = [...groups[0][1].childs][0][1].goods;
                const now = new Date().getTime();
                const mallLabels3:MallLabels = {
                    id:Math.random(),  
                    name:'特价商品',      
                    pay_type:1,        
                    price:0,    	
                    childs:[],	 
                    image:getImage()		
                };
                const mallLabels1:MallLabels = {
                    id:Math.random(),  
                    name:'黑色',      
                    pay_type:1,        
                    price:0,    	
                    childs:[],	 
                    image:getImage()		
                };
                const mallLabels2:MallLabels = {
                    id:Math.random(),  
                    name:'大',      
                    pay_type:1,        
                    price:0,    	
                    childs:[],	 
                    image:getImage()		
                };
                const orderGoods = [];
                for (const v of goods) {
                    const orderGood:OrderGoods = {
                        goods:v,
                        amount:Math.floor(Math.random() * 10),
                        labels:[mallLabels1,mallLabels2,mallLabels3] 
                    };
                    orderGoods.push(orderGood);
                }
                const order:Order = {
                    id:orderId,		       // 订单id
                    orderGoods,   // 已购买的商品
                    pay_type:1,       // 支付类型，1现金，2积分，3表示同时支持现金和积分
                    origin:Math.floor(Math.random() * 100 * 1000),         // 商品原支付金额，单位分，即所有商品单价乘数量
                    tax:Math.floor(Math.random() * 100 * 10),				// 	商品税费，单位分，即所有商品税费乘数量
                    freight:2000,        // 商品运费，单位分
                    other:0,          // 其它费用，单位分
                    weight:0,         // 商品总重量，单位克，即所有商品重量乘数量
                    name:'陈二狗',           // 收件人姓名
                    tel:'18328508594',            // 收件人电话
                    area:'四川省',           // 收件人地区
                    address:'四川省成都市高新区天府三街1140号17栋5-33号',        // 收件人详细地址
                    order_time:now,     // 下单时间，单位毫秒
                    pay_time:now + Math.floor(Math.random() * 10000),       // 支付时间，单位毫秒
                    ship_time:now + Math.floor(Math.random() * 1000000),      // 发货时间，单位毫秒
                    receipt_time:now + Math.floor(Math.random() * 100000),   // 收货时间，单位毫秒
                    finish_time:now + Math.floor(Math.random() * 200000)    // 完成时间，单位毫秒，已收货，但未完成，例如退货
                };
                orders.push(order);
            }
            const ordersMap = new Map();
            ordersMap.set(OrderStatus.PENDINGPAYMENT,orders);
            ordersMap.set(OrderStatus.PENDINGDELIVERED,orders);
            ordersMap.set(OrderStatus.PENDINGRECEIPT,orders);
            ordersMap.set(OrderStatus.COMPLETED,orders);
            setStore('mall/orders',ordersMap);
            resolve();
        },200);
    });
};
/**
 * 获取收益统计
 */
export const getEarningTotal = () => {
    const msg = {
        type:'mall/members@earnings_total',
        param:{}
    };

    return requestAsync(msg);
};

/**
 * 获取海宝列表
 */
export const getHBaoList = (year?:number,month?:number) => {
    let param = {};
    if (year) {
        param = {
            year: year,
            month: month
        };
    }
    const msg = {
        type:'mall/members@haibao_details',
        param:param
    };

    return requestAsync(msg);
};

/**
 * 获取伙伴列表
 */
export const getPartnerList = (year?:number,month?:number) => {
    let param = {};
    if (year) {
        param = {
            year: year,
            month: month
        };
    }
    const msg = {
        type:'mall/members@partner_details',
        param:param
    };

    return requestAsync(msg);
};

/**
 * 获取收益列表
 * ttype  1:现金,2:海贝,3:积分
 */
export const getEarningList = (year:number,month:number,ttype:number) => {
    const msg = {
        type:'mall/members@earnings_log',
        param:{
            year: year,
            month: month,
            type:ttype
        }
    };

    return requestAsync(msg);
};

/**
 * 获取邀请码
 */
export const getInviteCode = () => {
    const msg = {
        type:'mall/members@get_invitation_code',
        param:{}
    };

    return requestAsync(msg);
};