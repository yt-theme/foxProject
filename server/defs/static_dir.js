// #################################################################
//                 static_dir 静态文件目录 单例模式
// #################################################################

const fs    = require("fs")
const path  = require("path")

const { STATIC_PATH_OBJ } = require("../../config")

class Static_dir {
    constructor () {
        /* 
            数据结构
            {
                '/path/to/direction': /home/absolure/direction/path
            }
        */
        this.static_obj = { ...STATIC_PATH_OBJ } // 重要数据
    }

    // 单例模式
    static get_instance () {
        if (!this.instance) {
            this.instance = new Static_dir()
        }
        return this.instance
    }

    // -------------------------------------------------------------
    //                         处理静态目录
    // -------------------------------------------------------------

    // 返回静态文件
    handle (file_path, res) {
        // 文件后缀
        let ext_name = path.extname(file_path)
        // 添加头信息
        if (ext_name.includes('html') || ext_name.includes('htm')) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' })
        }
        else if (ext_name == '.css') {
            res.writeHead(200, { 'Content-Type': 'text/css; charset=utf8' })
        }
        else if (ext_name == '.js') {
            res.writeHead(200, { 'Content-Type': 'application/x-javascript; charset=utf8' })
        } 
        else {
            res.writeHead(200, { 'Content-Type': 'octet-stream; charset=utf8' })
        }

        return new Promise ((resolve, reject) => {
            fs.createReadStream(file_path)
            .on('error', (error) => {
                res.end(JSON.stringify(error))
                reject(error)
            }).on('open', (chunk) => {
            }).on('data', (chunk) => {
                res.write(chunk)
            }).on('end', () => {
                res.end()
            })
        })
    }

    // -------------------------------------------------------------
    //                         操作数据
    // -------------------------------------------------------------

    // 设置静态目录
    set (dir_name) {
        this.static_obj[dir_name] = {}
    }

    // 检查是否是静态目录 返回绝对路径 || false
    check (url) {

        for (let ite in this.static_obj) {
            let pos_ind = url.indexOf(ite + "/")
            if (pos_ind == 0) {
                let url_right_left = url.substr(ite.length, url.length - 1)
                let split_obj = this.check_params(this.static_obj[ite] + url_right_left)
                return {
                    "path": split_obj.path,
                    "params": split_obj.params
                }
            }
        }

        return false
    }

    // 检查url参数
    check_params (url_str) {
        let str_arr = url_str.split("?")
        let params_list = {}
        if (str_arr[1]) {
            let righ_arr = str_arr[1].split('&')
            for (let i=0; i<righ_arr.length; i++) {
                let kv_arr = righ_arr[i].split("=")
                params_list[kv_arr[0]] = kv_arr[1]
            }
        }
        return {
            "path": str_arr[0],
            "params": params_list
        }
    }

    // 获取静态目录
    get (dir_name) {
        return this.static_obj[dir_name]
    }

    // 获取所有静态目录
    get_all () {
        return { ...this.static_obj }
    }
}

module.exports = Static_dir.get_instance()