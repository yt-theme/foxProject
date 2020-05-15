// ##############################################################
//                    dispatch_routes 路由分发
//                    单例模式
// ##############################################################

const static_dir = require("./static_dir")

class Routes_dispatch {
    constructor () {
        this.routes_obj = {
            // route_name: {
            //     method: 'POST' || 'GET'
            //     func: Function
            //     module: modules
            // }
        }
    }

    // 单例
    static get_instance () {
        if (!this.instance) {
            this.instance = new Routes_dispatch()
        }
        return this.instance   
    }

    // 定义路由规则
    define (route_url, method, func, module=null) {
        this.routes_obj[route_url] = {
            "method":   method,
            "func":     func,
            "module":   module  // 路由所在模块 如果有的话
        }
    }

    // 路由上线
    online (module) {
        return module
    }

    // 路由执行
    do (url_str, req, res) {
        const url = url_str.split('?')[0]
        if (this.routes_obj[url]) {

            // POST
            if (this.routes_obj[url].method == 'POST') {
                this.routes_obj[url].func(req, res)
            }
            // GET
            else if (this.routes_obj[url].method == 'GET') {
                this.routes_obj[url].func(req, res)
            }
            // 其它不支持
            else {
                res.end(JSON.stringify({"ret": 0, "msg": 'request method not allowed'}))
                return false
            }
        } else {
            res.end(JSON.stringify({"ret": 0, "msg": 'no such route'}))
            return false
        }
    }
}

module.exports = Routes_dispatch.get_instance()