const jwt = require("jsonwebtoken")

const mysql_func    = require("../db/defs/mysql_func")
const config        = require("../../config")

class Token {
    constructor () {

    }

    // 生成 token
    static create (id) {
        return jwt.sign(
            // payload
            { "id": id, "exp": new Date().getTime() / 1000 + (60*60*24*367) },
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

            const id    = jwt_check_ret.id
            const exp   = jwt_check_ret.exp
            const iat   = jwt_check_ret.iat

            mysql_func.query(
                'select * from users where id = ?',
                [id]
            ).then((v) => {
                if ((v[0].id == id) && (iat <= exp)) {
                    resolve(id)
                } else {
                    reject(false)
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }
}

module.exports = Token