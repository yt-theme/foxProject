const querystring = require("querystring")
const bcrypt = require('bcrypt')
const formidable = require('formidable')

const routes_dispatch   = require("../../defs/routes_dispatch")
const { route_define }  = require("../utils/decorator")
const sql_func          = require("../../db/defs/mysql_func")
const token_func        = require("../../defs/token")
const upload            = require("../../defs/upload")

const config            = require("../../../config")

class Upload {
    constructor () {

    }

    // 上传文件切片
    static upload_split (req, res) {
        let form = new formidable.IncomingForm()
        form.uploadDir = config.FORMIDABLE_TMP
        form.parse(req, async (err, fields, files) => {
            if (err) {
                // res.end(JSON.stringify({ "ret": 0, msg: "upload split fail"}))
                return false
            }
            // console.log("file =>", fields)

            const uid           = fields.uid
            const timestamp     = fields.timestamp
            const file_name     = fields.file_name
            const split_index   = fields.split_index
            const file_path     = files.file.path

            if (await upload.rec_split({ uid, timestamp, file_path, file_name, split_index })) {
                res.end(JSON.stringify({ "ret": 1, "msg": "upload split succ" }))
            } else {
                res.end(JSON.stringify({ "ret": 0, "msg": "upload split fail" }))
            }
        })
    }

    // 切片文件合并
    static split_combine (req, res) {
        let form = new formidable.IncomingForm()
        form.uploadDir = config.FORMIDABLE_TMP
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.end(JSON.stringify({ "ret": 0, msg: "upload split combine fail"}))
                return false
            }

            const uid           = fields.uid
            const timestamp     = fields.timestamp
            const file_name     = fields.file_name
            const total_split   = fields.total_split
            const split_index   = fields.split_index

            // 读临时文件目录
            if (await upload.split_combine({ uid, timestamp, file_name, total_split, split_index })) {
                res.end(JSON.stringify({ "ret": 1, "msg": "split combine succ" }))
            } else {
                res.end(JSON.stringify({ "ret": 0, "msg": "split combine fail" }))
            }
        })
    }
}

routes_dispatch.define('/uploadsplit',   'POST', Upload.upload_split)
routes_dispatch.define('/uploadcombine', 'POST', Upload.split_combine)

module.exports = Upload