const mysql = require('mysql2')

const config = require("../../../config")

class Mysql_pool {
    constructor () {
        this.mysql_pool = mysql.createPool({
            "connectionLimit": config.MYSQL.CONNECTION_LIMIT,
            "host":  config.MYSQL.HOST,
            "user":  config.MYSQL.USER,
            "password":  config.MYSQL.PASSWORD,
            "database":  config.MYSQL.DATABASE
        })
    }

    // 单例
    static get_instance () {
        if (!this.instance) {
            this.instance = new Mysql_pool()
        }
        return this.instance
    }

    // 获取连接池
    pool () {
        return this.mysql_pool
    }

    // 获取连接 promise 版
    conn_promise () {
        const __this__ = this
        return new Promise ((resolve, reject) => {
            __this__.mysql_pool.getConnection((err, connection) => {
                if (err) {
                    reject (false)
                } else {
                    resolve(connection.promise())
                }
            })
        })
    }

    // 操作数据
    query (sql, values=[]) {
        const __this__ = this
        return new Promise ((resolve, reject) => {
            __this__.mysql_pool.getConnection((err, connection) => {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (error, results, fields) => {
                        connection.release()
                        if (error) { reject(error) }
                        resolve([ results, fields ])
                    })
                }
            })
        })
    }
}



module.exports = Mysql_pool.get_instance()