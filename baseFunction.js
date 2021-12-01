const fs = require("fs");
/**
 *
 * @param {放置地点} readPath
 */
function queryDb(readPath) {
  // let pageNum = _pageNum;
  // let pageSize = _pageSize;
  // let queryRes = [];
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
          // for (
          //   let index = pageSize * (pageNum - 1);
          //   index <
          //   (pageSize * (pageNum + 1) > dataOfDb.length
          //     ? dataOfDb.length
          //     : pageSize * (pageNum + 1));
          //   index++
          // ) {
          //   queryRes.push(dataOfDb[index]);
          //   console.log(dataOfDb[index]);
          // }
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
exports.queryDb = queryDb;
// queryDb(1, 10)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
