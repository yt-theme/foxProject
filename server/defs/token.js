const jwt = require("jsonwebtoken")

const mysql_func    = require("../db/defs/mysql_func")
const config        = require("../../config")

class Token {
    constructor () {

    }

    // 生成 token
    static create (id, lastlogin) {
        return jwt.sign(
            // payload
            { 
                "id": id,
                "exp": Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 367),
                "lastlogin": lastlogin  // 上次登录时间戳
            },
            // key
            config.TOKEN_KEY.PRIVATE,
            // option
            { algorithm: 'RS256' }
        )
    }

    // 验证 token
    static check (token) {
        return new Promise ((resolve, reject) => {
            
            let jwt_check_ret = jwt.verify(token, config.TOKEN_KEY.PUBLIC)
            if (!jwt_check_ret) { reject(false); return false }

            const id        = jwt_check_ret.id
            const exp       = jwt_check_ret.exp
            const iat       = jwt_check_ret.iat
            const lastlogin = jwt_check_ret.lastlogin

            mysql_func.query(
                'select * from users where id = ?',
                [id]
            ).then((v) => {
                if (v.results && v.results[0] && (v.results[0].id == id) && (iat <= exp)) {
                    // 如果查询出的上次登录时间戳等于token中的时间戳
                    if (v.results[0].lastlogin == lastlogin) {
                        resolve({ "name": v.results[0].name, "lastlogin": v.results[0].lastlogin })
                    } else {
                        reject(false)
                    }
                } else {
                    reject(false)
                }
            }).catch((err) => {
                console.log("token 验证 err =>", err)
                reject(false)
            })
        })
    }
}

module.exports = Token