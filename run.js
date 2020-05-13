const tb_init_schema    = require("./server/db/init/table_init")    
const http_server       = require("./server/defs/http_instance")

const { HTTP_PORT }     = require("./config")
let routes         = require('./server/routes/routes')

// 表初始化
new tb_init_schema().user_table()

// 有请求时
http_server.on('request', function (req, res) {
    routes(req, res)
})

// 服务器关闭时
http_server.on('close', function () {
    console.log("服务器关闭 =>")
})

// 客户端连接错误
http_server.on('clientError', function (err, socket) {
    console.log("客户端连接错误 =>")
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

// 监听动作
http_server.listen(HTTP_PORT, function () {
    console.log('st at =>', HTTP_PORT)
})