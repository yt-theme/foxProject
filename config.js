const fs        = require('fs')
const path      = require('path')
const bcrypt    = require('bcrypt')

module.exports = {
    HTTP_PORT: 14498,

    // 配置静态文件目录 格式(路由名: 绝对路径)
    STATIC_PATH_OBJ: {
        '/static': path.join(__dirname, './static'),
        // '/upload': path.join(__dirname, './upload'),
        // '/upload/tmp': path.join(__dirname, './upload/tmp'),
        // '/upload/img': path.join(__dirname, './upload/img'),
        '/index': path.join(__dirname, './frontEnd/demo'),
    },

    // 上传文件的目录
    UPLOAD_PATH: {
        UPLOAD: path.join(__dirname, './upload'),
        TMP: path.join(__dirname, './upload/tmp'),
        IMG: path.join(__dirname, './upload/img')
    },

    // formidable 临时目录
    FORMIDABLE_TMP: path.join('./upload/tmp/formidable_tmp'),

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