const fs = require("fs");
let express = require('express');
let router = express.Router();
let readPath = "./db/db3.json"

router.get('/history/list',(req,res)=>{
  fs.readFile(readPath, "UTF-8", function (err, data) {
    let result = {};
    if (err) {
      result = {
        code: 500,
        msg: err,
      };
      res.status(500).send(result);
    } else {
      if (data.toString().trim().length == 0) {
        result = {
          code: 500,
          msg: "正在读取文件",
        };
        res.status(500).send(result);
      } else {
        let dataOfDb = JSON.parse(data.toString()).list;
        dataOfDb.reverse();
        result = {
          code: 200,
          data: {
            list: dataOfDb,
            total: dataOfDb.length,
          },
        };
        res.status(200).send(result);
      }
      
    }
  });
})
/**
 *
 * @param {放置地点} readPath
 */
function queryDb(readPath) {
  let promise = new Promise((resolve, reject) => {
    fs.readFile(readPath, "UTF-8", function (err, data) {
      let result = {};
      if (err) {
        result = {
          code: 500,
          msg: err,
        };
        reject(result);
      } else {
        if (data.toString().trim().length == 0) {
          result = {
            code: 500,
            msg: "正在读取文件",
          };
          reject(result);
        } else {
          let dataOfDb = JSON.parse(data.toString()).list;
          dataOfDb.reverse();
          result = {
            code: 200,
            data: {
              list: dataOfDb,
              total: dataOfDb.length,
            },
          };
          resolve(result);
        }
        
      }
    });
  });
  return promise;
}
module.exports = router;
// queryDb(1, 10)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
