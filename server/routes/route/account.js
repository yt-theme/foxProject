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
        req.on('end', async () => {

            res.writeHead(200, {'Content-Type': 'application/json'})
            const params = querystring.parse(decodeURI(req_data))
            console.log("params register =>", params)

            if ((!params.name) || (!params.passwd)) {
                res.end(JSON.stringify({ "ret": 0, "msg": '注册信息不完整', "data": err }))
                return false
            }

            // lastlogin时间默认值
            const lastlogin = new Date().getTime()

            /// 事务操作 ///
            const sql_promise = await sql_func.conn_promise()
            try {
                await sql_promise.beginTransaction()
                const db_insert_ret = await sql_promise.query('insert into users(name, passwd, lastlogin) values (?, ?, ?)', 
                                        [params.name, bcrypt.hashSync(params.passwd, config.BCRYPT.SALT), lastlogin])
                if (db_insert_ret[0]) {
                    await sql_promise.commit()
                    res.end(JSON.stringify({"ret": 1, "msg": '注册成功', "data": { "token": token_func.create(db_insert_ret[0].insertId, lastlogin.toString()) } }))
                }else {
                    await sql_promise.rollback()
                    res.end(JSON.stringify({"ret": 0, "msg": '注册失败', "data": null }))
                }

            } catch (e) {
                await sql_promise.rollback()
                res.end(JSON.stringify({"ret": 0, "msg": '注册失败', "data": e }))
            } finally {
                await sql_promise.release()
            }
        })    
    }

    // 检查登录 header中加{authorization: token}
    static checklogin (req, res) {
        if (req.method != 'POST') {
            res.end(JSON.stringify({ "ret": 0, msg: "checklogin: !post not allowed" }))
            return false
        }

        // 接收数据
        let req_data = ''
        req.on('data', (chunk) => { req_data += chunk })
        req.on('end', () => {

            res.writeHead(200, {'Content-Type': 'application/json'})
            const params = querystring.parse(decodeURI(req_data))
            console.log("params checklogin =>", params)

            const header_token = req.headers.authorization
            if (!header_token) {
                res.end(JSON.stringify({"ret": 0, "msg": '鉴权失败', "data": null }))
                return false
            }

            // 解析 token
            token_func.check(header_token).then((v) => {
                res.end(JSON.stringify({"ret": 1, "msg": '鉴权成功', "data": v }))
            }).catch((err) => {
                res.end(JSON.stringify({"ret": 0, "msg": '鉴权失败', "data": err }))
            })
        })
    }

    // 登录
    static login (req, res) {
        if (req.method != 'POST') {
            res.end(JSON.stringify({ "ret": 0, msg: "login: !post not allowed" }))
            return false
        }

        // 接收数据
        let req_data = ''
        req.on('data', (chunk) => { req_data += chunk })
        req.on('end', async () => {

            res.writeHead(200, {'Content-Type': 'application/json'})
            const params = querystring.parse(decodeURI(req_data))
            console.log("params login =>", params)

            const req_name    = params.name
            const req_passwd  = params.passwd

            if ((!req_name) || (!req_passwd)) {
                res.end(JSON.stringify({ "ret": 0, "msg": '登录信息不完整', "data": err }))
                return false
            }

            /// 事务操作 ///
            const sql_promise = await sql_func.conn_promise()
            try {
                await sql_promise.beginTransaction()
                const user_info_data  = await sql_promise.query('select id,passwd,lastlogin from users where name=?', [req_name])

                // 验证用户名
                if (!user_info_data[0][0]) {
                    await sql_promise.rollback()
                    res.end(JSON.stringify({"ret": 0, "msg": '用户名或密码不正确', "data": null }))
                    return false
                }

                // 验证密码
                if (!bcrypt.compareSync(req_passwd, user_info_data[0][0].passwd)) {
                    await sql_promise.rollback()
                    res.end(JSON.stringify({"ret": 0, "msg": '用户名或密码不正确', "data": null }))
                    return false
                }

                // 新时间戳
                const new_time = new Date().getTime()
                await sql_promise.query('update users set lastlogin=? where id=?', [new_time, user_info_data[0][0].id])
                await sql_promise.commit()
                res.end(JSON.stringify({"ret": 1, "msg": '登录成功', "data": { "token": token_func.create(user_info_data[0][0].id, new_time) } }))

            } catch (e) {
                await sql_promise.rollback()
                res.end(JSON.stringify({"ret": 0, "msg": '登录失败', "data": null }))
                
            } finally {
                await sql_promise.release()
            }
        })
    }
}

// 定义为路由
routes_dispatch.define('/register',   'POST', Account.register)
routes_dispatch.define('/checklogin', 'POST', Account.checklogin)
routes_dispatch.define('/login',      'POST', Account.login)

module.exports = Account