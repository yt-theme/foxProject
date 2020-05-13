const querystring = require("querystring")
const bcrypt = require('bcrypt')

const routes_dispatch   = require("../../defs/routes_dispatch")
const { route_define }  = require("../utils/decorator")
const sql_func          = require("../../db/defs/mysql_func")
const token_func        = require("../../defs/token")

const config            = require("../../../config")

// 定义功能
class Account {
    constructor () {

    }

    // 注册 表(users)
    // @route_define
    static register (req, res) {
        if (req.method != 'POST') {
            res.end(JSON.stringify({ "ret": 0, msg: "register: !post not allowed" }))
            return false
        }
        
        // 接收数据
        let req_data = ''
        req.on('data', (chunk) => { req_data += chunk })
        req.on('end', () => {

            res.writeHead(200, {'Content-Type': 'application/json'})

            const params = querystring.parse(decodeURI(req_data))
            console.log("params =>", params)

            // db 增加用户操作
            sql_func.query('insert into users(name, passwd) values (?, ?)', 
                [params.name, bcrypt.hashSync(params.passwd, config.BCRYPT.SALT)]
            ).then((v) => {
                
                if (v.results) {
                    res.end(JSON.stringify({"ret": 1, "msg": '注册成功', "data": { "token": token_func.create(v.results.insertId) } }))
                }else {
                    res.end(JSON.stringify({"ret": 0, "msg": '注册失败', "data": 'null' }))
                }

            }).catch((err) => {
                console.log("db结果 err =>", err)
                res.end(JSON.stringify({ "ret": 0, "msg": '注册失败', "data": err }))
            })

            
        })    
    }

    // 检查登录
    static checklogin (req, res) {

    }
}

// 定义为路由
routes_dispatch.define('/register', 'POST', Account.register)
routes_dispatch.define('/checklogin', 'POST', Account.checklogin)

module.exports = Account