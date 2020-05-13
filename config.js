const fs        = require('fs')
const path      = require('path')
const bcrypt    = require('bcrypt')

module.exports = {
    HTTP_PORT: 14498,

    // 配置静态文件目录 格式(路由名: 绝对路径)
    STATIC_PATH_OBJ: {
        '/static': path.join(__dirname, './static'),
        '/upload': path.join(__dirname, './upload'),
        '/upload/tmp': path.join(__dirname, './upload'),
    },

    // token key
    TOKEN_KEY: {
          PRIVATE: fs.readFileSync(path.join(__dirname, './server/keys/rsa_private_key.pem')),
          PUBLIC: fs.readFileSync(path.join(__dirname, './server/keys/rsa_public_key.pem'))
    },

    // mysql
    MYSQL: {
        CONNECTION_LIMIT:   10,
        HOST:               'localhost',
        USER:               'root',
        PASSWORD:           'root',
        DATABASE:           'forum'
    },

    // bcrypt
    BCRYPT: {
        SALT: bcrypt.genSaltSync(10)
    }
}