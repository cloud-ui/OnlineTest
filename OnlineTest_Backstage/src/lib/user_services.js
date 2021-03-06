import axios from 'axios';
import Store from "./store";
import config from './config';

export default class Service {
    static get token() {
       return global.Store.getState().Session.Authorization;
    }

    //带header的基服务
    static get commonService() {
        let service = axios.create({
            baseURL: `${config.service.url}/api`,
            headers: { Authorization: Service.token, 'App-Version': '0.1.0' }
        });
        service.defaults.timeout = 12000;
        return service;
    }

    //session基服务
    static get sessionService() {
        let service = axios.create({
            baseURL: `${config.service.url}/api`,
        });
        service.defaults.timeout = 12000;
        return service;
    }

    //登录
    static sign_in(data = {}) {
        return new Promise(function (resolve, reject) {
            Service.sessionService.post(`/User/AdminLogin?account=${data.account}&password=${data.password}`, {}).then((ret) => {
                Store.dispatch({
                    type: 'SESSION:UP',
                    token: ret.data.token.data.token,
                    user: {
                        id: ret.data.userInfo.id,
                        name: ret.data.userInfo.nikename,
                        account: ret.data.userInfo.account
                    }
                });
                resolve(ret)
            }).catch(reject)
        });
    }

    //注销
    static sign_out() {
        Store.dispatch({
            type: 'SESSION:DOWN',
        });
    }
    //修改密码
    static changePassword(data = {}) {
        return Service.commonService.put(`/session/put_password`, data)
    }
    //根据角色获取到用户列表
    static getUserList(data = {}) {
        return Service.commonService.get(`/User/GetUserList`, {
            params: {
                status: data.status,
                currentPage: data.currentPage,
                pageSize: data.pageSize,
                query:data.query
            }
        })
    }
    //添加管理员
    static addAdmin(data = {}) {
        return Service.commonService.post(`/User/AddAdmin?account=${data.account}&password=${data.password}&nikename=${data.nickname}`);
    }
}
