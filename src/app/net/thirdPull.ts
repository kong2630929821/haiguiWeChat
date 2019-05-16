/**
 * 第三方接口调用
 */

const postData = (url, data) => {
    // Default options are marked with *
    return fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // *client, no-referrer
    })
    .then(response => response.json()); // parses response to JSON
};

 // 物流查询
export const queryLogistics = () => {
    const url = 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json';
    const data = {
        OrderCode: '',
        ShipperCode: 'SF',
        LogisticCode: '118650888018'
    };

    const dataStr = JSON.stringify(data);
    const encodeStr = encodeURIComponent(dataStr);

    postData(url,data).then(res => {
        console.log('queryLogistics',res);
    });
};