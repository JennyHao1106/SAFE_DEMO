const fs = require("fs");
const { resolve } = require("path");
const filePath = "E:/HJY/WORKSPACE/safe-demo-server/db.json";

/**
 *
 * @param {放置地点} place
 * @param {报警类型} alarmType
 */
function queryDb(_place, _alarmType) {
  let place = _place;
  let alarmType = _alarmType;
  let count = 0;
  let queryRes = [];
  let returnRes = {};
  if (typeof place == "undefined") {
    place = "";
  }
  if (typeof alarmType == "undefined") {
    alarmType = "";
  }
  let promise = new Promise((resolve) => {
    fs.readFile(filePath, "UTF-8", function (err, data) {
      let result = {};
      if (err) {
        result = {
          code: 500,
          msg: err,
        };
      } else {
        //res.status(200).send(data);
        let dataOfDb = JSON.parse(data.toString()).list;
        dataOfDb.forEach((item) => {
          if (
            (place != "" ? item.place_name == place : true) &&
            (alarmType != "" ? item.alarm_type == alarmType : true)
          ) {
            count++;
            queryRes.push(item);
          }
        });
        console.log(count);
        result = {
          code: 200,
          data: {
            list: queryRes,
            total: count,
          },
        };
      }
      resolve(result);
    });
  });
  promise.then((res) => {
    return res;
  });
  //   fs.readFile(filePath, "UTF-8", function (err, data) {
  //     if (err) {
  //         return {
  //         code: 500,
  //         msg: err,
  //       };
  //     } else {
  //       //res.status(200).send(data);
  //       let dataOfDb = JSON.parse(data.toString()).list;
  //       dataOfDb.forEach((item) => {
  //         if (
  //           (place != "" ? item.place_name == place : true) &&
  //           (alarmType != "" ? item.alarm_type == alarmType : true)
  //         ) {
  //           count++;
  //           queryRes.push(item);
  //         }
  //       });
  //       console.log(count);
  //       return {
  //         code: 200,
  //         data: {
  //           list: queryRes,
  //           total: count,
  //         },
  //       };
  //     }
  //   });
}
exports.queryDb = queryDb;
console.log(queryDb(1, ""));
