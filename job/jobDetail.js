const fs = require("fs");

const request = require('request-promise');
const dbPath = "./db/"
//获取该目录下的所有文件
function readFiles(pathName) {
  let dirs = [];
  try {
    fs.readdirSync(pathName).forEach((file, index) => {
      dirs.push(file);
    });
  } catch (error) {
    console.log("目录不存在");
  }
  return dirs;
}
/**
 * 将文件的内容转为对象
 * @param {传入的文件数据} data
 */
function changeToObj(data) {
  let arr = data.split("\n");
  let obj = {};
  arr.forEach((item) => {
    console.log(item)
    if (item.split(":").length > 1) {
      let objName = item.split(":")[0].trim();
      let objVal = item.split(":")[1];
      if (objVal.indexOf(",") != -1) {
        obj[objName] = objVal.split(",")[0].trim();
      } else {
        obj[objName] = objVal.trim();
      }
    }
  });
  return obj;
}
/**
 * 获取当前数据文件中的数据并转换成字符
 * @returns
 */
function getOldDb(carme) {
  try {
    let dbName = "";
    if (carme == 1) {
      dbName = "db1.json";
    } else if (carme == 3) {
      dbName = "db3.json";
    }
    let content = fs.readFileSync(
      dbPath + dbName
    );
    if (content.toString().trim().length == 0) {
      return "";
    } else {
      return content.toString();
    }
  } catch (error) {
    console.log("oldDb false");
  }
}
/**
 * 读取文件
 * @param {*} pathName 
 * @param {*} readCarme 
 */
function jobOne(pathName, readCarme) {
  if (readFiles(pathName).length == 0) {
    console.log("文件夹为空");
  } else {
    /**
     * 将原本的db.json中的数据读取出来并且转换成为数组
     */
    let dataOfDb = {};
    //初始化判断db.json如果为空则进行结构化
    if (getOldDb(readCarme) == "") {
      console.log("getOldDb()");
      dataOfDb.list = [];
      dataOfDb.total = 0;
    } else {
      dataOfDb = JSON.parse(getOldDb(readCarme));
    }
    let writePath = "";
    if (readCarme == 1) {
      writePath = dbPath + "db1.json";
    } else if (readCarme == 3) {
      writePath = dbPath + "db3.json";
    }
    /**
     *将新的数据放到数组中，然后统一转换为写入json文件中（writeFile覆盖写入）
     */
    let fileNames = readFiles(pathName);
    for (let index = 0; index < fileNames.length; index++) {
      let data = fs.readFileSync(pathName + "/" + fileNames[index]).toString();
      let newData = changeToObj(data);
      dataOfDb.list.push(newData);
    }
    dataOfDb.total = dataOfDb.list.length;
    fs.writeFile(writePath, JSON.stringify(dataOfDb), (err) => {
      if (err) {
        console.log("重写失败：", err);
        return;
      } else {
        for (let index = 0; index < fileNames.length; index++) {
          fs.unlink(pathName + "/" + fileNames[index], function (error) {
            if (error) {
              console.log(error);
              return false;
            }
            console.log("删除文件" + fileNames[index]);
          });
        }
      }
    });
  }
}

/**
 * 获取今天需读取的文件目录
 */
function jobTwo() {
  let dirName = "";
  let nowTime = new Date();
  let year = nowTime.getFullYear().toString().slice(2);
  let month = (nowTime.getMonth() + 1).toString().length < 2 ? '0' + (nowTime.getMonth() + 1).toString() : (nowTime.getMonth() + 1).toString();
  let day = nowTime.getDate().toString().length < 2 ? '0' + nowTime.getDate().toString() : nowTime.getDate().toString();
  dirName = year + '-' + month + '-' + day
  return dirName
}

/**
 * @description 用于处理hk传入的日期数据的处理之后再写入json文件
 * @param {*} fmt 转换后的日期格式
 * @param {*} date  传入的日期 格式为：2022-03-26T16:36:23+08:00
 * @returns 
 */
function dateFormat(fmt, date) {
  let ret = "";
  date = new Date(date);
  console.log(date)
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    console.log(ret)
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      )
    }
  }
  return fmt
}




function writeDataToDBOne(data, total) {
  /**
     * 将原本的db.json中的数据读取出来并且转换成为数组
     */
  let dataOfDb = {};
  if (getOldDb(1) == "") {
    console.log("getOldDb()");
    dataOfDb.list = [];
    dataOfDb.total = 0;
  } else {
    dataOfDb = JSON.parse(getOldDb(1));
  }
  dataOfDb.total += total;
  data.forEach(item => {
    dataOfDb.list.push(item);
  })
  fs.writeFile(dbPath + "db1.json", JSON.stringify(dataOfDb), (err) => {
    if (err) {
      console.log("重写失败：", err);
      return;
    } else {
      console.log("重写成功");
    }
  });

}


/**
 * @description 定时JOB 用于调用海康的接口获取数据
 * @param {*} pathName  写入文件db1.json的路径
 * @param {*} reqUrl  海康的URL
 */
 function jobToGetHK(reqUrl) {
  let endTime = new Date().getTime();
  let startTime = endTime - 300000;
  endTime = (new Date(endTime).toISOString().split(".")[0]) + '+08:00';
  startTime = (new Date(startTime).toISOString().split(".")[0]) + '+08:00';
  let requestData = {
    pageNo: 1,
    pageSize: 1000,
    startTime: startTime,
    endTime: endTime
  }
  console.log(requestData);
  console.log(reqUrl);
  request({
    url: reqUrl,
    method: "POST",
    json: true,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(requestData)
  }).then(res => {
    console.log(res)
    let count = res.data.total
    let data = res.data.list
    writeDataToDBOne(data, count)
    
  }).catch(err => {
    console.log(err)
  })
  
}

exports.jobOne = jobOne;
exports.jobTwo = jobTwo;
exports.jobToGetHK = jobToGetHK;