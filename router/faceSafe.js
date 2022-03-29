const fs = require("fs");
let express = require('express');
let router = express.Router();
let readPath = "./db/db1.json"

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
 * @description 从别的地方取人员登机的信息
 * 通过request 方法获取数据存入
 * 
 */
function queryDb(readPath) {
  // let promise = new Promise((resolve, reject) => {
  //   fs.readFile(readPath, "UTF-8", function (err, data) {
  //     let result = {};
  //     if (err) {
  //       result = {
  //         code: 500,
  //         msg: err,
  //       };
  //       reject(result);
  //     } else {
  //       if (data.toString().trim().length == 0) {
  //         result = {
  //           code: 500,
  //           msg: "正在读取文件",
  //         };
  //         reject(result);
  //       } else {
  //         let dataOfDb = JSON.parse(data.toString()).list;
  //         dataOfDb.reverse();
  //         result = {
  //           code: 200,
  //           data: {
  //             list: dataOfDb,
  //             total: dataOfDb.length,
  //           },
  //         };
  //         resolve(result);
  //       }
        
  //     }
  //   });
  // });
  // return promise;

}




router.post('/history/list',(req,res)=>{
 
  let result={
    code:'0',
    data:{
      total:2,
      list:[
        {
          eventTime:"2022-03-29T16:36:23+08:00",
          personName:"aaa",
          orgName:'dfsd',
          doorName:'sdfsd'
        },
        {
          eventTime:"2022-03-29T16:36:23+08:00",
          personName:"aaa",
          orgName:'dfsd',
          doorName:'sdfsd'
        }
      ]
    }
  }
  res.status(200).send(result);
})
module.exports = router;
// queryDb(1, 10)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
