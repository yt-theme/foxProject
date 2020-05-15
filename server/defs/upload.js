const fs    = require('fs')
const path  = require("path")

const config = require("../../config")

class Upload {
    constructor () {

    }
    
    // 接收切片
    static async rec_split({ uid, timestamp, file_path, file_name, split_index }) {
        // 临时文件路径
        const chunk_path = path.join(config.UPLOAD_PATH.TMP, '/splits_' + timestamp + '_' + file_name + '_' + uid + '/')
        console.log("chunk_path =>", chunk_path)
        try {
            // 判断目录是否存在
            if (!fs.existsSync(chunk_path)) {
                fs.mkdirSync(chunk_path)    // 不存在 则建立
            }
            // 存储文件
            fs.renameSync(file_path, chunk_path + file_name + '.' + split_index)
            return true
        } catch (e) {
            console.log("接收切片 err =>", e)
        } finally {

        }
    }
    
    // 切片合并
    static async split_combine ({ uid, timestamp, file_name, total_split }) {
        // 临时文件位置
        const chunk_path     = path.join(config.UPLOAD_PATH.TMP, '/splits_' + timestamp + '_' + file_name + '_' + uid + '/')
        // 生成之后文件的位置
        const final_path     = path.join(config.UPLOAD_PATH.UPLOAD, '/' + uid + '/') //
        const final_path_abs = path.join(final_path, '/' + timestamp + '_' + file_name) // 同名文件覆盖

        // 读取临时文件路径所有切片
        const chunk_arr = fs.readdirSync(chunk_path)

        // 判断切片数量是否完整
        if ((chunk_arr.length != total_split) || (chunk_arr == 0)) {
            // 删除所有切片
            chunk_arr.forEach((ite) => { fs.unlinkSync(chunk_path + ite) })
            fs.rmdirSync(chunk_path)
            return false
        }

        // 创建以uid值为名字的目录
        if (!fs.existsSync(final_path)) {
            fs.mkdirSync(final_path)
        }

        // 合并为完整文件
        try {
            fs.writeFileSync(final_path_abs, '') // 创建文件
            chunk_arr.forEach((ite, ind) => {
                fs.appendFileSync(final_path_abs, fs.readFileSync(chunk_path + file_name + '.' + ind))
                // 删除追加使用过的切片
                fs.unlinkSync(chunk_path + file_name + '.' + ind)
            })
            // 删除临时文件目录
            fs.rmdirSync(chunk_path)
            return true
        } catch (e) {
            console.log("切片合并 err =>", e)
            return false
        }
    }
}

module.exports = Upload