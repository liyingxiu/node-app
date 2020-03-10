import axios from 'axios';
import { Loading,Message } from 'element-ui';

let loading;
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: "拼命加载ing",
        background: 'rgba(0, 0, 0, 0.7)'
    });
    
}

function endLoading() {
    loading.close();
}

//请求拦截
axios.interceptors.request.use(config => {
    console.log('加载动画');
    //加载动画
    startLoading();
    return config;
}, err => {
    return Promise.reject(err)
})
//响应拦截
axios.interceptors.response.use(response =>{
    console.log('结束加载动画');
    //结束加载动画
    endLoading();
    return response;
},err=>{
    //错误提醒
    endLoading();
    Message.error(err.response.data);
    return Promise.reject(err);
})

export default axios