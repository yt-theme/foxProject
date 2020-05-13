// ##############################################################
//                             routes
// ##############################################################

const routes_dispatch = require("../defs/routes_dispatch")
const static_dir      = require("../defs/static_dir")

// 路由方法一定要在服务器启动前调用完毕
const account_route = require("./route/account")

module.exports = (req, res) => {

    // 检查是否为指向静态目录
    let static_check_res = static_dir.check(req.url)

    // ------------------------------------------------
    //                    静态文件
    // ------------------------------------------------
    if (static_check_res) {
        // 返回相应静态文件
        static_dir.handle(static_check_res['path'], res)
    }

    // ------------------------------------------------
    //                    接口
    // ------------------------------------------------
    else {
        routes_dispatch.do(req.url, req, res)
    }
}