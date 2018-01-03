import axios from 'axios';
import Store from "./store";
import config from './config';

export default class Service {
    static get token() {
        return global.Store.getState().Session.Token;
    }

    //带header的基服务
    static get commonService() {
        let service = axios.create({
            baseURL: `${config.service.url}/api`,
            headers: {Token: Service.token, 'App-Version': '0.1.0'}
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
            Service.sessionService.post(`/session/platform`, data).then((ret) => {
                Store.dispatch({
                    type: 'SESSION:UP',
                    token: ret.data.token,
                    user: {
                        id: ret.data.id,
                        name: ret.data.name,
                        job:ret.data.position
                    }
                });
                resolve(ret)
            }).catch(reject)
        });
    }

    //注销
    static sign_out (){
        Store.dispatch({
            type: 'SESSION:DOWN',
        });
    }

    //修改密码
    static changePassword(data = {}) {
        return Service.commonService.put(`/session/put_password`, data)
    }
}