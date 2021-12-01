const fs = require("fs");
let express = require('express');
const childProcess = require("child_process");
let router = express.Router();

let config
if (process.env.NODE_ENV === 'production') {
    config = require('../prod')
} else {
    config = require('../dev')
}
/**
 * 
 * 创建文件夹并写入文件夹名
 */
router.get('/create', (req, res) => {
    let result = {};
    let dirName = req.query.dirname;
    //recursive 无论上级路径是否存在都创建目录
    fs.mkdir(config.faceBaseDir + dirName, { recursive: true }, (err) => {
        if (err) {
            result = {
                code: 500,
                msg: "创建人脸录入文件夹失败"
            }
            res.status(500).send(result)
        } else {
            fs.writeFile(config.faceNameDocPath, dirName, err => {
                if (err) {
                    result = {
                        code: 500,
                        msg: "写入读取文件名失败"
                    }
                    res.status(500).send(result)
                } else {
                    result = {
                        code: 200,
                        msg: "创建人脸录入文件夹成功"
                    }
                    res.status(200).send(result);
                    console.log("创建文件成功" + config.faceBaseDir + dirName)
                }
            })

        }

    })

})


/**
 * 录入人脸调用的脚本
 */
router.get("/enter", (req, res) => {
    childProcess.exec('node ./router/getFace.js', (err, stdout, stderr) => {
        if (err) {
            result = {
                code: 500,
                msg: "读取脚本失败"
            }
            res.status(500).send(result)
        } else {
            result = {
                code: 200,
                msg: "成功录入"
            }
            res.status(200).send(result)
        }
    });

})
module.exports = router;